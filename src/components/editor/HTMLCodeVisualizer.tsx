'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, AlertTriangle } from 'lucide-react';

interface CodeVisualizerProps {
  code: string;
  language: string;
  onClose: () => void;
  onApplyFix?: (fixedCode: string) => void;
}

export default function HTMLCodeVisualizer({ code, language, onClose }: CodeVisualizerProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<'Slow' | 'Normal' | 'Fast'>('Normal');
  const [activeCode, setActiveCode] = useState<string>(code);
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const codeLines = activeCode.split('\n');

  useEffect(() => {
    setActiveCode(code);
    setCurrentStepIndex(0);
  }, [code]);

  useEffect(() => {
    if (isPlaying) {
      const intervalMs = speed === 'Slow' ? 1000 : speed === 'Normal' ? 333 : 125;
      playIntervalRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= codeLines.length) { setIsPlaying(false); return prev; }
          return prev + 1;
        });
      }, intervalMs);
    } else {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    }
    return () => { if (playIntervalRef.current) clearInterval(playIntervalRef.current); };
  }, [isPlaying, speed, codeLines.length]);

  const currentHTML = codeLines.slice(0, currentStepIndex).join('\n');

  return (
    <motion.div
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 28, stiffness: 220 }}
      className="absolute bottom-0 left-0 right-0 h-[85vh] lg:h-[72vh] border-t border-white/[0.1] shadow-2xl flex flex-col z-50 overflow-hidden font-sans bg-[#0a0a0a] bg-noise"
    >
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-white/8 shrink-0" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white text-sm tracking-wide">Live HTML/CSS Visualizer</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* LEFT: Code Panel */}
        <div className="w-full lg:w-[38%] h-1/2 lg:h-auto flex flex-col border-b lg:border-b-0 lg:border-r border-white/8 bg-transparent">
          <div className="flex-1 overflow-auto p-3 font-mono text-[13px] leading-6">
            <div className="text-center text-slate-600 text-[11px] mb-3 pb-2 border-b border-white/5">
              HTML/CSS — Line-by-line render
            </div>
            {codeLines.map((line, idx) => {
              const lineNum = idx + 1;
              const isExecuted = lineNum <= currentStepIndex;
              const isNext = lineNum === currentStepIndex + 1;
              return (
                <div key={idx} className={`flex items-stretch rounded-md transition-all duration-150 ${isNext ? 'bg-amber-500/10 ring-1 ring-amber-500/20' : isExecuted ? 'bg-emerald-500/10' : ''}`}>
                  <div className="w-5 flex items-center justify-center shrink-0 py-0.5">
                    {isNext && <span className="text-amber-400 text-[11px] font-bold">▶</span>}
                    {isExecuted && <span className="text-emerald-400 text-[11px]">✓</span>}
                  </div>
                  <div className="w-7 text-right text-slate-600 text-[11px] select-none pr-2 py-0.5 shrink-0 self-center">{lineNum}</div>
                  <div className={`py-0.5 pr-2 whitespace-pre flex-1 ${isNext ? 'text-amber-100' : isExecuted ? 'text-emerald-100/80' : 'text-slate-300'}`}>{line || ' '}</div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-white/8 p-3 shrink-0" style={{ background: 'rgba(0,0,0,0.4)' }}>
            <input type="range" min={0} max={codeLines.length} value={currentStepIndex} onChange={(e) => setCurrentStepIndex(Number(e.target.value))} className="w-full mb-2 h-0.5 accent-green-500" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {[
                  { label: '|◀', action: () => setCurrentStepIndex(0) },
                  { label: '◀', action: () => setCurrentStepIndex(Math.max(0, currentStepIndex - 1)) },
                  { label: '▶', action: () => setCurrentStepIndex(Math.min(codeLines.length, currentStepIndex + 1)) },
                  { label: '▶|', action: () => setCurrentStepIndex(codeLines.length) },
                ].map(({ label, action }) => (
                  <button key={label} onClick={action} className="px-2.5 py-1 text-xs font-mono rounded-md border border-white/10 bg-white/5 hover:bg-white/12 text-slate-300">{label}</button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsPlaying(!isPlaying)} className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${isPlaying ? 'bg-amber-500/20 text-amber-300' : 'bg-green-500/20 text-green-300'}`}>
                  {isPlaying ? <><Pause className="h-3 w-3" /> Pause</> : <><Play className="h-3 w-3" /> Play</>}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Live Preview + Panels */}
        <div className="flex-1 flex flex-col min-h-0 bg-transparent">
          {/* Top: Live Iframe Preview */}
          <div className="h-[50%] border-b border-white/8 flex flex-col">
            <div className="flex items-center justify-between px-3 py-2 bg-black/40 border-b border-white/5 shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Live Preview</span>
              <button 
                onClick={() => {
                  const newWin = window.open('', '_blank');
                  if (newWin) {
                    newWin.document.open();
                    newWin.document.write(currentHTML);
                    newWin.document.close();
                  }
                }}
                className="text-[10px] font-bold uppercase tracking-widest text-sky-400 hover:text-sky-300 bg-sky-500/10 hover:bg-sky-500/20 px-2 py-1 rounded transition-colors"
                title="Open live preview in a new tab"
              >
                Open Full Screen
              </button>
            </div>
            <div className="flex-1 bg-white overflow-hidden relative">
              <iframe
                srcDoc={currentHTML}
                className="w-full h-full border-none"
                sandbox="allow-scripts allow-same-origin"
                title="live-preview"
              />
            </div>
          </div>

          {/* Bottom: DOM Tree & CSS Panels */}
          <div className="flex-1 flex overflow-hidden">
            {/* DOM Tree Panel */}
            <div className="w-1/2 border-r border-white/8 flex flex-col">
              <div className="flex items-center gap-2 px-3 py-2 bg-black/40 border-b border-white/5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-sky-400">DOM Tree</span>
              </div>
              <div className="flex-1 p-3 overflow-auto font-mono text-[11px] text-slate-300">
                <div className="text-slate-500 italic mb-2">Parsed DOM elements will appear here as you type.</div>
                {currentHTML && (
                   <pre className="text-sky-300/80 whitespace-pre-wrap text-[10px]">
                     {currentHTML.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
                   </pre>
                )}
              </div>
            </div>

            {/* CSS Panels */}
            <div className="w-1/2 flex flex-col">
              {/* CSS Properties Panel */}
              <div className="flex-1 border-b border-white/8 flex flex-col">
                <div className="flex items-center gap-2 px-3 py-2 bg-black/40 border-b border-white/5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">CSS Properties</span>
                </div>
                <div className="flex-1 p-3 overflow-auto font-mono text-[11px] text-slate-300">
                  <div className="text-slate-500 italic mb-2">Computed styles</div>
                  <div className="text-emerald-300 bg-emerald-500/10 px-2 py-1 rounded w-max">No element selected</div>
                </div>
              </div>
              
              {/* Specificity Panel */}
              <div className="flex-1 flex flex-col">
                <div className="flex items-center gap-2 px-3 py-2 bg-black/40 border-b border-white/5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400">Specificity</span>
                </div>
                <div className="flex-1 p-3 overflow-auto font-mono text-[11px] text-slate-300">
                  <div className="text-slate-500 italic mb-2">CSS Rule Specificity Score</div>
                  <div className="flex gap-2">
                    <span className="bg-purple-500/10 border border-purple-500/20 px-2 py-1 rounded text-purple-300">0, 0, 0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
