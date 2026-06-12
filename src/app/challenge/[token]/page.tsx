'use client';

import React, { useEffect, useState, useRef } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import { Play, Swords, User, Trophy, Clock, Target, ArrowRight, ChevronLeft, LayoutDashboard } from 'lucide-react';
import CodeEditor from '@/components/editor/CodeEditor';
import Link from 'next/link';
import { detectLanguage } from '@/lib/languageDetector';
import { createClient } from '@/lib/supabase/client';

export default function ChallengePage() {
  const params = useParams();
  const token = params.token as string;
  const router = useRouter();
  
  const [challenge, setChallenge] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authUser, setAuthUser] = useState<any>(null);
  
  // Editor State
  const [code, setCode] = useState("# Write your solution here\ndef solution():\n    pass");
  const [detectedLang, setDetectedLang] = useState(detectLanguage(code));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResults, setTestResults] = useState<any[] | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // Attempt / Success state
  const [isSuccess, setIsSuccess] = useState(false);
  const [attemptsUsed, setAttemptsUsed] = useState(0);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  // Typing debounce
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchAuthAndChallenge = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push(`/login?next=${encodeURIComponent(`/challenge/${token}`)}`);
          return;
        }
        setAuthUser(user);

        const res = await fetch(`/api/challenges/${token}`);
        if (!res.ok) {
          if (res.status === 404) setError('Challenge not found or expired');
          else setError('Failed to load challenge');
          return;
        }
        const data = await res.json();
        setChallenge(data.challenge);
        
        if (data.challenge.userState) {
          setAttemptsUsed(data.challenge.userState.attemptsUsed);
          if (data.challenge.userState.hasSolvedNatively) {
            setIsSuccess(true);
            fetchLeaderboard();
          }
        }
      } catch (err) {
        setError('Connection error');
      } finally {
        setLoading(false);
      }
    };
    fetchAuthAndChallenge();
  }, [token, router]);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch(`/api/challenges/${token}/leaderboard`);
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data.leaderboard);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setDetectedLang(detectLanguage(code));
    }, 500);
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [code]);

  const handleSubmit = async () => {
    if (!code.trim() || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch(`/api/challenges/${token}/attempt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language: detectedLang.language })
      });
      const data = await res.json();
      
      if (res.ok) {
        setTestResults(data.testResults || []);
        if (data.status === 'SOLVED') {
          setIsSuccess(true);
          await fetchLeaderboard();
        } else {
          setAttemptsUsed(data.attemptCount || attemptsUsed + 1);
        }
      } else {
        setSubmitError(data.error || 'Submission failed');
        if (data.error?.includes('Maximum attempts reached')) {
          await fetchLeaderboard(); // Show leaderboard if they failed all attempts
        }
      }
    } catch (err) {
      setSubmitError('Connection interrupted');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-rose-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="bg-[#111] border border-white/10 rounded-2xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
          <div className="text-4xl">⚠️</div>
          <h2 className="text-xl font-bold text-white">{error}</h2>
          <p className="text-slate-400 text-sm">The challenge link might be invalid, or it has expired.</p>
          <Link href="/" className="inline-block mt-4 text-rose-500 hover:text-rose-400 font-bold transition-colors">
            Go to ScratchCode
          </Link>
        </div>
      </div>
    );
  }

  const { created_by: sender, quest, lesson, message: custom_message, attempts_allowed: max_attempts } = challenge;
  const taskTitle = quest?.title || lesson?.title || 'Challenge';
  const taskDesc = quest?.description || lesson?.content_json?.description || 'Solve this problem to beat the challenge.';
  const examples = quest?.examples_json || lesson?.content_json?.examples || [];

  return (
    <div className="min-h-screen bg-black bg-noise flex flex-col font-sans text-slate-100 overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b border-white/[0.05] px-4 md:px-6 flex items-center justify-between bg-black shrink-0">
        <div className="flex items-center gap-3 md:gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors pr-4 border-r border-white/10 hidden sm:flex">
            <LayoutDashboard className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Dashboard</span>
          </Link>
          <Link href="/dashboard" className="p-2 -ml-2 text-slate-400 hover:text-white sm:hidden transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </Link>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500 border border-rose-500/20 hidden xs:flex">
              <Swords className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white leading-tight">Code Challenge</h1>
              <p className="text-xs text-slate-400">from @{sender.username}</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 text-xs font-bold">
            <Target className="h-3.5 w-3.5 text-rose-500" />
            Attempts: {max_attempts === 999 ? 'Unlimited' : `${attemptsUsed} / ${max_attempts}`}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Problem Statement */}
        <div className="w-full md:w-1/2 flex flex-col border-r border-white/5 bg-[#0a0a0a]">
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
            
            {/* Trash Talk Banner */}
            {custom_message && (
              <div className="relative bg-gradient-to-r from-rose-500/10 to-orange-500/10 border border-rose-500/20 rounded-xl p-5 shadow-lg">
                <div className="absolute -top-3 left-6 px-2 bg-[#0a0a0a] text-[10px] font-black uppercase tracking-widest text-rose-500 flex items-center gap-1">
                  <User className="h-3 w-3" /> @{sender.username} says:
                </div>
                <p className="text-rose-200 italic font-medium">{custom_message}</p>
              </div>
            )}

            <div className="space-y-4">
              <h2 className="text-3xl font-black text-white tracking-tight">{taskTitle}</h2>
              <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: taskDesc }} />
            </div>

            {examples.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-black text-white">Examples</h3>
                <div className="space-y-4">
                  {examples.map((ex: any, i: number) => (
                    <div key={i} className="bg-[#111] border border-white/5 rounded-xl p-4 space-y-2 font-mono text-sm shadow-inner">
                      <div><span className="text-slate-500">Input:</span> <span className="text-blue-300">{ex.input}</span></div>
                      <div><span className="text-slate-500">Output:</span> <span className="text-emerald-400">{ex.expected_output || ex.output}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Workspace or Leaderboard */}
        <div className="w-full md:w-1/2 flex flex-col bg-black">
          {isSuccess || attemptsUsed >= max_attempts ? (
            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar flex flex-col items-center">
              <div className="w-full max-w-lg space-y-8">
                
                {/* Status Banner */}
                <div className={`p-6 rounded-2xl border text-center space-y-3 ${isSuccess ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'}`}>
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full border-2 text-3xl mb-2 ${isSuccess ? 'border-emerald-500 text-emerald-500 bg-emerald-500/20' : 'border-rose-500 text-rose-500 bg-rose-500/20'}`}>
                    {isSuccess ? '🏆' : '💀'}
                  </div>
                  <h2 className={`text-2xl font-black ${isSuccess ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {isSuccess ? (challenge?.userState?.hasSolvedNatively && attemptsUsed === 0 ? 'Already Completed' : 'Challenge Complete!') : 'Challenge Failed'}
                  </h2>
                  <p className="text-slate-300">
                    {isSuccess 
                      ? (challenge?.userState?.hasSolvedNatively && attemptsUsed === 0 ? "You've already solved this problem! Here is the challenge leaderboard." : "You successfully solved the challenge and secured your spot on the leaderboard.")
                      : "You've exhausted all your attempts. Better luck next time!"}
                  </p>
                </div>

                {/* Leaderboard */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-500" /> Leaderboard
                  </h3>
                  <div className="bg-[#111] border border-white/5 rounded-xl overflow-hidden">
                    {leaderboard.length > 0 ? (
                      <div className="divide-y divide-white/5">
                        {leaderboard.map((row, i) => (
                          <div key={i} className="p-4 flex items-center justify-between hover:bg-white/[0.02]">
                            <div className="flex items-center gap-4">
                              <span className="text-sm font-bold text-slate-500 w-4 text-center">{i + 1}</span>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white">@{row.username || 'Anonymous'}</span>
                                {row.username === sender.username && (
                                  <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-wider">Creator</span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm font-mono text-slate-400">
                              <span className={row.status === 'SOLVED' ? 'text-emerald-400' : 'text-rose-400'}>{row.status}</span>
                              {row.status === 'SOLVED' && row.time_taken_seconds && (
                                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {row.time_taken_seconds}s</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-slate-500 text-sm">No attempts yet.</div>
                    )}
                  </div>
                </div>
                
                {/* CTA */}
                <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-xl p-6 text-center space-y-4">
                  <h4 className="text-lg font-bold text-white">Ready for more?</h4>
                  <p className="text-sm text-slate-300">Join ScratchCode to track your progress, build streaks, and challenge other developers.</p>
                  <Link href="/" className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-6 font-bold text-black hover:bg-slate-200 transition-colors">
                    Join ScratchCode
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Workspace Header */}
              <div className="h-12 border-b border-white/[0.05] px-4 flex items-center justify-between shrink-0 bg-[#111]">
                <div className="flex items-center gap-2 bg-black border border-white/[0.1] px-3 py-1.5 rounded-lg">
                  <span className="text-sm">{detectedLang.icon}</span>
                  <span className="text-xs font-bold text-slate-200">{detectedLang.displayName}</span>
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
                  lessonId="challenge_editor"
                />
              </div>

              {/* Action Bar */}
              <div className="p-4 border-t border-white/5 bg-[#0a0a0a] shrink-0">
                {submitError && <div className="mb-4 text-xs font-bold text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-lg p-3">{submitError}</div>}
                
                <button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  className="w-full bg-rose-500 hover:bg-rose-400 text-white font-black text-sm py-4 rounded-xl transition-all shadow-[0_0_15px_rgba(244,63,94,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Play className="h-5 w-5 fill-current" />}
                  Submit Attempt
                </button>
              </div>

              {/* Test Results */}
              {testResults && testResults.length > 0 && (
                <div className="h-[250px] shrink-0 border-t border-white/5 bg-[#111] overflow-y-auto p-4 custom-scrollbar">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Test Results</h3>
                  <div className="space-y-2">
                    {testResults.map((tr, i) => (
                      <div key={i} className={`p-3 rounded-lg border text-xs font-mono ${tr.passed ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                        <div className="font-bold mb-1">Test {i + 1}: {tr.passed ? 'PASSED' : 'FAILED'}</div>
                        {!tr.passed && (
                          <div className="space-y-1 mt-2 opacity-80">
                            <div><span className="text-slate-500">Input:</span> {tr.input}</div>
                            <div><span className="text-slate-500">Expected:</span> {tr.expected}</div>
                            <div><span className="text-slate-500">Actual:</span> {tr.error || tr.actual}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
