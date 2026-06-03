'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const codeLines = [
  { n: 1, code: 'class Student:' },
  { n: 2, code: '  def __init__(self, name, age):' },
  { n: 3, code: '    self.name = name' },
  { n: 4, code: '    self.age = age' },
  { n: 5, code: '' },
  { n: 6, code: '  def greet(self):' },
  { n: 7, code: '    print(self.name)' },
  { n: 8, code: '' },
  { n: 9, code: 's = Student("Harsh", 21)' },
  { n: 10, code: 's.greet()' },
];

const animationSteps = [
  {
    active: 1, executed: [],
    frame: null, object: null, output: 'No output yet...'
  },
  {
    active: 9, executed: [1],
    frame: null, object: null, output: 'No output yet...'
  },
  {
    active: 2, executed: [1, 9],
    frame: { name: '__init__', vars: [['self', '→ Student inst', 'emerald'], ['name', '"Harsh"', 'emerald'], ['age', '21', 'sky']] },
    object: null, output: 'No output yet...'
  },
  {
    active: 3, executed: [1, 9, 2],
    frame: { name: '__init__', vars: [['self', '→ Student inst', 'emerald'], ['name', '"Harsh"', 'emerald'], ['age', '21', 'sky']] },
    object: { name: 'Student instance', props: [] }, output: 'No output yet...'
  },
  {
    active: 4, executed: [1, 9, 2, 3],
    frame: { name: '__init__', vars: [['self', '→ Student inst', 'emerald'], ['name', '"Harsh"', 'emerald'], ['age', '21', 'sky']] },
    object: { name: 'Student instance', props: [['name', '"Harsh"']] }, output: 'No output yet...'
  },
  {
    active: 10, executed: [1, 9, 2, 3, 4],
    frame: null,
    object: { name: 'Student instance', props: [['name', '"Harsh"'], ['age', '21']] }, output: 'No output yet...'
  },
  {
    active: 6, executed: [1, 9, 2, 3, 4, 10],
    frame: { name: 'greet', vars: [['self', '→ Student inst', 'emerald']] },
    object: { name: 'Student instance', props: [['name', '"Harsh"'], ['age', '21']] }, output: 'No output yet...'
  },
  {
    active: 7, executed: [1, 9, 2, 3, 4, 10, 6],
    frame: { name: 'greet', vars: [['self', '→ Student inst', 'emerald']] },
    object: { name: 'Student instance', props: [['name', '"Harsh"'], ['age', '21']] }, output: 'No output yet...'
  },
  {
    active: null, executed: [1, 9, 2, 3, 4, 10, 6, 7],
    frame: null,
    object: { name: 'Student instance', props: [['name', '"Harsh"'], ['age', '21']] }, output: 'Harsh'
  }
];

export default function CodeVisualizerMock() {
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setStepIdx((prev) => (prev + 1) % animationSteps.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentStep = animationSteps[stepIdx];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-emerald-500/20 overflow-hidden shadow-[0_0_80px_-20px_rgba(139,92,246,0.3)] max-w-5xl mx-auto"
      style={{ background: 'linear-gradient(180deg,#0f0f1a,#12121f)' }}
    >
      {/* Mock header bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/8" style={{ background: 'rgba(0,0,0,0.5)' }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-white text-sm">Code Visualizer</span>
          <span className="text-[10px] text-slate-500 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">{stepIdx + 1} steps traced</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-rose-500/40" />
          <div className="w-3 h-3 rounded-full bg-amber-500/40" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/40" />
        </div>
      </div>

      {/* Mock content */}
      <div className="flex flex-col sm:flex-row min-h-[340px]">
        {/* Left: Code */}
        <div className="w-full sm:w-[45%] border-b sm:border-b-0 sm:border-r border-white/8 p-4 font-mono text-[12px] leading-6 flex flex-col" style={{ background: '#0d0d18' }}>
          <div className="flex-1">
            {codeLines.map(row => {
              const isActive = currentStep.active === row.n;
              const isExecuted = currentStep.executed.includes(row.n);
              
              return (
                <div key={row.n} className={`flex items-center rounded-md px-1 transition-colors duration-300 ${isActive ? 'bg-rose-500/10 ring-1 ring-rose-500/20' :
                    isExecuted ? 'bg-emerald-500/8' : ''
                  }`}>
                  <div className="w-4 text-center text-[10px] shrink-0">
                    {isActive && <span className="text-rose-400">▶</span>}
                    {(!isActive && isExecuted) && <span className="text-emerald-400">✓</span>}
                  </div>
                  <div className="w-6 text-right text-slate-600 text-[10px] pr-2 shrink-0">{row.n}</div>
                  <div className={`flex-1 ${isActive ? 'text-rose-100' : isExecuted ? 'text-emerald-100/80' : 'text-slate-400'
                    }`}>{row.code || ' '}</div>
                </div>
              );
            })}
          </div>
          {/* Playback controls */}
          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
            <div className="flex gap-1">
              {['|◀', '◀', '▶', '▶|'].map(btn => (
                <button key={btn} className="px-2 py-1 text-[10px] font-mono rounded-md border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 transition-colors">
                  {btn}
                </button>
              ))}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">Step {stepIdx + 1} / {animationSteps.length}</div>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-semibold border transition-colors ${
                isPlaying ? 'bg-rose-500/20 text-rose-300 border-rose-500/30 hover:bg-rose-500/30' : 'bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30'
              }`}
            >
              {isPlaying ? '⏸ Pause' : '▶ Play'}
            </button>
          </div>
        </div>

        {/* Right: Frames + Objects */}
        <div className="flex-1 flex flex-col">
          {/* Output */}
          <div className="h-16 border-b border-white/8 p-3 flex flex-col" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-[9px] font-bold uppercase tracking-widest text-slate-600 mb-1">Print Output</div>
            <div className="text-[11px] font-mono text-emerald-400">
              {currentStep.output}
            </div>
          </div>
          {/* Frames + Objects */}
          <div className="flex-1 flex flex-col sm:flex-row gap-0">
            <div className="flex-1 border-b sm:border-b-0 sm:border-r border-white/8 p-3 relative">
              <div className="text-[9px] font-bold uppercase tracking-widest text-slate-600 mb-2">Frames</div>
              <AnimatePresence mode="popLayout">
                {currentStep.frame && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="rounded-xl border border-green-500/30 overflow-hidden" 
                    style={{ background: 'rgba(99,102,241,0.06)' }}
                  >
                    <div className="flex items-center gap-2 px-3 py-1.5 border-b border-green-500/20 bg-green-500/10">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      <span className="text-[10px] font-semibold text-green-200">{currentStep.frame.name}</span>
                      <span className="ml-auto text-[8px] bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded-full">active</span>
                    </div>
                    <div className="p-2 space-y-1">
                      {currentStep.frame.vars.map(([k, v, c]) => (
                        <motion.div layout key={k} className="flex items-center gap-1 text-[11px] rounded-md px-1 py-0.5">
                          <span className="text-slate-500 font-mono w-12 text-right pr-1 text-[10px]">{k}</span>
                          <div className="flex-1 px-2 py-0.5 rounded bg-black/30 border border-white/8 font-mono text-[10px]">
                            <span className={`text-${c}-400`}>{v}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="flex-1 p-3 relative">
              <div className="text-[9px] font-bold uppercase tracking-widest text-slate-600 mb-2">Objects</div>
              <AnimatePresence mode="popLayout">
                {currentStep.object && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="rounded-xl border border-amber-500/30 overflow-hidden mb-2" 
                    style={{ background: 'rgba(245,158,11,0.04)' }}
                  >
                    <div className="flex items-center px-3 py-1.5 border-b border-amber-500/20 bg-amber-500/8">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-amber-200">{currentStep.object.name}</span>
                    </div>
                    {currentStep.object.props.map(([k, v]) => (
                      <motion.div layout key={k} className="flex border-b border-white/5 last:border-0 text-[11px] font-mono">
                        <div className="px-3 py-1.5 text-slate-500 w-16 border-r border-white/8 bg-white/3 text-[10px]">{k}</div>
                        <div className="px-3 py-1.5 text-slate-300 flex-1">{v}</div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
