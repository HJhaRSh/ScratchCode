'use client';

import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Save } from 'lucide-react';

interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string | undefined) => void;
  readOnly?: boolean;
  lessonId?: string;
}

export default function CodeEditor({
  language,
  value,
  onChange,
  readOnly = false,
  lessonId,
}: CodeEditorProps) {
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'idle'>('idle');

  const mapLanguage = (lang: string) => {
    switch (lang.toLowerCase()) {
      case 'c++':
      case 'cpp':
      case 'c':
        return 'cpp';
      case 'html-css':
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      case 'javascript':
      case 'js':
        return 'javascript';
      case 'python':
      case 'py':
        return 'python';
      case 'java':
        return 'java';
      default:
        return lang.toLowerCase();
    }
  };

  // Debounced Auto-Save to localStorage
  useEffect(() => {
    if (!lessonId || !value) return;

    setSaveStatus('saving');
    const timer = setTimeout(() => {
      localStorage.setItem(`autosave_code_${lessonId}`, value);
      setSaveStatus('saved');
      
      // Reset indicator back to idle after a brief showing
      const idleTimer = setTimeout(() => setSaveStatus('idle'), 1500);
      return () => clearTimeout(idleTimer);
    }, 2000);

    return () => clearTimeout(timer);
  }, [value, lessonId]);

  return (
    <div className="w-full h-full bg-slate-950 border border-slate-900 rounded-lg overflow-hidden flex flex-col shadow-lg shadow-black/25">
      {/* Editor Header */}
      <div className="bg-slate-950 border-b border-slate-900 px-4 py-2.5 flex items-center justify-between shrink-0 select-none">
        <span className="text-xs font-bold font-mono text-slate-400 capitalize tracking-wider flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          {mapLanguage(language)} Editor
        </span>
        
        {/* Auto-save visual feedback */}
        {lessonId && (
          <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1 font-sans">
            <Save className={`h-3 w-3 ${saveStatus === 'saving' ? 'animate-bounce text-cyan-400' : ''}`} />
            {saveStatus === 'saving' && 'Saving draft...'}
            {saveStatus === 'saved' && <span className="text-emerald-400 font-semibold">Draft Saved</span>}
            {saveStatus === 'idle' && 'Draft backed up'}
          </span>
        )}
      </div>

      {/* Monaco Container */}
      <div className="flex-1 min-h-0 relative">
        <Editor
          height="100%"
          language={mapLanguage(language)}
          theme="vs-dark"
          value={value}
          onChange={onChange}
          options={{
            readOnly,
            fontSize: 14,
            minimap: { enabled: false },
            lineNumbers: 'on',
            bracketPairColorization: { enabled: true },
            automaticLayout: true,
            scrollBeyondLastLine: false,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            fontFamily: "'Fira Code', Menlo, Monaco, Consolas, 'Courier New', monospace",
            padding: { top: 12, bottom: 12 },
          }}
          loading={
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 text-slate-400 text-xs font-mono gap-3">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              Loading Sandbox Editor...
            </div>
          }
        />
      </div>
    </div>
  );
}
