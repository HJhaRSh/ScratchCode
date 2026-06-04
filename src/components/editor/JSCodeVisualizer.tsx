'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, SkipBack, SkipForward, Sparkles, Copy, Check, AlertTriangle, ChevronRight } from 'lucide-react';
import { traceJSCode, Step, VariableState, FrameData } from '@/lib/jsVisualizer';


interface AiFixResult {
  explanation: string;
  fixedCode: string;
}

interface CodeVisualizerProps {
  code: string;
  language: string;
  onClose: () => void;
  onApplyFix?: (fixedCode: string) => void;
}


const JS_PRESETS: Record<string, string> = {
  basic: `const x = 10;
const y = 3;
const z = x + y;
const w = z * 2;
const name = "Harsh";
console.log("Result:", w);
console.log("Hello", name);`,
  loop: `let total = 0;
const nums = [3, 7, 2, 9, 4];
for (const n of nums) {
  total = total + n;
}
console.log("Sum:", total);`,
  func: `function square(n) {
  const result = n * n;
  return result;
}
const x = 5;
const ans = square(x);
console.log("Square:", ans);`,
  object: `const person = { name: "Harsh", age: 21 };
person.city = "Mumbai";
const { name, age } = person;
console.log(name, age);
console.log(Object.keys(person));`,
  closure: `function makeCounter() {
  let count = 0;
  return function() {
    count++;
    return count;
  };
}
const counter = makeCounter();
console.log(counter());
console.log(counter());
console.log(counter());`
};

export default function JSCodeVisualizer({ code, language, onClose, onApplyFix }: CodeVisualizerProps) {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<'Slow' | 'Normal' | 'Fast'>('Normal');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeCode, setActiveCode] = useState<string>(code);
  const [activePreset, setActivePreset] = useState<string>('custom');

  useEffect(() => {
    setActiveCode(code);
    setActivePreset('custom');
  }, [code]);


  // AI fix state
  const [aiFixResult, setAiFixResult] = useState<AiFixResult | null>(null);
  const [loadingAiFix, setLoadingAiFix] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [copied, setCopied] = useState(false);

  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'v') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Fetch AI fix when we have an error step
  const fetchAiFix = useCallback(async (errorText: string) => {
    setLoadingAiFix(true);
    setShowAiPanel(true);
    setAiFixResult(null);
    try {
      const res = await fetch('/api/visualizer/fix-suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: activeCode, language, error: errorText }),
      });
      const data = await res.json();
      if (res.ok) {
        setAiFixResult({ explanation: data.explanation, fixedCode: data.fixedCode });
      } else {
        setAiFixResult({ explanation: 'Could not fetch AI suggestion. Please try again.', fixedCode: code });
      }
    } catch {
      setAiFixResult({ explanation: 'Network error — could not reach AI service.', fixedCode: code });
    } finally {
      setLoadingAiFix(false);
    }
  }, [activeCode, language]);

  useEffect(() => {
    setLoading(true);
    setErrorMsg(null);
    setSteps([]);
    setCurrentStepIndex(0);
    setAiFixResult(null);
    setShowAiPanel(false);

    const codeTrimmed = activeCode.trim();
    if (!codeTrimmed) {
      setErrorMsg('Write some code first, then click Visualize');
      setLoading(false);
      return;
    }

    runJavascriptStepper(codeTrimmed);
  }, [code, language]);

    const runJavascriptStepper = async (userCode: string) => {
    try {
      const traceSteps = await traceJSCode(userCode);
      if (traceSteps.length === 0) {
        setSteps([{ step: 1, line: 1, frames: [{ name: 'Global frame', variables: {} }], callStack: ['global'], output: '', error: null }]);
      } else {
        setSteps(traceSteps);
      }
      setLoading(false);
      
      const lastStep = traceSteps[traceSteps.length - 1];
      if (lastStep?.error) {
        setCurrentStepIndex(traceSteps.length - 1);
        fetchAiFix(lastStep.error);
      }
    } catch (e: any) {
      const errMsg = `RuntimeError: ${e.message}`;
      setErrorMsg(errMsg);
      setLoading(false);
      fetchAiFix(errMsg);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      const intervalMs = speed === 'Slow' ? 1000 : speed === 'Normal' ? 333 : 125;
      playIntervalRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) { setIsPlaying(false); return prev; }
          const nextStep = steps[prev + 1];
          if (nextStep?.error) setIsPlaying(false);
          return prev + 1;
        });
      }, intervalMs);
    } else {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    }
    return () => { if (playIntervalRef.current) clearInterval(playIntervalRef.current); };
  }, [isPlaying, speed, steps]);

  const handleCopyFixed = () => {
    if (aiFixResult?.fixedCode) {
      navigator.clipboard.writeText(aiFixResult.fixedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleApplyFix = () => {
    if (aiFixResult?.fixedCode && onApplyFix) {
      onApplyFix(aiFixResult.fixedCode);
    }
  };

  const currentStep = steps[currentStepIndex];
  const prevStep = currentStepIndex > 0 ? steps[currentStepIndex - 1] : null;
  const executedLine = prevStep?.line;
  const nextLine = currentStep?.line;
  const hasErrorAtCurrentStep = !!(currentStep?.error);
  const codeLines = activeCode.split('\n');

  const allObjects: { name: string; state: VariableState }[] = [];
  if (currentStep?.frames) {
    currentStep.frames.forEach((fr) => {
      Object.entries(fr.variables).forEach(([name, state]) => {
        if (state.type === 'list' || state.type === 'dict' || state.type === 'function' || state.type === 'class' || state.type.endsWith('instance')) {
          allObjects.push({ name, state });
        }
      });
    });
  }

  // Determine if there's any error in the whole trace
  const traceHasError = steps.some((s) => s.error);

  return (
    <motion.div
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 28, stiffness: 220 }}
      className="absolute bottom-0 left-0 right-0 h-[72vh] border-t border-white/[0.1] shadow-2xl flex flex-col z-50 overflow-hidden font-sans bg-[#0a0a0a] bg-noise"
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-white/8 shrink-0" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${traceHasError ? 'bg-rose-400' : 'bg-emerald-400'} animate-pulse`} />
            <span className="font-semibold text-white text-sm tracking-wide">Code Visualizer</span>
          </div>
          {loading && (
            <div className="flex items-center gap-2 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">
              <div className="w-3 h-3 border border-green-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-green-300 text-xs">Analysing...</span>
            </div>
          )}
          {!loading && steps.length > 0 && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
              <span className="text-slate-400 text-xs">{steps.length} steps traced</span>
            </div>
          )}
          {traceHasError && !loading && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20">
              <AlertTriangle className="w-3 h-3 text-rose-400" />
              <span className="text-rose-300 text-xs">Runtime error detected</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {traceHasError && !loading && (
            <button
              onClick={() => setShowAiPanel((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all"
            >
              <Sparkles className="w-3 h-3" />
              AI Fix {showAiPanel ? '▾' : '▸'}
            </button>
          )}
          {/* Preset selector */}
          <select 
            className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-slate-300 outline-none"
            value={activePreset}
            onChange={(e) => {
              const val = e.target.value;
              setActivePreset(val);
              if (val === 'custom') setActiveCode(code);
              else setActiveCode(JS_PRESETS[val]);
            }}
          >
            <option value="custom">Your Code</option>
            <option value="basic">Preset: Basic</option>
            <option value="loop">Preset: Loop</option>
            <option value="func">Preset: Functions</option>
            <option value="object">Preset: Objects</option>
            <option value="closure">Preset: Closures</option>
          </select>
          <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
            <div className="text-center">
              <div className="text-white font-medium text-sm">Analysing your code</div>
              <div className="text-slate-500 text-xs mt-1">Setting up Python tracer...</div>
            </div>
          </div>
        </div>
      ) : errorMsg && !steps.length ? (
        /* Hard error — no steps at all (e.g. pyodide init fail, severe syntax error) */
        <div className="flex-1 flex min-h-0">
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="max-w-xl w-full">
              <div className="flex items-center gap-2 mb-3 text-rose-400">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-bold">Error in your code</span>
              </div>
              <pre className="text-sm text-rose-300 text-left whitespace-pre-wrap font-mono bg-rose-950/30 p-4 rounded-xl border border-rose-500/20 leading-relaxed">{errorMsg}</pre>
              {!loadingAiFix && !aiFixResult && (
                <div className="mt-3 text-slate-500 text-xs">Fetching AI fix suggestion...</div>
              )}
            </div>
          </div>
          {/* AI Fix panel even for hard errors */}
          <AnimatePresence>
            {showAiPanel && (
              <div className="absolute inset-0 z-50 flex justify-end">
                <AiFixPanel
                  loading={loadingAiFix}
                  result={aiFixResult}
                  onCopy={handleCopyFixed}
                  onApply={onApplyFix ? handleApplyFix : undefined}
                  copied={copied}
                />
              </div>
            )}
          </AnimatePresence>
        </div>
      ) : currentStep ? (
        <div className="flex-1 flex flex-col lg:flex-row min-h-0">
          {/* ── LEFT: Code Panel ── */}
          <div className="w-full lg:w-[38%] h-1/2 lg:h-auto flex flex-col border-b lg:border-b-0 lg:border-r border-white/8 bg-transparent">
            <div className="flex-1 overflow-auto p-3 font-mono text-[13px] leading-6">
              <div className="text-center text-slate-600 text-[11px] mb-3 pb-2 border-b border-white/5">
                {language === 'python' ? 'Python 3.11' : 'JavaScript'} — line-by-line trace
              </div>
              {codeLines.map((line, idx) => {
                const lineNum = idx + 1;
                const isErrorLine = hasErrorAtCurrentStep && lineNum === nextLine;
                const isNext = !isErrorLine && lineNum === nextLine;
                const isExecuted = lineNum === executedLine && !isNext && !isErrorLine;
                return (
                  <div
                    key={idx}
                    className={`flex items-stretch rounded-md transition-all duration-150 ${
                      isErrorLine
                        ? 'bg-rose-500/18 ring-1 ring-rose-500/40'
                        : isNext
                        ? 'bg-amber-500/10 ring-1 ring-amber-500/20'
                        : isExecuted
                        ? 'bg-emerald-500/10'
                        : ''
                    }`}
                  >
                    <div className="w-5 flex items-center justify-center shrink-0 py-0.5">
                      {isErrorLine && <span className="text-rose-400 text-[11px] font-bold">⚠</span>}
                      {isNext && <span className="text-amber-400 text-[11px] font-bold">▶</span>}
                      {isExecuted && <span className="text-emerald-400 text-[11px]">✓</span>}
                    </div>
                    <div className="w-7 text-right text-slate-600 text-[11px] select-none pr-2 py-0.5 shrink-0 self-center">{lineNum}</div>
                    <div
                      className={`py-0.5 pr-2 whitespace-pre flex-1 ${
                        isErrorLine ? 'text-rose-200' : isNext ? 'text-amber-100' : isExecuted ? 'text-emerald-100/80' : 'text-slate-300'
                      }`}
                    >
                      {line || ' '}
                    </div>
                  </div>
                );
              })}
              <div className="mt-6 pt-4 border-t border-white/5 flex gap-5 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> just executed</div>
                <div className="flex items-center gap-1.5"><span className="text-amber-400 text-[11px] font-bold">▶</span> next to run</div>
                <div className="flex items-center gap-1.5"><span className="text-rose-400 text-[11px] font-bold">⚠</span> error line</div>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="border-t border-white/8 p-3 shrink-0" style={{ background: 'rgba(0,0,0,0.4)' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-slate-600 text-[11px] w-6 text-right">{currentStep.step}</span>
                <div className="flex-1 relative h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className={`absolute left-0 top-0 h-full rounded-full ${traceHasError ? 'bg-gradient-to-r from-rose-500 to-rose-400' : 'bg-gradient-to-r from-green-500 to-emerald-500'}`}
                    animate={{ width: `${((currentStepIndex) / Math.max(1, steps.length - 1)) * 100}%` }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                </div>
                <span className="text-slate-600 text-[11px] w-6">{steps.length}</span>
              </div>
              <input
                type="range" min={0} max={Math.max(0, steps.length - 1)} value={currentStepIndex}
                onChange={(e) => setCurrentStepIndex(Number(e.target.value))}
                className={`w-full mb-2 h-0.5 ${traceHasError ? 'accent-rose-500' : 'accent-green-500'}`}
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[
                    { label: '|◀', action: () => setCurrentStepIndex(0), disabled: currentStepIndex === 0 },
                    { label: '◀', action: () => setCurrentStepIndex(Math.max(0, currentStepIndex - 1)), disabled: currentStepIndex === 0 },
                    { label: '▶', action: () => setCurrentStepIndex(Math.min(steps.length - 1, currentStepIndex + 1)), disabled: currentStepIndex === steps.length - 1 },
                    { label: '▶|', action: () => setCurrentStepIndex(steps.length - 1), disabled: currentStepIndex === steps.length - 1 },
                  ].map(({ label, action, disabled }) => (
                    <button key={label} onClick={action} disabled={disabled}
                      className="px-2.5 py-1 text-xs font-mono rounded-md border border-white/10 bg-white/5 hover:bg-white/12 disabled:opacity-25 transition-colors text-slate-300"
                    >{label}</button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex rounded-lg border border-white/10 overflow-hidden">
                    {(['Slow', 'Normal', 'Fast'] as const).map((s) => (
                      <button key={s} onClick={() => setSpeed(s)}
                        className={`px-2 py-1 text-[10px] font-bold transition-colors ${speed === s ? 'bg-green-500/30 text-green-300' : 'bg-white/3 text-slate-500 hover:text-slate-300'}`}
                      >{s[0]}</button>
                    ))}
                  </div>
                  <button onClick={() => setIsPlaying(!isPlaying)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${isPlaying ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30'}`}
                  >
                    {isPlaying ? <><Pause className="h-3 w-3" /> Pause</> : <><Play className="h-3 w-3" /> Play</>}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Output + Memory + AI Panel ── */}
          <div className="flex-1 flex min-h-0 relative overflow-hidden">
            {/* Main right content */}
            <div className="flex-1 flex flex-col min-h-0 bg-transparent">
              {/* Print Output */}
              <div className="h-[30%] flex flex-col border-b border-white/8 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${hasErrorAtCurrentStep ? 'bg-rose-400' : 'bg-emerald-400'}`} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Print Output</span>
                </div>
                <div className="flex-1 rounded-lg border border-white/8 p-3 font-mono text-[12px] overflow-auto whitespace-pre-wrap leading-5" style={{ background: 'rgba(0,0,0,0.4)' }}>
                  <span className="text-emerald-300">{currentStep.output || ''}</span>
                  {!currentStep.output && !currentStep.error && (
                    <span className="text-slate-600 italic text-[11px]">No output yet...</span>
                  )}
                  {currentStep.error && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 p-3 rounded-lg border border-rose-500/30 bg-rose-950/40"
                    >
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" />
                        <div>
                          <div className="text-rose-300 font-semibold text-[11px] mb-1">Runtime Error</div>
                          <div className="text-rose-200 text-[11px] font-mono leading-relaxed">{currentStep.error}</div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Frames + Objects */}
              <div className="flex-1 flex flex-col overflow-hidden p-3 gap-2">
                <div className="flex gap-1">
                  <div className="flex-1 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center">Frames</div>
                  <div className="flex-1 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center">Objects</div>
                </div>
                <div className="flex-1 flex gap-3 overflow-auto">
                  {/* Frames column */}
                  <div className="flex-1 flex flex-col gap-2 min-w-0">
                    {(currentStep.frames || []).length === 0 ? (
                      <div className="text-slate-600 text-xs italic text-center mt-4">No frames</div>
                    ) : (
                      (currentStep.frames || []).map((frame, fIdx) => {
                        const isTopFrame = fIdx === (currentStep.frames?.length ?? 0) - 1;
                        return (
                          <motion.div key={fIdx}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: fIdx * 0.05 }}
                            className={`rounded-xl border shrink-0 overflow-hidden ${isTopFrame ? 'border-green-500/40' : 'border-white/10'}`}
                            style={{ background: isTopFrame ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.03)' }}
                          >
                            <div className={`flex items-center gap-2 px-3 py-1.5 border-b ${isTopFrame ? 'border-green-500/20 bg-green-500/10' : 'border-white/5 bg-white/3'}`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${isTopFrame ? 'bg-green-400' : 'bg-slate-600'}`} />
                              <span className={`text-[11px] font-semibold ${isTopFrame ? 'text-green-200' : 'text-slate-400'}`}>{frame.name}</span>
                              {isTopFrame && <span className="ml-auto text-[9px] bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded-full">active</span>}
                            </div>
                            <div className="p-2 flex flex-col gap-1">
                              {Object.keys(frame.variables || {}).length === 0 ? (
                                <div className="text-slate-600 text-[11px] italic px-1 py-0.5">empty</div>
                              ) : (
                                Object.entries(frame.variables).map(([name, state]) => {
                                  const isObj = state.type === 'list' || state.type === 'dict' || state.type === 'function' || state.type === 'class' || (state.type ?? '').endsWith('instance');
                                  return (
                                    <div key={name} className="flex items-center gap-1 text-[12px] rounded-md px-1 py-0.5 hover:bg-white/3 transition-colors">
                                      <span className="text-slate-400 font-mono min-w-[60px] text-right pr-2 shrink-0 text-[11px]">{name}</span>
                                      <div className="flex-1 px-2 py-0.5 rounded bg-black/30 border border-white/8 font-mono text-[11px]">
                                        {isObj ? (
                                          <span className="text-emerald-400 italic text-[10px]">→ {state.type}</span>
                                        ) : state.type === 'str' ? (
                                          <span className="text-emerald-400">"{state.value}"</span>
                                        ) : state.type === 'int' || state.type === 'float' ? (
                                          <span className="text-sky-400">{state.value}</span>
                                        ) : state.type === 'bool' ? (
                                          <span className="text-amber-400">{String(state.value)}</span>
                                        ) : state.type === 'NoneType' ? (
                                          <span className="text-slate-500 italic">None</span>
                                        ) : (
                                          <span className="text-slate-300">{String(state.value ?? '')}</span>
                                        )}
                                      </div>
                                      <span className={`text-[9px] px-1 py-0.5 rounded font-mono shrink-0 ${
                                        state.type === 'str' ? 'text-emerald-500/70 bg-emerald-500/8' :
                                        state.type === 'int' || state.type === 'float' ? 'text-sky-500/70 bg-sky-500/8' :
                                        state.type === 'bool' ? 'text-amber-500/70 bg-amber-500/8' :
                                        'text-emerald-500/70 bg-emerald-500/8'
                                      }`}>{state.type}</span>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </div>

                  {/* Objects column */}
                  <div className="flex-1 flex flex-col gap-2 min-w-0">
                    {allObjects.length === 0 ? (
                      <div className="text-slate-600 text-xs italic text-center mt-4">No heap objects</div>
                    ) : (
                      allObjects.map(({ name, state }, idx) => {
                        const isClass = state.type === 'class';
                        const isInstance = (state.type ?? '').endsWith('instance');
                        const isList = state.type === 'list';
                        const isFunc = state.type === 'function';
                        const accentColor = isClass ? 'emerald' : isInstance ? 'amber' : isList ? 'sky' : 'emerald';
                        const colorMap: Record<string, string> = {
                          emerald: 'border-emerald-500/30 bg-emerald-500/5',
                          amber: 'border-amber-500/30 bg-amber-500/5',
                          sky: 'border-sky-500/30 bg-sky-500/5',
                        };
                        const headerMap: Record<string, string> = {
                          emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200',
                          amber: 'bg-amber-500/10 border-amber-500/20 text-amber-200',
                          sky: 'bg-sky-500/10 border-sky-500/20 text-sky-200',
                        };
                        return (
                          <motion.div key={idx}
                            initial={{ opacity: 0, x: 8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`rounded-xl border shrink-0 overflow-hidden ${colorMap[accentColor]}`}
                          >
                            <div className={`flex items-center gap-2 px-3 py-1.5 border-b ${headerMap[accentColor]}`}>
                              <span className="text-[10px] font-bold uppercase tracking-wider">{isClass ? `${name} class` : state.type}</span>
                            </div>
                            <div className="overflow-hidden">
                              {isList && Array.isArray(state.value) ? (
                                <div className="flex overflow-x-auto">
                                  {state.value.map((v: any, i: number) => (
                                    <div key={i} className="flex flex-col border-r border-white/8 last:border-r-0 min-w-[2.5rem]">
                                      <div className="text-[9px] text-slate-600 text-center border-b border-white/8 bg-white/3 py-0.5">{i}</div>
                                      <div className="text-center px-2 py-1.5 font-mono text-[12px] text-sky-300">{JSON.stringify(v)}</div>
                                    </div>
                                  ))}
                                </div>
                              ) : isFunc ? (
                                <div className="px-3 py-2 font-mono text-[12px] text-emerald-300">{String(state.value)}</div>
                              ) : typeof state.value === 'object' && state.value !== null ? (
                                Object.entries(state.value as Record<string, any>).map(([k, v], i) => (
                                  <div key={i} className="flex border-b border-white/5 last:border-b-0 text-[12px] font-mono">
                                    <div className="px-3 py-1.5 text-slate-400 min-w-[80px] border-r border-white/8 bg-white/3 text-[11px]">{k}</div>
                                    <div className="px-3 py-1.5 text-slate-200 flex-1">
                                      {typeof v === 'string' && v.startsWith('function ') ? (
                                        <span className="text-emerald-300 text-[11px]">{v}</span>
                                      ) : String(v)}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="px-3 py-2 font-mono text-[12px] text-slate-300">{JSON.stringify(state.value)}</div>
                              )}
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Fix Side Panel */}
            <AnimatePresence>
              {showAiPanel && (
                <div className="absolute inset-0 z-50 flex justify-end">
                  <AiFixPanel
                    loading={loadingAiFix}
                    result={aiFixResult}
                    onCopy={handleCopyFixed}
                    onApply={onApplyFix ? handleApplyFix : undefined}
                    copied={copied}
                  />
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-500">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Loading trace...</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ── AI Fix Side Panel Component ──────────────────────────────────────────────
interface AiFixPanelProps {
  loading: boolean;
  result: AiFixResult | null;
  onCopy: () => void;
  onApply?: () => void;
  copied: boolean;
}

function AiFixPanel({ loading, result, onCopy, onApply, copied }: AiFixPanelProps) {
  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 26, stiffness: 240 }}
      className="absolute top-0 right-0 bottom-0 w-full sm:w-[340px] z-50 shrink-0 flex flex-col border-l border-white/[0.05] overflow-hidden bg-[#0a0a0a] bg-noise"
    >
      {/* Panel header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.05] bg-transparent">
        <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        </div>
        <div>
          <div className="text-[12px] font-bold text-cyan-400 leading-tight uppercase tracking-wider">AI Fix Suggestion</div>
          <div className="text-[10px] text-slate-500">Powered by Groq · Llama 3.3 70B</div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 flex flex-col gap-4">
        {loading ? (
          /* Loading skeleton */
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 border border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-cyan-400 text-xs font-semibold">Analysing error with AI...</span>
            </div>
            {[80, 100, 60, 90, 70].map((w, i) => (
              <div key={i} className="h-2.5 rounded-full bg-cyan-500/10 animate-pulse" style={{ width: `${w}%`, animationDelay: `${i * 0.1}s` }} />
            ))}
            <div className="mt-2 h-24 rounded-xl bg-cyan-500/5 border border-cyan-500/10 animate-pulse" />
          </div>
        ) : result ? (
          <>
            {/* Explanation */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-1 h-3 rounded-full bg-rose-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400">What went wrong</span>
              </div>
              <p className="text-slate-300 text-[12px] leading-relaxed bg-black/20 rounded-xl p-3 border border-white/[0.05]">
                {result.explanation}
              </p>
            </div>

            {/* Fixed code */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-1 h-3 rounded-full bg-emerald-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Fixed Code</span>
                </div>
                <button
                  onClick={onCopy}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  {copied ? <><Check className="w-3 h-3 text-emerald-400" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                </button>
              </div>
              <pre className="text-[11px] font-mono text-emerald-200 leading-relaxed bg-black/40 rounded-xl p-3 border border-emerald-500/20 overflow-auto whitespace-pre-wrap max-h-[220px]">
                {result.fixedCode}
              </pre>
            </div>
          </>
        ) : null}
      </div>

      {/* Apply fix button */}
      {result && onApply && (
        <div className="p-4 border-t border-white/[0.05] shrink-0 bg-transparent">
          <button
            onClick={onApply}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm bg-[#d9f95d] hover:bg-[#b8d945] text-slate-950 transition-all shadow-lg shadow-[#d9f95d]/10 active:scale-95"
          >
            <Check className="w-4 h-4" />
            Apply Fix & Close
            <ChevronRight className="w-4 h-4" />
          </button>
          <p className="text-center text-[10px] text-slate-500 mt-1.5 font-medium">Replaces your code with the AI-fixed version</p>
        </div>
      )}
    </motion.div>
  );
}
