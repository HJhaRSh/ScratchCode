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
  isRunning = false,
  isSubmitting = false,
  disabled = false,
}: SubmitButtonProps) {
  const isExecuting = isRunning || isSubmitting;

  return (
    <div className="flex items-center gap-3 w-full py-3">
      <button
        onClick={onRun}
        disabled={disabled || isExecuting}
        className="flex-1 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm hover:bg-slate-700 hover:text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed select-none hover:shadow-lg hover:shadow-black/40"
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
        className="flex-1 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] disabled:opacity-50 disabled:cursor-not-allowed select-none relative overflow-hidden group"
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
        className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed select-none hover:shadow-md hover:shadow-black/50"
      >
        <RotateCcw className="h-4 w-4" />
      </button>
    </div>
  );
}
