'use client';

import React, { useState, useEffect } from 'react';
import { Terminal, CheckSquare, Eye, Play, AlertTriangle } from 'lucide-react';
import dynamic from 'next/dynamic';

const InteractiveTerminal = dynamic(() => import('./InteractiveTerminal'), { ssr: false });

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
  runId?: number;
  onExecutionComplete?: () => void;
}

export default function OutputPanel({
  output,
  error,
  isRunning = false,
  testResults,
  language,
  code,
  runId,
  onExecutionComplete,
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
    <div className="w-full h-full bg-transparent border border-white/[0.05] flex flex-col font-mono">
      {/* Tab Select Header */}
      <div className="bg-transparent border-b border-white/[0.05] px-2 py-1 flex items-center gap-2 shrink-0 select-none">
        <button
          onClick={() => setActiveTab('console')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all ${
            activeTab === 'console'
              ? 'bg-white/[0.05] text-slate-100'
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
              ? 'bg-white/[0.05] text-slate-100'
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
                ? 'bg-white/[0.05] text-slate-100'
                : 'text-slate-500 hover:text-slate-350'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            Live Preview
          </button>
        )}
      </div>

      {/* Pane Content */}
      <div className="flex-1 p-4 overflow-y-auto bg-transparent font-mono text-xs select-text">
        {activeTab === 'console' ? (
          runId ? (
            <div className="h-full w-full">
              <InteractiveTerminal code={code} language={language} runId={runId} onExecutionComplete={onExecutionComplete} />
            </div>
          ) : (
            <div className="flex flex-col h-full space-y-1.5 leading-relaxed text-slate-500 italic items-center justify-center">
              Click &apos;Run Code&apos; to execute.
            </div>
          )
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
              <div className="absolute inset-0 flex items-center justify-center text-slate-400 italic font-sans text-xs bg-transparent">
                Write some HTML and render here.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
