'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

interface HintDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  hintText?: string;
  hintNumber: number;
  maxHints?: number;
  onUnlockNext: () => void;
  isLoading?: boolean;
}

export default function HintDrawer({
  isOpen,
  onClose,
  hintText,
  hintNumber,
  maxHints = 3,
  onUnlockNext,
  isLoading = false,
}: HintDrawerProps) {
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

          {/* Sliding drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-md border-l border-slate-800 bg-slate-900 shadow-2xl flex flex-col"
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-2 text-cyan-400">
                <Sparkles className="h-5 w-5 animate-pulse" />
                <span className="font-bold text-sm uppercase tracking-wider">AI Mentor</span>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              <div className="bg-slate-950/50 p-4 border border-slate-800 rounded-lg space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase">
                  <span>Hint Level</span>
                  <span className="text-cyan-400">
                    {hintNumber}/{maxHints}
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${(hintNumber / maxHints) * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-4">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-400 space-y-3">
                    <RefreshCw className="h-8 w-8 animate-spin text-cyan-400" />
                    <p className="text-sm font-medium animate-pulse">AI Mentor is analyzing your code...</p>
                  </div>
                ) : hintText ? (
                  <div className="space-y-4 animate-fade-in">
                    <div className="bg-cyan-500/5 border border-cyan-500/10 p-5 rounded-lg text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                      {hintText}
                    </div>

                    <div className="flex gap-2 text-slate-400 text-xs italic bg-slate-950 p-3 rounded border border-slate-850">
                      <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
                      <span>Remember: The mentor points you in the right direction but will never code it for you!</span>
                    </div>

                    {/* Encouraging message below */}
                    <div className="bg-emerald-500/5 border border-emerald-500/10 p-3.5 rounded-lg text-center">
                      <p className="text-xs text-emerald-400 font-semibold animate-pulse">
                        ✨ You can do this! Take a deep breath, review this nudge, and give it another try!
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-500">
                    <p className="text-sm italic">Unlock a hint to get a gentle conceptual nudge.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Footer */}
            {!isLoading && (
              <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
                <button
                  onClick={onUnlockNext}
                  disabled={hintNumber >= maxHints}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-gradient-to-r from-cyan-500 to-emerald-500 px-5 text-sm font-semibold text-slate-950 hover:opacity-90 transition-opacity disabled:from-slate-850 disabled:to-slate-900 disabled:text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="h-4 w-4" />
                  {hintNumber >= maxHints ? 'All Hints Unlocked' : `Next Hint (${hintNumber + 1}/${maxHints})`}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
