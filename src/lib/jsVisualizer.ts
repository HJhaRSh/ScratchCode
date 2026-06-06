import * as acorn from 'acorn';

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

export function traceJSCode(code: string): Promise<Step[]> {
  return new Promise((resolve) => {
    // 1. Extract variables for scope tracking
    const varRegex = /(?:const|let|var|function)\s+([a-zA-Z_$][0-9a-zA-Z_$]*)/g;
    const varNames = new Set<string>();
    let match;
    while ((match = varRegex.exec(code)) !== null) {
      varNames.add(match[1]);
    }
    const loopVarRegex = /for\s*\(\s*(?:const|let|var)\s+([a-zA-Z_$][0-9a-zA-Z_$]*)/g;
    while ((match = loopVarRegex.exec(code)) !== null) {
      varNames.add(match[1]);
    }

    const captureObjStr = Array.from(varNames).map(name => 
      `"${name}": (() => { try { return ${name}; } catch(e) { return undefined; } })()`
    ).join(', ');

    // 2. Instrument the code using precise AST boundaries
    let instrumentedCode = code;
    try {
      // @ts-ignore
      const ast = acorn.parse(code, { ecmaVersion: 2022, locations: true });
      const injections: { pos: number; line: number }[] = [];

      const walk = (node: any, parent: any) => {
        if (!node || typeof node !== 'object') return;
        
        // Only inject before actual statements inside blocks/programs (never inside ClassBody, ObjectExpression, etc.)
        if (node.type && (node.type.endsWith('Statement') || node.type === 'VariableDeclaration')) {
          if (parent && (parent.type === 'BlockStatement' || parent.type === 'Program')) {
             if (node.loc && typeof node.start === 'number') {
                injections.push({ pos: node.start, line: node.loc.start.line });
             }
          }
        }
        
        for (const key in node) {
          if (key === 'loc' || key === 'start' || key === 'end') continue;
          const child = node[key];
          if (Array.isArray(child)) {
             for (const c of child) {
                 if (c && typeof c === 'object') walk(c, node);
             }
          } else if (child && typeof child === 'object') {
             walk(child, node);
          }
        }
      };

      walk(ast, { type: 'Program' });

      // Sort descending by position so insertions don't shift subsequent target offsets
      injections.sort((a, b) => b.pos - a.pos);

      for (const inj of injections) {
         instrumentedCode = instrumentedCode.substring(0, inj.pos) + 
                            `__capture__(${inj.line}, {${captureObjStr}});\n` + 
                            instrumentedCode.substring(inj.pos);
      }
      
      // Capture final state
      instrumentedCode += `\n__capture__(${code.split('\\n').length}, {${captureObjStr}});\n`;
    } catch (e: any) {
      // If code has a genuine syntax error, acorn will throw. Return immediately.
      return resolve([{
        step: 1, line: 1, frames: [], callStack: [], output: '', error: 'SyntaxError: ' + e.message
      }]);
    }

    // 3. Create sandboxed iframe execution environment
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.setAttribute('sandbox', 'allow-scripts');

    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.source === 'js-visualizer') {
        window.removeEventListener('message', handleMessage);
        document.body.removeChild(iframe);
        resolve(event.data.steps || []);
      }
    };

    window.addEventListener('message', handleMessage);

    const iframeHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <script>
          window.onerror = function(msg) {
             window.parent.postMessage({ 
               source: 'js-visualizer', 
               steps: [{ step: 1, line: 1, frames: [], callStack: [], output: '', error: msg }] 
             }, '*');
          };
        </script>
      </head>
      <body>
        <script>
          const __steps = [];
          let __output = '';
          let __stepCount = 0;
          
          const console = {
            log: (...args) => {
              __output += args.join(' ') + '\\n';
            }
          };

          function __capture__(lineNum, varsObj) {
            __stepCount++;
            if (__stepCount > 500) {
              throw new Error("Execution exceeded 500 steps — possible infinite loop detected");
            }
            
            const formattedVars = {};
            for (const [k, v] of Object.entries(varsObj)) {
              if (v !== undefined) {
                let type = 'unknown';
                if (typeof v === 'number' && Number.isInteger(v)) type = 'int';
                else if (typeof v === 'number' && !Number.isInteger(v)) type = 'float';
                else if (typeof v === 'string') type = 'str';
                else if (typeof v === 'boolean') type = 'bool';
                else if (v === null) type = 'none';
                else if (Array.isArray(v)) type = 'list';
                else if (typeof v === 'function') type = 'fn';
                else if (typeof v === 'object') type = 'dict';
                
                let safeVal = v;
                if (type === 'fn') safeVal = v.name || 'function';
                else if (type === 'dict' || type === 'list') {
                  try { safeVal = JSON.parse(JSON.stringify(v)); } catch(e) { safeVal = String(v); }
                }
                
                formattedVars[k] = {
                  type: type,
                  value: safeVal,
                  changed: false
                };
              }
            }
            
            __steps.push({
              step: __stepCount,
              line: lineNum,
              frames: [{ name: 'Global frame', variables: formattedVars }],
              callStack: ['global'],
              output: __output,
              error: null
            });
          }

          try {
            ${instrumentedCode}
          } catch(e) {
            if (__steps.length > 0) {
               __steps[__steps.length - 1].error = e.name + ': ' + e.message;
            } else {
               __steps.push({
                 step: 1, line: 1, frames: [{ name: 'Global frame', variables: {} }], callStack: ['global'], output: __output, error: e.name + ': ' + e.message
               });
            }
          }
          
          window.parent.postMessage({ source: 'js-visualizer', steps: __steps }, '*');
        </script>
      </body>
      </html>
    `;

    document.body.appendChild(iframe);
    iframe.srcdoc = iframeHtml;

    // Timeout fallback just in case of complete freeze within iframe sync code
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        window.removeEventListener('message', handleMessage);
        document.body.removeChild(iframe);
        resolve([{
          step: 1, line: 1, frames: [], callStack: [], output: '', 
          error: "Execution timed out (infinite loop?)"
        }]);
      }
    }, 2000);
  });
}
