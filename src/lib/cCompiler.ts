export function transpileCtoJS(code: string): string {
  const lines = code.split('\n');
  const result: string[] = [];
  let inBlockComment = false;

  const C_TYPES_RE = /^(?:const\s+)?(?:unsigned\s+)?(?:int|float|double|char|long\s+long|long|short|void)\s+\*?\s*/;

  // Helper to extract var name
  function extractName(decl: string) {
    const m = decl.trim().match(/^\*?\s*([a-zA-Z_]\w*)/);
    return m ? m[1] : null;
  }

  for (let line of lines) {
    if (inBlockComment) {
      if (line.includes('*/')) {
        inBlockComment = false;
        line = line.substring(line.indexOf('*/') + 2);
      } else {
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
    line = line.replace(/\/\/.*$/, '');
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) continue;

    // Struct / Typedef skip
    if (/^typedef\b/.test(trimmed) || /^struct\s+\w+\s*;/.test(trimmed)) continue;

    // Skip main() signature
    if (/^(?:int|void)\s+main\s*\(/.test(trimmed)) {
      if (trimmed.includes('{')) result.push('{');
      continue;
    }

    // scanf
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
            if (spec === 'c') js += `${arg} = await __next_stdin('char'); `;
            else if (spec === 's') js += `${arg} = await __next_stdin('string'); `;
            else if (spec === 'f' || spec === 'F' || spec === 'g' || spec === 'e') js += `${arg} = parseFloat(await __next_stdin('float')); `;
            else js += `${arg} = parseInt(await __next_stdin('int'), 10); `;
          }
        }
        i++;
      }
      if (js) {
        result.push(js);
        continue;
      }
    }

    // printf
    const printfMatch = trimmed.match(/^printf\s*\(\s*"((?:[^"\\]|\\.)*)"\s*((?:,[^)]*)?)?\s*\)\s*;$/);
    if (printfMatch) {
      const fmt = printfMatch[1];
      const argsStr = (printfMatch[2] || '').replace(/^,/, '').trim();
      const args = argsStr ? `[${argsStr}]` : '[]';
      result.push(`__printf("${fmt.replace(/"/g, '\\"')}", ${args});`);
      continue;
    }

    // Variables
    if (C_TYPES_RE.test(trimmed) && trimmed.endsWith(';')) {
      const withoutType = trimmed.replace(C_TYPES_RE, '').slice(0, -1);
      const declarators = withoutType.split(',');
      const jsDeclarators = declarators.map(d => {
        const eqIdx = d.indexOf('=');
        if (eqIdx === -1) {
          const name = extractName(d);
          if (!name) return null;
          if (trimmed.match(/^(?:const\s+)?char\s+/)) return `${name} = ''`;
          return `${name} = 0`;
        }
        const name = extractName(d.substring(0, eqIdx));
        let rhs = d.substring(eqIdx + 1).trim();
        if (rhs.startsWith('{') && rhs.endsWith('}')) rhs = '[' + rhs.slice(1, -1) + ']';
        rhs = rhs.replace(/^&/, '');
        return `${name} = ${rhs}`;
      }).filter(Boolean);
      
      if (jsDeclarators.length) {
        result.push(`let ${jsDeclarators.join(', ')};`);
        continue;
      }
    }

    // For loops
    const forMatch = trimmed.match(/^(for\s*\(\s*)(?:int|float|char|long|short)\s+(.*)$/);
    if (forMatch) {
      result.push(forMatch[1] + 'let ' + forMatch[2]);
      continue;
    }

    if (/^return\s+0\s*;$/.test(trimmed)) continue;

    result.push(trimmed);
  }

  return `
    async function main() {
      ${result.join('\n')}
    }
    main().then(() => __exit(0)).catch(e => __error(e));
  `;
}
