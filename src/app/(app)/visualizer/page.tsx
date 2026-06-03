'use client';

import React, { useState } from 'react';
import CodeEditor from '@/components/editor/CodeEditor';
import CodeVisualizer from '@/components/editor/CodeVisualizer';
import { Play } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';

export default function VisualizerPlayground() {
  const [code, setCode] = useState<string>('def main():\\n    print(\"Hello, Visualizer!\")\\n    \\n    # Write your code here to trace it\\n    x = 10\\n    y = 20\\n    print(x + y)\\n\\nmain()');
  const [language, setLanguage] = useState('python');
  const [showVisualizer, setShowVisualizer] = useState(false);

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
          </select>
          <button
            onClick={() => setShowVisualizer(true)}
            className="flex items-center gap-2 bg-green-400 text-slate-950 px-4 py-2 rounded-lg font-bold hover:bg-green-500 transition-colors"
          >
            <Play className="w-4 h-4" /> Visualize Execution
          </button>
        </div>
      </div>

      <div className="flex-1 relative">
        <CodeEditor
          language={language}
          value={code}
          onChange={(val) => setCode(val || '')}
          theme="vs-dark"
        />
      </div>

      {showVisualizer && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8">
          <CodeVisualizer
            code={code}
            language={language}
            onClose={() => setShowVisualizer(false)}
            onApplyFix={handleApplyFix}
          />
        </div>
      )}
          </div>
        </main>
      </div>
    </div>
  );
}
