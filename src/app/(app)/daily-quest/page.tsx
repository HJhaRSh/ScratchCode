'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Flame, Clock, Star, Tag, Play, CheckCircle2, XCircle, LayoutDashboard, Sparkles, ChevronRight, Share2, Target, Award, Trophy } from 'lucide-react';
import Link from 'next/link';
import CodeEditor from '@/components/editor/CodeEditor';
import CelebrationModal from '@/components/daily-quest/CelebrationModal';
import LeaderboardDrawer from '@/components/daily-quest/LeaderboardDrawer';
import { detectLanguage } from '@/lib/languageDetector';

export default function DailyQuestPage() {
  const router = useRouter();
  
  // Data States
  const [quest, setQuest] = useState<any>(null);
  const [attempt, setAttempt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Layout States
  const [mobileView, setMobileView] = useState<'problem' | 'workspace'>('problem');
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [submitResult, setSubmitResult] = useState<any>(null);

  // Editor States
  const [code, setCode] = useState('');
  const [detectedLang, setDetectedLang] = useState(detectLanguage(''));
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Execution States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResults, setTestResults] = useState<any[] | null>(null);

  // Hints State
  const [hintsRevealed, setHintsRevealed] = useState<string[]>([]);
  const [hintLoading, setHintLoading] = useState(false);

  // Timer State
  const [timeRemaining, setTimeRemaining] = useState<string>('--:--:--');

  // Fetch initial data
  useEffect(() => {
    const fetchTodayQuest = async () => {
      try {
        const res = await fetch('/api/daily-quest/today');
        const data = await res.json();
        
        if (res.ok) {
          setQuest(data.quest);
          setAttempt(data.attempt);
          if (data.attempt?.submitted_code) {
            setCode(data.attempt.submitted_code);
          } else {
            const savedData = localStorage.getItem('dailyQuestDraft');
            if (savedData) {
              try {
                const parsed = JSON.parse(savedData);
                if (parsed.dayNumber === data.quest.dayNumber) {
                  setCode(parsed.code);
                } else {
                  setCode("# Write your solution here\ndef solution():\n    pass");
                }
              } catch (e) {
                setCode("# Write your solution here\ndef solution():\n    pass");
              }
            } else {
              setCode("# Write your solution here\ndef solution():\n    pass");
            }
          }
          if (data.alreadySolved) {
            setIsSuccessModalOpen(true);
            // Construct a fake submitResult for the modal if already solved
            setSubmitResult({
              xpEarned: data.attempt.xp_earned,
              bonusEarned: data.attempt.bonus_earned_json,
              aiFeedback: data.attempt.ai_feedback_json,
              solutionApproaches: data.quest.solution_approaches_json
            });
          }
        } else {
          setError(data.error || 'Failed to fetch today\'s quest');
        }
      } catch (err) {
        setError('Connection error');
      } finally {
        setLoading(false);
      }
    };
    fetchTodayQuest();
  }, []);

  // Timer logic
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeRemaining(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Language Detection Debounce
  useEffect(() => {
    setIsTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = setTimeout(() => {
      const result = detectLanguage(code);
      setDetectedLang(result);
      setIsTyping(false);

      if (quest && code) {
        localStorage.setItem('dailyQuestDraft', JSON.stringify({
          dayNumber: quest.dayNumber,
          code: code
        }));
      }
    }, 500);

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [code, quest]);

  const handleHintClick = async () => {
    if (hintsRevealed.length >= 3 || hintLoading || !quest) return;
    setHintLoading(true);
    try {
      const hintNumber = hintsRevealed.length + 1;
      const res = await fetch('/api/daily-quest/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dayNumber: quest.dayNumber, hintNumber })
      });
      const data = await res.json();
      if (res.ok) {
        setHintsRevealed([...hintsRevealed, data.hint]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setHintLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!quest || !code.trim()) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/daily-quest/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dayNumber: quest.dayNumber, code, language: detectedLang.language })
      });
      const data = await res.json();
      if (res.ok) {
        setTestResults(data.testResults || []);
        if (data.status === 'SOLVED') {
          setSubmitResult(data);
          setIsSuccessModalOpen(true);
        }
      } else {
        setError(data.error || 'Submission failed');
      }
    } catch (err) {
      setError('Connection interrupted');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#0a0a0a] flex items-center justify-center text-slate-100">
        <div className="animate-spin h-8 w-8 border-2 border-[#d9f95d] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error && !quest) {
    return (
      <div className="h-screen w-screen bg-[#0a0a0a] flex items-center justify-center text-slate-100">
        <div className="text-center">
          <h2 className="text-xl font-bold text-rose-500 mb-2">Error</h2>
          <p className="text-slate-400">{error}</p>
          <Link href="/dashboard" className="mt-4 inline-block text-[#d9f95d] hover:underline">Return to Dashboard</Link>
        </div>
      </div>
    );
  }

  const difficultyColors = {
    MEDIUM: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    HARD: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    EXPERT: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  };

  const diffColorClass = difficultyColors[quest.difficulty as keyof typeof difficultyColors] || 'bg-slate-500/10 text-slate-500 border-slate-500/20';

  return (
    <div className="h-screen bg-black bg-noise flex flex-col overflow-hidden text-slate-100 font-sans">
      {/* Header */}
      <header className="h-14 border-b border-white/[0.05] bg-black px-4 md:px-6 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-3 text-sm font-semibold">
          <Link href="/dashboard" className="text-slate-400 hover:text-[#d9f95d] transition-colors p-1.5 rounded hover:bg-white/[0.05]">
            <LayoutDashboard className="h-4 w-4" />
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-700" />
          <span className="text-slate-200 font-bold flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-500" /> Daily Quest
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <button onClick={() => setIsLeaderboardOpen(true)} className="flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-md hover:bg-amber-500/20 transition-colors border border-amber-500/10">
            <Trophy className="h-3.5 w-3.5" /> Leaderboard
          </button>
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-300 bg-white/[0.05] px-3 py-1.5 rounded-md border border-white/[0.05]">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            {timeRemaining}
          </div>
        </div>
      </header>

      {/* Mobile Switcher */}
      <div className="md:hidden flex border-b border-white/[0.05] bg-black shrink-0">
        <button onClick={() => setMobileView('problem')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 ${mobileView === 'problem' ? 'border-[#d9f95d] text-[#d9f95d]' : 'border-transparent text-slate-500'}`}>Problem</button>
        <button onClick={() => setMobileView('workspace')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 ${mobileView === 'workspace' ? 'border-[#d9f95d] text-[#d9f95d]' : 'border-transparent text-slate-500'}`}>Workspace</button>
      </div>

      {/* Main Split */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Pane - Problem */}
        <div className={`w-full md:w-[45%] h-full flex flex-col border-r border-white/[0.05] bg-[#0a0a0a] ${mobileView === 'problem' ? 'flex' : 'hidden md:flex'}`}>
          <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar space-y-8">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-400 bg-white/[0.05] border border-white/[0.05] px-2 py-1 rounded">Day {quest.dayNumber} of 365</span>
                <span className={`text-xs font-bold px-2 py-1 rounded border ${diffColorClass}`}>{quest.difficulty}</span>
                <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded">
                  <Star className="h-3.5 w-3.5 fill-current" /> +{quest.xp_reward} XP
                </span>
              </div>
              <h1 className="text-3xl font-black text-slate-100 tracking-tight">{quest.title}</h1>
              <div className="flex flex-wrap gap-2">
                {quest.tags?.map((tag: string, i: number) => (
                  <span key={i} className="flex items-center gap-1 text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded">
                    <Tag className="h-3 w-3" /> {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-5 md:p-6 shadow-sm">
              <div className="prose prose-invert max-w-none text-slate-300 text-sm md:text-base leading-relaxed tracking-wide" dangerouslySetInnerHTML={{ __html: quest.description }} />
            </div>

            {quest.examples_json?.length > 0 && (
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-black text-slate-100 flex items-center gap-2">
                  <div className="w-1.5 h-5 bg-blue-500 rounded-full" />
                  Examples
                </h3>
                <div className="space-y-4">
                  {quest.examples_json.map((ex: any, i: number) => (
                    <div key={i} className="group relative bg-[#0f0f11] border border-white/[0.05] rounded-xl overflow-hidden hover:border-white/[0.1] transition-colors shadow-lg">
                      <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50 group-hover:bg-blue-400 transition-colors" />
                      <div className="p-4 space-y-3">
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Input</span>
                          <code className="bg-black/50 border border-white/[0.05] px-3 py-2 rounded-lg text-blue-300 font-mono text-sm shadow-inner break-words">{ex.input}</code>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Output</span>
                          <code className="bg-black/50 border border-white/[0.05] px-3 py-2 rounded-lg text-emerald-400 font-mono text-sm shadow-inner break-words">{ex.expected_output || ex.output}</code>
                        </div>
                        {ex.explanation && (
                          <div className="mt-3 pt-3 border-t border-white/[0.05]">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Explanation</span>
                            <div className="text-slate-400 text-sm italic leading-relaxed">{ex.explanation}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {quest.constraints_json?.length > 0 && (
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-black text-slate-100 flex items-center gap-2">
                  <div className="w-1.5 h-5 bg-rose-500 rounded-full" />
                  Constraints
                </h3>
                <div className="bg-[#0f0f11] border border-white/[0.05] rounded-xl p-4 md:p-5 shadow-lg">
                  <ul className="space-y-2.5">
                    {quest.constraints_json.map((c: string, i: number) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                        <code className="bg-white/[0.03] text-rose-300 font-mono text-sm px-2 py-0.5 rounded border border-rose-500/10 break-words">{c}</code>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="space-y-4 pt-6 mt-4 border-t border-white/[0.05]">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-100 flex items-center gap-2">
                  <div className="w-1.5 h-5 bg-indigo-500 rounded-full" />
                  Hints
                </h3>
                <span className="text-xs font-bold text-slate-500 bg-white/[0.05] px-2 py-1 rounded-md">
                  {hintsRevealed.length} / 3 Revealed
                </span>
              </div>
              
              <div className="space-y-3">
                {hintsRevealed.map((hint, i) => (
                  <div key={i} className="relative group overflow-hidden bg-gradient-to-r from-indigo-500/10 to-purple-500/5 border border-indigo-500/20 rounded-xl p-5 shadow-lg hover:border-indigo-500/40 transition-colors">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500" />
                    <div className="flex gap-3">
                      <Sparkles className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-indigo-300 uppercase tracking-widest text-[10px] block mb-1">Hint {i + 1}</strong>
                        <p className="text-indigo-100 text-sm leading-relaxed">{hint}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {hintsRevealed.length < 3 ? (
                <button 
                  onClick={handleHintClick} 
                  disabled={hintLoading}
                  className="group relative w-full overflow-hidden rounded-xl border border-indigo-500/30 bg-black p-[1px] transition-all hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] disabled:opacity-50"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="relative flex h-12 items-center justify-center gap-2 rounded-xl bg-[#0a0a0a] transition-all group-hover:bg-indigo-500/10">
                    {hintLoading ? (
                      <div className="animate-spin h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full" />
                    ) : (
                      <Sparkles className="h-4 w-4 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                    )}
                    <span className="text-sm font-bold text-indigo-400 group-hover:text-indigo-300 transition-colors">
                      {hintLoading ? 'Decoding Hint...' : `Reveal Hint ${hintsRevealed.length + 1} of 3`}
                    </span>
                  </div>
                </button>
              ) : (
                <div className="flex items-center justify-center gap-2 py-4 bg-white/[0.02] border border-white/[0.05] rounded-xl text-slate-500">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">All hints revealed</span>
                </div>
              )}
            </div>
          </div>
          <div className="p-4 border-t border-white/[0.05] bg-black shrink-0 flex gap-3">
            <button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="flex-1 bg-[#d9f95d] hover:bg-[#b8d945] text-black font-black text-sm py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(217,249,93,0.1)] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : <Play className="h-4 w-4 fill-current" />}
              Submit Solution
            </button>
          </div>
        </div>

        {/* Right Pane - Workspace */}
        <div className={`w-full md:w-[55%] h-full flex flex-col bg-black ${mobileView === 'workspace' ? 'flex' : 'hidden md:flex'}`}>
          <div className="h-12 border-b border-white/[0.05] px-4 flex items-center justify-between shrink-0 bg-[#111]">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-black border border-white/[0.1] px-3 py-1.5 rounded-lg">
                <span className="text-sm">{detectedLang.icon}</span>
                <span className="text-xs font-bold text-slate-200">{detectedLang.displayName}</span>
                <span className="text-[10px] text-slate-500 font-mono ml-1">{detectedLang.confidence}%</span>
              </div>
              {isTyping ? (
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Detecting
                </span>
              ) : (
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Language Auto-Detected</span>
              )}
            </div>
          </div>
          
          <div className="flex-1 min-h-[300px]">
            <CodeEditor
              language={detectedLang.monacoLanguage}
              value={code}
              onChange={(val) => setCode(val || '')}
              readOnly={isSubmitting}
              fontSize={14}
              theme="vs-dark"
              minimap={false}
              lessonId="daily_quest_editor"
            />
          </div>

          {/* Test Results Panel */}
          {testResults && (
            <div className="h-[250px] shrink-0 border-t border-white/[0.05] bg-[#0a0a0a] flex flex-col">
              <div className="px-4 py-2 border-b border-white/[0.05] flex items-center justify-between bg-[#111]">
                <h3 className="text-sm font-bold text-slate-200">Test Results</h3>
                <div className="text-xs font-bold text-slate-400">
                  <span className={testResults.every(r => r.passed) ? 'text-emerald-400' : 'text-rose-400'}>
                    {testResults.filter(r => r.passed).length}
                  </span>
                  /{testResults.length} Passed
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {error && <div className="mb-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-lg text-xs font-mono whitespace-pre-wrap">{error}</div>}
                <div className="grid grid-cols-1 gap-3">
                  {testResults.map((tr, i) => (
                    <div key={i} className={`rounded-xl border p-3 ${tr.passed ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        {tr.passed ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <XCircle className="h-4 w-4 text-rose-500" />}
                        <span className={`text-xs font-bold ${tr.passed ? 'text-emerald-500' : 'text-rose-500'}`}>Test Case {i + 1}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="space-y-1">
                          <div className="text-[10px] uppercase font-bold text-slate-500">Input</div>
                          <code className="block bg-black p-1.5 rounded text-xs text-slate-300 font-mono overflow-x-auto">{tr.input}</code>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] uppercase font-bold text-slate-500">Expected Output</div>
                          <code className="block bg-black p-1.5 rounded text-xs text-slate-300 font-mono overflow-x-auto">{tr.expected}</code>
                        </div>
                        <div className="col-span-2 space-y-1">
                          <div className="text-[10px] uppercase font-bold text-slate-500">Actual Output</div>
                          <code className={`block bg-black p-1.5 rounded text-xs font-mono overflow-x-auto ${tr.passed ? 'text-emerald-400' : 'text-rose-400'}`}>{tr.error || tr.actual}</code>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <LeaderboardDrawer 
        isOpen={isLeaderboardOpen} 
        onClose={() => setIsLeaderboardOpen(false)} 
        dayNumber={quest?.dayNumber || 0} 
      />
      
      <CelebrationModal 
        isOpen={isSuccessModalOpen} 
        onClose={() => setIsSuccessModalOpen(false)} 
        resultData={submitResult} 
        questData={quest} 
        onViewLeaderboard={() => {
          setIsSuccessModalOpen(false);
          setIsLeaderboardOpen(true);
        }}
      />
    </div>
  );
}
