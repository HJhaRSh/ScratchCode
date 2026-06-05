'use client';

import React, { useState } from 'react';
import CodeEditor from '@/components/editor/CodeEditor';
import CodeVisualizer from '@/components/editor/CodeVisualizer';
import JSCodeVisualizer from '@/components/editor/JSCodeVisualizer';
import HTMLCodeVisualizer from '@/components/editor/HTMLCodeVisualizer';
import { Play, AlertTriangle, X } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';

export default function VisualizerPlayground() {
  const [code, setCode] = useState<string>('def main():\n    print("Hello, Visualizer!")\n    \n    # Write your code here to trace it\n    x = 10\n    y = 20\n    print(x + y)\n\nmain()');
  const [language, setLanguage] = useState('python');
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (language === 'javascript') {
      setCode('function main() {\n  console.log("Hello, Visualizer!");\n  \n  // Write your code here to trace it\n  const x = 10;\n  const y = 20;\n  console.log(x + y);\n}\n\nmain();');
    } else if (language === 'html-css') {
      setCode('<!-- Welcome to the HTML/CSS Visualizer -->\n<div class="card">\n  <h2>Hello, Visualizer!</h2>\n  <p>Modify this code to see the live preview.</p>\n</div>\n\n<style>\n  .card {\n    border: 1px solid #ccc;\n    padding: 20px;\n    border-radius: 8px;\n  }\n  h2 {\n    color: #06b6d4;\n  }\n</style>');
    } else {
      setCode('def main():\n    print("Hello, Visualizer!")\n    \n    # Write your code here to trace it\n    x = 10\n    y = 20\n    print(x + y)\n\nmain()');
    }
    setError(null);
  }, [language]);

  const handleVisualizeClick = () => {
    setError(null);
    const text = code.toLowerCase();
    
    // Basic heuristic to catch obvious mismatches
    const isJS = code.includes('console.log') || code.includes('const ') || code.includes('let ') || text.includes('function ') || code.includes('document.');
    const isPy = code.includes('print(') || code.includes('def ') || text.includes('import ') || (code.includes('class ') && code.includes(':')) || code.includes('elif');
    const isHTML = code.includes('<html') || code.includes('<div') || code.includes('</style>') || code.includes('<body');

    if (language === 'javascript' && isPy && !isJS) {
      setError("It looks like you've written Python code, but the language is set to JavaScript. Please change the language above before visualizing.");
      return;
    }
    
    if (language === 'python' && isJS && !isPy) {
      setError("It looks like you've written JavaScript code, but the language is set to Python. Please change the language above before visualizing.");
      return;
    }

    if (language === 'html-css' && (isPy || isJS) && !isHTML) {
      setError("It looks like you've written Python or JS code, but the language is set to HTML/CSS. Please change the language above before visualizing.");
      return;
    }
    
    setShowVisualizer(true);
  };

  const handleApplyFix = (fixedCode: string) => {
    setCode(fixedCode);
    setShowVisualizer(false);
  };

  return (
    <div className="min-h-screen bg-black bg-noise flex flex-col text-slate-100">
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-20">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 overflow-hidden flex flex-col">
          <div className="flex flex-col flex-1 bg-[#0A0A0B] rounded-2xl border border-white/5 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#111111]">
        <div>
          <h1 className="text-xl font-bold text-white">Code Visualizer Playground</h1>
          <p className="text-sm text-slate-400">Write your code and trace its execution line-by-line.</p>
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-black border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#d9f95d]"
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="html-css">HTML</option>
          </select>
          <button
            onClick={handleVisualizeClick}
            className="flex items-center gap-2 bg-green-400 text-slate-950 px-4 py-2 rounded-lg font-bold hover:bg-green-500 transition-colors"
          >
            <Play className="w-4 h-4" /> Visualize Execution
          </button>
        </div>
      </div>

      <div className="flex-1 relative flex flex-col">
        {error && (
          <div className="bg-rose-500/10 border-b border-rose-500/20 px-6 py-2.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-rose-400">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-rose-400/80 hover:text-rose-300 p-1 rounded hover:bg-rose-500/10 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="flex-1 relative">
          <CodeEditor
            language={language}
            value={code}
            onChange={(val) => {
              setCode(val || '');
              if (error) setError(null);
            }}
            theme="vs-dark"
          />
        </div>
      </div>

      {showVisualizer && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setShowVisualizer(false)} />
          <div className="fixed inset-x-0 bottom-0 z-50 pointer-events-none">
            <div className="pointer-events-auto h-full w-full">
              {language === 'javascript' || language === 'js' ? (
                <JSCodeVisualizer
                  code={code}
                  language={language}
                  onClose={() => setShowVisualizer(false)}
                  onApplyFix={handleApplyFix}
                />
              ) : language === 'html-css' || language === 'html' ? (
                <HTMLCodeVisualizer
                  code={code}
                  language={language}
                  onClose={() => setShowVisualizer(false)}
                />
              ) : (
                <CodeVisualizer
                  code={code}
                  language={language}
                  onClose={() => setShowVisualizer(false)}
                  onApplyFix={handleApplyFix}
                />
              )}
            </div>
          </div>
        </>
      )}
          </div>
        </main>
      </div>
    </div>
  );
}
