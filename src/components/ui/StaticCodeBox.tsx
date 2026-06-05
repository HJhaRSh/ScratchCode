import React from 'react';

interface StaticCodeBoxProps {
  code: string;
  language?: string;
}

export function highlightSyntax(text: string, language: string = 'code') {
  // Basic escaping
  let escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const lang = language.toLowerCase();

  if (lang === 'html') {
    return escaped
      // HTML Comments
      .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="text-slate-500 italic">$1</span>')
      // DOCTYPE
      .replace(/(&lt;!DOCTYPE[^&]*&gt;)/gi, '<span class="text-slate-500">$1</span>')
      // Closing tags
      .replace(/(&lt;\/)([\w-]+)(&gt;)/g, '<span class="text-slate-400">$1</span><span class="text-rose-400 font-semibold">$2</span><span class="text-slate-400">$3</span>')
      // Opening tags with attributes: <tagname
      .replace(/(&lt;)([\w-]+)((?:\s[^&]*)?)(&gt;)/g, (_, open, tag, attrs, close) => {
        const coloredAttrs = attrs
          // attribute="value"
          .replace(/([\w-]+)=(["'][^"']*["'])/g, '<span class="text-sky-300">$1</span>=<span class="text-amber-300">$2</span>')
          // boolean attribute
          .replace(/\s([\w-]+)(?=[&\s])/g, ' <span class="text-sky-300">$1</span>');
        return `<span class="text-slate-400">${open}</span><span class="text-emerald-400 font-semibold">${tag}</span>${coloredAttrs}<span class="text-slate-400">${close}</span>`;
      })
      // Self-closing tags <br> <img>
      .replace(/(&lt;)([\w-]+)((?:\s[^&]*)?)(\s*\/&gt;)/g, (_, open, tag, attrs, close) => {
        const coloredAttrs = attrs
          .replace(/([\w-]+)=(["'][^"']*["'])/g, '<span class="text-sky-300">$1</span>=<span class="text-amber-300">$2</span>');
        return `<span class="text-slate-400">${open}</span><span class="text-yellow-400 font-semibold">${tag}</span>${coloredAttrs}<span class="text-slate-400">${close}</span>`;
      });
  }

  if (lang === 'css') {
    return escaped
      // Comments
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-slate-500 italic">$1</span>')
      // @rules like @media, @keyframes
      .replace(/(@[\w-]+)/g, '<span class="text-pink-400 font-semibold">$1</span>')
      // CSS selectors (lines ending in {)
      .replace(/^([^{}\n:]+)(\s*\{)/gm, (_, sel, brace) => {
        const coloredSel = sel.replace(/(\.[\w-]+)/g, '<span class="text-yellow-300">$1</span>')
          .replace(/(#[\w-]+)/g, '<span class="text-amber-400">$1</span>');
        return `${coloredSel}<span class="text-slate-400">${brace}</span>`;
      })
      // Property: value;
      .replace(/([\w-]+)\s*:/g, '<span class="text-sky-300">$1</span>:')
      // Values - colors hex
      .replace(/(#[0-9a-fA-F]{3,8})\b/g, '<span class="text-amber-300">$1</span>')
      // Values - px/em/rem/% numbers
      .replace(/\b(\d+(?:\.\d+)?(?:px|em|rem|%|vh|vw|fr|s|ms|deg)?)\b/g, '<span class="text-purple-300">$1</span>')
      // Strings
      .replace(/('([^']*)'|"([^"]*)")/g, '<span class="text-amber-300">$1</span>');
  }

  // Python, JavaScript, TypeScript, and general languages
  return escaped
    // Multi-line comments
    .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-slate-500 italic">$1</span>')
    // Single-line comments // and #
    .replace(/(\/\/[^\n]*|#[^\n]*)/g, '<span class="text-slate-500 italic">$1</span>')
    // Triple-quoted strings (Python docstrings)
    .replace(/("""[\s\S]*?"""|\'\'\'[\s\S]*?\'\'\')/g, '<span class="text-amber-200/80">$1</span>')
    // f-strings and regular strings
    .replace(/(f"[^"]*"|f'[^']*')/g, (m) => {
      // highlight {vars} inside f-strings
      const inner = m.replace(/\{([^}]+)\}/g, '<span class="text-cyan-300">{$1}</span>');
      return `<span class="text-amber-300">${inner}</span>`;
    })
    // Regular strings
    .replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, '<span class="text-amber-300">$1</span>')
    // Numbers
    .replace(/\b(\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)\b/g, '<span class="text-purple-300">$1</span>')
    // Decorators (@decorator)
    .replace(/(^|\s)(@[\w.]+)/gm, '$1<span class="text-amber-400">$2</span>')
    // Built-in functions
    .replace(/\b(print|len|range|type|int|float|str|bool|list|dict|set|tuple|input|sum|min|max|abs|sorted|enumerate|zip|map|filter|open|super|isinstance|hasattr|getattr|setattr|console\.log|console\.error|document|window|Math|JSON|Array|Object|String|Number|Boolean|Promise|fetch|require|module\.exports)\b/g, '<span class="text-cyan-400">$1</span>')
    // Python/JS keywords
    .replace(/\b(and|or|not|in|is|None|True|False|pass|break|continue|yield|raise|lambda|with|as|async|await|from|global|nonlocal|assert|del|try|except|finally|else if|function|return|def|package|import|from|const|let|var|if|else|for|while|class|struct|new|this|self|typeof|instanceof|of|in|export|default|extends|implements|interface|type|enum|namespace|abstract|static|public|private|protected|readonly|override)\b/g, '<span class="text-pink-400 font-medium">$1</span>')
    // Arrow functions and operators
    .replace(/(\=&gt;|===|!==|&&|\|\||\?\?|\?\.)/g, '<span class="text-yellow-300">$1</span>')
    // Function declarations/calls
    .replace(/\b([\w]+)(?=\()/g, (m) => {
      if (/^(if|for|while|switch|catch|with)$/.test(m)) return m;
      return `<span class="text-emerald-400">${m}</span>`;
    })
    // Class names (PascalCase identifiers)
    .replace(/\b([A-Z][a-zA-Z0-9_]+)\b/g, '<span class="text-yellow-200">$1</span>');
}

export default function StaticCodeBox({ code, language = 'code' }: StaticCodeBoxProps) {
  const lines = code.split('\n');

  return (
    <div className="my-4 bg-[#0a0c10] border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col">
      {/* Window Header */}
      <div className="flex items-center px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
        <div className="flex space-x-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/70 hover:bg-red-500 transition-colors cursor-default" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70 hover:bg-yellow-500 transition-colors cursor-default" />
          <div className="w-3 h-3 rounded-full bg-green-500/70 hover:bg-green-500 transition-colors cursor-default" />
        </div>
        <div className="mx-auto text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          {language}
        </div>
      </div>

      {/* Code Area */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse font-mono text-xs sm:text-sm leading-relaxed">
          <tbody>
            {lines.map((line, i) => (
              <tr key={i} className="group hover:bg-white/[0.03] transition-colors">
                {/* Line Number */}
                <td className="select-none text-right pr-4 pl-4 py-0 text-slate-700 group-hover:text-slate-600 transition-colors border-r border-white/[0.04] w-10 align-top text-[11px] pt-[3px]">
                  {i + 1}
                </td>
                {/* Code Line */}
                <td className="pl-4 pr-6 py-0 whitespace-pre text-slate-300 align-top">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: highlightSyntax(line, language) || '&nbsp;',
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
