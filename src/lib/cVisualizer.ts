export interface VariableState {
  type: string;
  value: any;
  changed: boolean;
}

export interface FrameData {
  name: string;
  variables: Record<string, VariableState>;
}

export interface Step {
  step: number;
  line: number;
  frames: FrameData[];
  callStack: string[];
  output: string;
  error?: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Extract just the identifier name from a C declarator like "*ptr", "arr[5]", "x" */
function extractName(decl: string): string {
  return decl.trim().replace(/^\*+/, '').replace(/\s*\[.*\]$/, '').trim();
}

/** Strip C type keywords at start of a function parameter to get just the name */
function paramToJsName(param: string): string {
  const p = param.trim();
  // Handle void
  if (p === 'void' || p === '') return '';
  // Strip type: "int a" → "a", "float *b" → "b", "char str[]" → "str"
  const stripped = p
    .replace(/^(?:const\s+)?(?:unsigned\s+)?(?:int|float|double|char|long|short|void|signed)\s+/, '')
    .replace(/^\*+/, '')
    .replace(/\s*\[.*\]$/, '')
    .trim();
  // Take last token if there are still spaces (e.g. "long long x" → already reduced)
  const parts = stripped.split(/\s+/);
  return extractName(parts[parts.length - 1]);
}

/** Convert C format string + arg list into a JS template-literal console.log call */
function buildConsoleLog(rawFmt: string, rawArgs: string): string {
  // Parse the format string (already without surrounding quotes)
  // rawArgs is everything after the format string comma, may be empty
  const argList: string[] = [];
  if (rawArgs && rawArgs.trim()) {
    // Smart split on commas that are not inside parens/brackets
    let depth = 0;
    let cur = '';
    for (const ch of rawArgs) {
      if ('([{'.includes(ch)) depth++;
      else if (')]}'.includes(ch)) depth--;
      if (ch === ',' && depth === 0) {
        argList.push(cur.trim());
        cur = '';
      } else {
        cur += ch;
      }
    }
    if (cur.trim()) argList.push(cur.trim());
  }

  let argIdx = 0;
  let result = '';
  let i = 0;

  while (i < rawFmt.length) {
    const ch = rawFmt[i];

    if (ch === '%') {
      i++;
      if (i >= rawFmt.length) break;

      // Consume flags: -, +, space, 0, #
      while (i < rawFmt.length && '-+0 #'.includes(rawFmt[i])) i++;
      // Width
      while (i < rawFmt.length && rawFmt[i] >= '0' && rawFmt[i] <= '9') i++;
      // Precision
      let precision = '';
      if (i < rawFmt.length && rawFmt[i] === '.') {
        i++;
        while (i < rawFmt.length && rawFmt[i] >= '0' && rawFmt[i] <= '9') {
          precision += rawFmt[i++];
        }
      }
      // Length modifier (l, ll, h, hh, L) — consume silently
      while (i < rawFmt.length && 'hlL'.includes(rawFmt[i])) i++;

      const spec = rawFmt[i++];
      const arg = argList[argIdx++] || '0';

      if (spec === '%') {
        result += '%';
      } else if (spec === 'd' || spec === 'i' || spec === 'u') {
        result += `\${Math.trunc(Number(${arg}))}`;
      } else if (spec === 'f' || spec === 'F' || spec === 'g' || spec === 'G') {
        if (precision !== '') {
          result += `\${(Number(${arg})).toFixed(${precision})}`;
        } else {
          result += `\${(Number(${arg})).toFixed(6)}`;
        }
      } else if (spec === 'e' || spec === 'E') {
        result += `\${(Number(${arg})).toExponential(${precision || 6})}`;
      } else if (spec === 'c') {
        result += `\${typeof (${arg}) === 'number' ? String.fromCharCode(${arg}) : String(${arg})[0]}`;
      } else if (spec === 's') {
        result += `\${String(${arg})}`;
      } else if (spec === 'x') {
        result += `\${Math.trunc(Number(${arg})).toString(16)}`;
      } else if (spec === 'X') {
        result += `\${Math.trunc(Number(${arg})).toString(16).toUpperCase()}`;
      } else if (spec === 'o') {
        result += `\${Math.trunc(Number(${arg})).toString(8)}`;
      } else {
        result += `\${${arg}}`;
      }
    } else if (ch === '\\') {
      i++;
      const next = rawFmt[i] ?? '';
      if (next === 'n') { result += '\\n'; i++; }
      else if (next === 't') { result += '\\t'; i++; }
      else if (next === 'r') { result += '\\r'; i++; }
      else if (next === '\\') { result += '\\\\'; i++; }
      else if (next === '"') { i++; } // already unescaped by JS string parsing
      else if (next === '0') { result += '\\0'; i++; }
      else { result += '\\\\'; }
    } else if (ch === '`') {
      result += '\\`'; i++;
    } else if (ch === '$') {
      // Only escape $ not followed by {
      if (rawFmt[i + 1] !== '{') result += '\\$';
      else result += '$';
      i++;
    } else {
      result += ch;
      i++;
    }
  }

  return `console.log(\`${result}\`)`;
}

// ─── Variable declaration transformer ────────────────────────────────────────
const C_TYPES_RE = /^(?:const\s+)?(?:unsigned\s+|signed\s+)?(?:long\s+long|long\s+double|int|float|double|char|long|short)\s+/;

/** Try to transform a C variable declaration line to a JS let statement.
 *  Returns null if the line doesn't look like a declaration. */
function tryTransformDecl(trimmed: string, originalIndent: string): string | null {
  if (!C_TYPES_RE.test(trimmed)) return null;

  // Strip the type part
  const withoutType = trimmed.replace(C_TYPES_RE, '');
  // Must end with semicolon
  if (!withoutType.endsWith(';')) return null;
  const body = withoutType.slice(0, -1); // remove trailing ;

  // Split declarators by comma (naive — doesn't handle function pointers, but fine for our lessons)
  let depth = 0;
  let current = '';
  const declarators: string[] = [];
  for (const ch of body) {
    if ('([{'.includes(ch)) depth++;
    else if (')]}'.includes(ch)) depth--;
    if (ch === ',' && depth === 0) {
      declarators.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim()) declarators.push(current.trim());

  const jsDeclarators = declarators.map(d => {
    // d could be: x, x = 5, *ptr = &y, arr[5], arr[5] = {1,2,3}, arr[] = "hello"
    const eqIdx = d.indexOf('=');

    if (eqIdx === -1) {
      // No initialiser
      const name = extractName(d);
      if (!name) return null;
      // Check if it's an array declaration like arr[5]
      const arrMatch = d.match(/\*?\s*\w+\s*\[(\d*)\]/);
      if (arrMatch) {
        const size = parseInt(arrMatch[1]) || 0;
        // char array → empty string, int/float → zeros
        if (trimmed.match(/^(?:const\s+)?char\s+/)) {
          return `${name} = ""`;
        }
        return `${name} = new Array(${size || 1}).fill(0)`;
      }
      // Scalar — default value
      if (trimmed.match(/^(?:const\s+)?(?:unsigned\s+)?(?:int|long|short)\s+/)) return `${name} = 0`;
      if (trimmed.match(/^(?:const\s+)?(?:float|double|long\s+double)\s+/)) return `${name} = 0.0`;
      if (trimmed.match(/^(?:const\s+)?char\s+/)) return `${name} = ''`;
      return `${name} = 0`;
    }

    const lhs = d.substring(0, eqIdx).trim(); // e.g. "arr[5]", "*ptr", "x"
    let rhs = d.substring(eqIdx + 1).trim();  // e.g. "5", "{1,2,3}", "&x", "\"hello\""

    const name = extractName(lhs);
    if (!name) return null;

    // Convert C array init { … } to JS [ … ]
    if (rhs.startsWith('{') && rhs.endsWith('}')) {
      rhs = '[' + rhs.slice(1, -1) + ']';
    }

    // Strip address-of & when assigning pointer (approximate: just use the value)
    rhs = rhs.replace(/^&/, '');

    // Handle array lhs: arr[5] = ... → just use name
    return `${name} = ${rhs}`;
  }).filter(Boolean);

  if (!jsDeclarators.length) return null;
  return `${originalIndent}let ${jsDeclarators.join(', ')};`;
}

// ─── Line-by-line C→JS translation ───────────────────────────────────────────

interface TranslatedLine {
  js: string;
  cLineNum: number;      // original C line number (1-indexed)
  executable: boolean;   // should __capture__ be injected before this?
}

function translateCLines(code: string): TranslatedLine[] {
  const cLines = code.split('\n');
  const result: TranslatedLine[] = [];
  let inBlockComment = false;

  for (let i = 0; i < cLines.length; i++) {
    const cLineNum = i + 1;
    let line = cLines[i];
    const indent = line.match(/^(\s*)/)?.[1] ?? '';

    // ── Handle block comments ──────────────────────────────────────────────
    if (inBlockComment) {
      if (line.includes('*/')) {
        inBlockComment = false;
        line = line.substring(line.indexOf('*/') + 2);
      } else {
        result.push({ js: '', cLineNum, executable: false });
        continue;
      }
    }
    if (line.includes('/*')) {
      const s = line.indexOf('/*');
      if (line.includes('*/', s + 2)) {
        line = line.substring(0, s) + line.substring(line.indexOf('*/', s + 2) + 2);
      } else {
        inBlockComment = true;
        line = line.substring(0, s);
      }
    }
    // Strip line comments
    line = line.replace(/\/\/.*$/, '');

    const trimmed = line.trim();

    // ── Empty ──────────────────────────────────────────────────────────────
    if (!trimmed) {
      result.push({ js: '', cLineNum, executable: false });
      continue;
    }

    // ── Preprocessor ───────────────────────────────────────────────────────
    if (trimmed.startsWith('#')) {
      result.push({ js: '', cLineNum, executable: false });
      continue;
    }

    // ── Typedef / struct declarations ──────────────────────────────────────
    if (/^typedef\b/.test(trimmed) || /^struct\s+\w+\s*;/.test(trimmed)) {
      result.push({ js: `/* ${trimmed} */`, cLineNum, executable: false });
      continue;
    }

    // ── Pure braces ────────────────────────────────────────────────────────
    if (trimmed === '{' || trimmed === '}' || trimmed === '};') {
      result.push({ js: indent + trimmed, cLineNum, executable: false });
      continue;
    }

    // ── Function prototypes (declaration ending with ); ) ──────────────────
    // e.g. "int add(int a, int b);"
    if (
      /^(?:int|float|double|char|void|long|short)\s+\w+\s*\([^)]*\)\s*;$/.test(trimmed) &&
      !trimmed.includes('printf') && !trimmed.includes('scanf')
    ) {
      result.push({ js: `/* prototype: ${trimmed} */`, cLineNum, executable: false });
      continue;
    }

    // ── main() signature ────────────────────────────────────────────────────
    if (/^(?:int|void)\s+main\s*\(/.test(trimmed)) {
      // Emit just the opening brace if present, otherwise nothing
      result.push({ js: trimmed.includes('{') ? indent + '{' : '', cLineNum, executable: false });
      continue;
    }

    // ── Function declaration: ReturnType name(params) { ────────────────────
    const fnDeclMatch = trimmed.match(
      /^(?:int|float|double|char|void|long|short|unsigned\s+int|long\s+long)\s+\*?\s*(\w+)\s*\(([^)]*)\)\s*\{$/
    );
    if (fnDeclMatch) {
      const fnName = fnDeclMatch[1];
      const rawParams = fnDeclMatch[2].trim();
      const jsParams = rawParams === '' || rawParams === 'void'
        ? ''
        : rawParams.split(',').map(paramToJsName).filter(Boolean).join(', ');
      result.push({ js: `${indent}function ${fnName}(${jsParams}) {`, cLineNum, executable: false });
      continue;
    }

    // ── scanf ──────────────────────────────────────────────────────────────
    const scanfMatch = trimmed.match(/^scanf\s*\(\s*"((?:[^"\\]|\\.)*)"\s*((?:,[^)]*)?)?\s*\)\s*;$/);
    if (scanfMatch) {
      const fmt = scanfMatch[1];
      const argsStr = (scanfMatch[2] || '').replace(/^,/, '').trim();
      const argList = argsStr.split(',').map(a => a.trim().replace(/^&/, ''));
      let js = '';
      let argIdx = 0;
      let i = 0;
      while (i < fmt.length) {
        if (fmt[i] === '%') {
          i++;
          while (i < fmt.length && '-+0 #.0123456789hlL'.includes(fmt[i])) i++;
          const spec = fmt[i];
          const arg = argList[argIdx++];
          if (arg) {
            if (spec === 'd' || spec === 'i' || spec === 'u') js += `${arg} = __next_stdin('int'); `;
            else if (spec === 'f' || spec === 'F' || spec === 'g' || spec === 'e') js += `${arg} = __next_stdin('float'); `;
            else if (spec === 'c') js += `${arg} = __next_stdin('char'); `;
            else if (spec === 's') js += `${arg} = __next_stdin('string'); `;
            else js += `${arg} = __next_stdin('int'); `;
          }
        }
        i++;
      }
      if (js) {
        result.push({ js: indent + js, cLineNum, executable: true });
        continue;
      }
    }

    // ── fgets / gets → skip ─────────────────────────────────────────
    if (/\bfgets\s*\(/.test(trimmed) || /\bgets\s*\(/.test(trimmed)) {
      result.push({ js: indent + '/* input skipped */', cLineNum, executable: false });
      continue;
    }

    // ── printf ──────────────────────────────────────────────────────────────
    // Match: printf("format", arg1, arg2, ...);
    // Also handle: printf("format");
    const printfMatch = trimmed.match(/^printf\s*\(\s*"((?:[^"\\]|\\.)*)"\s*((?:,[^)]*)?)?\s*\)\s*;$/);
    if (printfMatch) {
      const fmt = printfMatch[1];
      const argsStr = (printfMatch[2] || '').replace(/^,/, '').trim();
      const logCall = buildConsoleLog(fmt, argsStr);
      result.push({ js: indent + logCall + ';', cLineNum, executable: true });
      continue;
    }

    // ── for loop with type declaration ──────────────────────────────────────
    // for (int i = 0; i < n; i++) → for (let i = 0; i < n; i++)
    {
      const forMatch = trimmed.match(/^(for\s*\(\s*)(?:int|float|char|long|short)\s+(.*)$/);
      if (forMatch) {
        result.push({ js: indent + forMatch[1] + 'let ' + forMatch[2], cLineNum, executable: true });
        continue;
      }
    }

    // ── Variable declarations ────────────────────────────────────────────────
    {
      const decl = tryTransformDecl(trimmed, indent);
      if (decl !== null) {
        result.push({ js: decl, cLineNum, executable: true });
        continue;
      }
    }

    // ── return 0; ────────────────────────────────────────────────────────────
    if (/^return\s+0\s*;$/.test(trimmed)) {
      result.push({ js: '', cLineNum, executable: false });
      continue;
    }

    // ── Everything else — pass through ────────────────────────────────────────
    result.push({ js: indent + trimmed, cLineNum, executable: true });
  }

  return result;
}

// ─── Collect declared variable names from C source ────────────────────────────
function collectVarNames(code: string): Set<string> {
  const names = new Set<string>();
  const lines = code.split('\n');

  for (const line of lines) {
    const trimmed = line.trim().replace(/\/\/.*$/, '');
    if (!trimmed || trimmed.startsWith('#')) continue;

    if (!C_TYPES_RE.test(trimmed)) continue;
    if (!trimmed.endsWith(';')) continue;

    // Skip function prototypes
    if (/\)\s*;$/.test(trimmed) && trimmed.includes('(')) continue;

    const withoutType = trimmed.replace(C_TYPES_RE, '').slice(0, -1);
    // Extract names from declarators
    withoutType.split(',').forEach(decl => {
      const name = extractName(decl.split('=')[0]);
      if (name && /^[a-zA-Z_]\w*$/.test(name)) names.add(name);
    });
  }

  // Also catch for-loop variables: for (int i = …
  const forVarRe = /\bfor\s*\(\s*(?:int|float|char|long|short)\s+(\w+)/g;
  let m: RegExpExecArray | null;
  while ((m = forVarRe.exec(code)) !== null) names.add(m[1]);

  return names;
}

// ─── Main tracer entry point ───────────────────────────────────────────────────
export function traceCCode(code: string, stdin: string = ''): Promise<Step[]> {
  return new Promise((resolve) => {

    const varNames = collectVarNames(code);

    // Build translated lines with C line number tags
    const translatedLines = translateCLines(code);

    // Build the capture object expression
    const captureObjStr = Array.from(varNames).map(name =>
      `"${name}": (() => { try { return typeof ${name} !== 'undefined' ? ${name} : undefined; } catch(e) { return undefined; } })()`
    ).join(', ');

    // Build instrumented JS:
    // Before every executable translated line, inject __capture__(cLineNum, {...})
    let instrumentedJS = '';
    for (const tl of translatedLines) {
      if (!tl.js && !tl.executable) {
        instrumentedJS += '\n'; // blank line to keep JS errors pointing to right place
        continue;
      }
      if (tl.executable) {
        instrumentedJS += `__capture__(${tl.cLineNum}, {${captureObjStr}});\n`;
      }
      instrumentedJS += tl.js + '\n';
    }
    // Capture final state
    instrumentedJS += `\n__capture__(${translatedLines.length}, {${captureObjStr}});\n`;

    // Build sandboxed iframe. We CANNOT embed instrumentedJS inside a template literal
    // because it contains backticks and ${...} from printf translations.
    // Instead: create a Blob worker URL and load it as a separate script.
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.setAttribute('sandbox', 'allow-scripts');

    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.source === 'c-visualizer') {
        window.removeEventListener('message', handleMessage);
        if (document.body.contains(iframe)) document.body.removeChild(iframe);
        resolve(event.data.steps || []);
      }
    };
    window.addEventListener('message', handleMessage);

    // The runner script receives the code via postMessage then executes it
    const runnerSrc = `
const __steps = [];
let __output = '';
let __stepCount = 0;
let __stdin = [];
let __stdinIdx = 0;

const console = {
  log: (...args) => { __output += args.join('') + '\\n'; },
  error: (...args) => { __output += args.join(' ') + '\\n'; }
};

function __next_stdin(type) {
  if (__stdinIdx >= __stdin.length) return type === 'string' || type === 'char' ? '' : 0;
  const val = __stdin[__stdinIdx++];
  if (type === 'int') return parseInt(val, 10) || 0;
  if (type === 'float') return parseFloat(val) || 0.0;
  if (type === 'char') return val[0] || '';
  return val;
}

function __capture__(lineNum, varsObj) {
  __stepCount++;
  if (__stepCount > 700) throw new Error('Execution exceeded 700 steps — possible infinite loop');
  const vars = {};
  for (const [k, v] of Object.entries(varsObj)) {
    if (v === undefined) continue;
    let type = 'int';
    if (typeof v === 'number' && Number.isInteger(v)) type = 'int';
    else if (typeof v === 'number') type = 'float';
    else if (typeof v === 'string' && v.length === 1) type = 'char';
    else if (typeof v === 'string') type = 'char*';
    else if (typeof v === 'boolean') type = 'int';
    else if (Array.isArray(v)) type = 'array';
    else if (typeof v === 'object' && v !== null) type = 'struct';
    let val = v;
    if (type === 'array' || type === 'struct') {
      try { val = JSON.parse(JSON.stringify(v)); } catch(e) { val = String(v); }
    }
    vars[k] = { type, value: val, changed: false };
  }
  __steps.push({
    step: __stepCount,
    line: lineNum,
    frames: [{ name: 'main()', variables: vars }],
    callStack: ['main'],
    output: __output,
    error: null,
  });
}

window.addEventListener('message', function(e) {
  if (!e.data || e.data.type !== 'run-c') return;
  const code = e.data.code;
  __stdin = e.data.stdin ? e.data.stdin.split(/\\s+/).filter(Boolean) : [];
  try {
    // eslint-disable-next-line no-new-func
    new Function(code)();
  } catch(err) {
    const errMsg = err.name + ': ' + err.message;
    if (__steps.length > 0) {
      __steps[__steps.length - 1].error = errMsg;
    } else {
      __steps.push({ step: 1, line: 1, frames: [{ name: 'main()', variables: {} }], callStack: ['main'], output: __output, error: errMsg });
    }
  }
  window.parent.postMessage({ source: 'c-visualizer', steps: __steps }, '*');
});

window.onerror = function(msg) {
  window.parent.postMessage({ source: 'c-visualizer', steps: __steps }, '*');
  return true;
};
`;

    const iframeHtml = `<!DOCTYPE html><html><head></head><body><script>${runnerSrc}<\/script></body></html>`;

    document.body.appendChild(iframe);

    iframe.onload = () => {
      iframe.contentWindow?.postMessage({ type: 'run-c', code: instrumentedJS, stdin: stdin }, '*');
    };

    iframe.srcdoc = iframeHtml;

    setTimeout(() => {
      if (document.body.contains(iframe)) {
        window.removeEventListener('message', handleMessage);
        document.body.removeChild(iframe);
        resolve([{
          step: 1, line: 1, frames: [], callStack: [], output: '',
          error: 'Execution timed out (possible infinite loop)',
        }]);
      }
    }, 5000);
  });
}

