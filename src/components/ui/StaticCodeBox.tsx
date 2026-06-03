import React from 'react';

interface StaticCodeBoxProps {
  code: string;
  language?: string;
}

export function highlightSyntax(text: string) {
  // Basic escaping
  let escaped = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
  // Match strings, comments, built-ins, and keywords in one go
  const regex = /("[^"]*"|'[^']*')|(\/\/.*|#.*)|\b(console\.log|print|fmt\.Println)\b|\b(function|return|def|package|import|func|const|let|var|if|else|for|while|class|struct)\b/g;
  
  return escaped.replace(regex, (match, p1, p2, p3, p4) => {
    if (p1) return `<span class="text-yellow-200">${p1}</span>`;
    if (p2) return `<span class="text-slate-500">${p2}</span>`;
    if (p3) return `<span class="text-cyan-400">${p3}</span>`;
    if (p4) return `<span class="text-pink-500">${p4}</span>`;
    return match;
  });
}

export default function StaticCodeBox({ code, language = 'code' }: StaticCodeBoxProps) {
  return (
    <div className="my-6 bg-[#0b0c10] border border-white/10 rounded-xl overflow-hidden shadow-xl flex flex-col">
      {/* Window Header */}
      <div className="flex items-center px-4 py-2 border-b border-white/[0.05] bg-white/[0.02]">
        <div className="flex space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        </div>
        <div className="mx-auto text-[10px] font-mono text-slate-500 uppercase tracking-widest pl-4">
          {language}
        </div>
      </div>

      {/* Editor Area */}
      <div className="p-4 font-mono text-xs sm:text-sm leading-relaxed text-slate-300 overflow-x-auto">
        <div className="flex">
          {/* Line Numbers */}
          <div className="flex flex-col text-slate-700 pr-4 select-none border-r border-white/5 mr-4 text-right">
            {code.split('\n').map((_, i) => (
              <span key={i}>{i + 1}</span>
            ))}
          </div>
          {/* Code */}
          <div className="relative flex-1 whitespace-pre">
            <span dangerouslySetInnerHTML={{ __html: highlightSyntax(code) }} />
          </div>
        </div>
      </div>
    </div>
  );
}
