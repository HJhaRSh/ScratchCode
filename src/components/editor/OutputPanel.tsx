'use client';

import React, { useState, useEffect } from 'react';
import { Terminal, CheckSquare, Eye, Play, AlertTriangle } from 'lucide-react';

interface OutputPanelProps {
  output: string;
  error?: string | null;
  isRunning?: boolean;
  testResults?: {
    passed: boolean;
    input?: string;
    expected?: string;
    actual?: string;
    error?: string;
  }[] | null;
  language: string;
  code: string;
}

export default function OutputPanel({
  output,
  error,
  isRunning = false,
  testResults,
  language,
  code,
}: OutputPanelProps) {
  const isHTMLCSS = ['html', 'css', 'html-css'].includes(language.toLowerCase());
  const [activeTab, setActiveTab] = useState<'console' | 'test-cases' | 'preview'>('console');

  // Auto-switch tabs based on current state events
  useEffect(() => {
    if (testResults) {
      setActiveTab('test-cases');
    } else if (isHTMLCSS) {
      setActiveTab('preview');
    } else {
      setActiveTab('console');
    }
  }, [testResults, isHTMLCSS]);

  return (
    <div className="w-full h-full bg-slate-950 border border-slate-900 rounded-lg overflow-hidden flex flex-col font-mono shadow-md shadow-black/25">
      {/* Tab Select Header */}
      <div className="bg-slate-950 border-b border-slate-900 px-2 py-1 flex items-center gap-2 shrink-0 select-none">
        <button
          onClick={() => setActiveTab('console')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all ${
            activeTab === 'console'
              ? 'bg-slate-900 text-slate-100'
              : 'text-slate-500 hover:text-slate-350'
          }`}
        >
          <Terminal className="h-3.5 w-3.5" />
          Console
        </button>

        <button
          onClick={() => setActiveTab('test-cases')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all relative ${
            activeTab === 'test-cases'
              ? 'bg-slate-900 text-slate-100'
              : 'text-slate-500 hover:text-slate-350'
          }`}
        >
          <CheckSquare className="h-3.5 w-3.5" />
          Test Cases
          {testResults && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          )}
        </button>

        {isHTMLCSS && (
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all ${
              activeTab === 'preview'
                ? 'bg-slate-900 text-slate-100'
                : 'text-slate-500 hover:text-slate-350'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            Live Preview
          </button>
        )}
      </div>

      {/* Pane Content */}
      <div className="flex-1 p-4 overflow-y-auto bg-slate-950 font-mono text-xs select-text">
        {isRunning ? (
          <div className="flex items-center gap-2 text-slate-400 animate-pulse py-4 justify-center">
            <Play className="h-4 w-4 animate-spin text-emerald-500" />
            Running execution code...
          </div>
        ) : activeTab === 'console' ? (
          <div className="space-y-1.5 leading-relaxed">
            {error ? (
              <div className="text-rose-500 bg-rose-950/15 p-3 border border-rose-950/30 rounded font-semibold whitespace-pre-wrap flex gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-rose-500" />
                <div>
                  <strong>Compilation/Execution Error:</strong>
                  <div className="mt-1 font-normal font-mono text-rose-350">{error}</div>
                </div>
              </div>
            ) : output ? (
              <div className="text-emerald-400 whitespace-pre-wrap leading-relaxed bg-emerald-950/5 border border-emerald-950/20 p-3 rounded shadow-inner">
                {output}
              </div>
            ) : (
              <div className="text-slate-600 italic py-4 text-center font-sans">
                No standard console output yet. Click the "Run Code" button to execute.
              </div>
            )}
          </div>
        ) : activeTab === 'test-cases' ? (
          <div className="space-y-3 font-sans">
            {testResults ? (
              <div className="space-y-2.5">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  Test evaluation results
                </div>
                {testResults.map((res, i) => (
                  <div
                    key={i}
                    className={`p-3.5 rounded-lg border leading-normal transition-all ${
                      res.passed
                        ? 'bg-emerald-500/5 border-emerald-500/10 text-slate-200 shadow-sm'
                        : 'bg-rose-500/5 border-rose-500/10 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-xs">
                      <span>Test Case {i + 1}</span>
                      <span className={res.passed ? 'text-emerald-400' : 'text-rose-400'}>
                        {res.passed ? 'PASSED ✅' : 'FAILED ❌'}
                      </span>
                    </div>

                    {/* Stdin Input */}
                    {res.input && res.input !== 'None' && res.input !== 'Code tags scan' && (
                      <div className="mt-2 text-slate-400 font-mono text-[11px] bg-slate-900/60 p-1.5 rounded border border-slate-900">
                        <span className="font-bold text-[10px] uppercase text-slate-500 block mb-0.5 font-sans">Input Stdin:</span>
                        {res.input}
                      </div>
                    )}

                    {/* Outputs Diffs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 font-mono text-[11px]">
                      <div className="bg-slate-900/40 p-2 rounded border border-slate-900">
                        <span className="font-bold text-[10px] uppercase text-slate-500 block mb-0.5 font-sans">Expected Output:</span>
                        <span className="text-cyan-400">{res.expected}</span>
                      </div>
                      <div className="bg-slate-900/40 p-2 rounded border border-slate-900">
                        <span className="font-bold text-[10px] uppercase text-slate-500 block mb-0.5 font-sans">Actual Output:</span>
                        <span className={res.passed ? 'text-emerald-400' : 'text-rose-450'}>
                          {res.actual || 'Empty response'}
                        </span>
                      </div>
                    </div>

                    {res.error && (
                      <div className="mt-2 font-mono text-[11px] text-rose-350 bg-rose-950/10 border border-rose-950/20 p-2 rounded">
                        <span className="font-bold text-[10px] uppercase text-rose-400 block mb-0.5 font-sans">Execution Log Error:</span>
                        {res.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-slate-600 italic py-4 text-center font-sans">
                No evaluation test case results. Click the "Submit Code" button to submit your workspace.
              </div>
            )}
          </div>
        ) : (
          /* Live HTML/CSS Rendering sandbox */
          <div className="w-full h-[180px] bg-white rounded overflow-hidden shadow-inner relative border border-slate-800">
            {code ? (
              <iframe
                title="HTML Live Sandbox"
                srcDoc={code}
                sandbox="allow-scripts"
                className="w-full h-full border-none bg-white"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-slate-400 italic font-sans text-xs bg-slate-950">
                Write some HTML and render here.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
