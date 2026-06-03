'use client';

import React from 'react';
import { Play, Check, RotateCcw, Loader2 } from 'lucide-react';

interface SubmitButtonProps {
  onRun: () => void;
  onSubmit: () => void;
  onReset: () => void;
  isRunning?: boolean;
  isSubmitting?: boolean;
  disabled?: boolean;
}

export default function SubmitButton({
  onRun,
  onSubmit,
  onReset,
  onVisualize,
  isRunning = false,
  isSubmitting = false,
  disabled = false,
}: SubmitButtonProps & { onVisualize?: () => void }) {
  const isExecuting = isRunning || isSubmitting;

  return (
    <div className="flex items-center gap-3 w-full py-3">
      <button
        onClick={onRun}
        disabled={disabled || isExecuting}
        className="flex-1 inline-flex h-12 items-center justify-center gap-2 bg-transparent text-slate-200 border border-white/[0.05] font-bold text-sm hover:bg-white/[0.05] hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed select-none"
      >
        {isRunning ? (
          <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
        ) : (
          <Play className="h-4 w-4 fill-current" />
        )}
        {isRunning ? 'Running...' : 'Run Code'}
      </button>

      <button
        onClick={onSubmit}
        disabled={disabled || isExecuting}
        className="flex-1 inline-flex h-12 items-center justify-center gap-2 bg-[#d9f95d] hover:bg-[#b8d945] text-slate-950 font-black text-sm transition-all duration-300 shadow-[0_0_15px_rgba(217,249,93,0.1)] hover:shadow-[0_0_25px_rgba(217,249,93,0.2)] disabled:opacity-50 disabled:cursor-not-allowed select-none relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-500 ease-in-out" />
        <span className="relative z-10 flex items-center gap-2">
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
        ) : (
          <Check className="h-4 w-4" />
        )}
        {isSubmitting ? 'Submitting...' : 'Submit Code'}
        </span>
      </button>

      <button
        onClick={onReset}
        disabled={disabled || isExecuting}
        title="Reset Code template"
        className="inline-flex h-12 w-12 items-center justify-center bg-transparent border border-white/[0.05] text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all disabled:opacity-50 disabled:cursor-not-allowed select-none shrink-0"
      >
        <RotateCcw className="h-4 w-4" />
      </button>
      
      {onVisualize && (
        <button
          onClick={onVisualize}
          disabled={disabled || isExecuting}
          title="Visualize Execution"
          className="inline-flex h-12 items-center justify-center gap-2 bg-transparent border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 hover:border-indigo-500/50 hover:text-indigo-300 font-bold text-sm px-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed select-none shrink-0"
        >
          <Play className="h-4 w-4 fill-current opacity-70" />
          <span className="hidden sm:inline">Visualize</span>
        </button>
      )}
    </div>
  );
}
