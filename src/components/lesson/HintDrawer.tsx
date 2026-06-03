'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, AlertCircle, RefreshCw, Code } from 'lucide-react';
import Editor from '@monaco-editor/react';
import CodeEditor from '@/components/editor/CodeEditor';

interface HintDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  hintText?: string;
  hintSnippet?: string;
  language?: string;
  isLoading?: boolean;
  userCode?: string;
  onUserCodeChange?: (code: string | undefined) => void;
  onRefreshHint?: () => void;
}

export default function HintDrawer({
  isOpen,
  onClose,
  hintText,
  hintSnippet,
  language = 'javascript',
  isLoading = false,
  userCode = '',
  onUserCodeChange,
  onRefreshHint,
}: HintDrawerProps) {
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
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-950/80 cursor-pointer"
          />

          {/* Centered Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-2xl max-h-[90vh] border border-white/[0.1] rounded-2xl bg-[#0a0a0a] bg-noise shadow-2xl flex flex-col overflow-hidden pointer-events-auto"
            >
            {/* Drawer Header */}
            <div className="p-4 border-b border-white/[0.05] flex items-center justify-between bg-transparent">
              <div className="flex items-center gap-2 text-cyan-400">
                <Sparkles className="h-5 w-5 animate-pulse" />
                <span className="font-bold text-sm uppercase tracking-wider">AI Mentor</span>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white p-1 hover:bg-white/[0.05] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              <div className="space-y-4">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-400 space-y-3">
                    <RefreshCw className="h-8 w-8 animate-spin text-cyan-400" />
                    <p className="text-sm font-medium animate-pulse">AI Mentor is analyzing your code...</p>
                  </div>
                ) : hintText ? (
                  <div className="space-y-4 animate-fade-in">
                    <div className="py-5 border-b border-white/[0.05] text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                      {hintText}
                    </div>

                    {hintSnippet && (
                      <div className="rounded-lg overflow-hidden border border-white/[0.05] h-48 relative bg-transparent">
                        <div className="absolute top-0 left-0 right-0 bg-transparent border-b border-white/[0.05] px-3 py-1.5 flex items-center gap-2 z-10">
                          <Sparkles className="h-3 w-3 text-[#d9f95d]" />
                          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Suggested Outline</span>
                        </div>
                        <Editor
                          height="100%"
                          language={mapLanguage(language)}
                          theme="vs-dark"
                          value={hintSnippet}
                          options={{
                            readOnly: true,
                            minimap: { enabled: false },
                            lineNumbers: 'off',
                            scrollBeyondLastLine: false,
                            fontFamily: "'Fira Code', monospace",
                            padding: { top: 36, bottom: 12 },
                            overviewRulerLanes: 0,
                            hideCursorInOverviewRuler: true,
                            scrollbar: { vertical: 'hidden', horizontal: 'hidden' },
                          }}
                        />
                      </div>
                    )}

                    <div className="flex gap-2 text-slate-400 text-xs italic py-3 border-b border-white/[0.05]">
                      <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
                      <span>Remember: The mentor points you in the right direction but will never code it for you!</span>
                    </div>

                    {/* Encouraging message below */}
                    <div className="py-3.5 text-center border-b border-white/[0.05]">
                      <p className="text-xs text-emerald-400 font-semibold animate-pulse">
                        ✨ You can do this! Take a deep breath, review this nudge, and give it another try!
                      </p>
                    </div>

                    {/* Editable User Code */}
                    {onUserCodeChange && (
                      <div className="mt-6 pt-2 pb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Code className="h-4 w-4 text-emerald-400" />
                          <span className="text-[10px] font-mono font-bold text-slate-300 uppercase">Edit Your Code</span>
                        </div>
                        <div className="h-[300px] rounded-lg overflow-hidden border border-white/[0.05]">
                          <CodeEditor 
                            language={language}
                            value={userCode}
                            onChange={onUserCodeChange}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-500">
                    <p className="text-sm italic">Unlock a hint to get a gentle conceptual nudge.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Footer */}
            {!isLoading && onRefreshHint && (
              <div className="p-4 border-t border-white/[0.05] bg-transparent flex justify-end">
                <button
                  onClick={onRefreshHint}
                  className="inline-flex h-10 items-center justify-center gap-2 bg-[#d9f95d] hover:bg-[#b8d945] px-5 text-sm font-semibold text-slate-950 hover:opacity-90 transition-opacity"
                >
                  <RefreshCw className="h-4 w-4" />
                  Request New Hint
                </button>
              </div>
            )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
