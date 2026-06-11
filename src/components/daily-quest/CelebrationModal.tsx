import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Flame, Sparkles, Share2, LayoutDashboard, ChevronRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  resultData: any;
  questData: any;
  onViewLeaderboard: () => void;
}

export default function CelebrationModal({ isOpen, onClose, resultData, questData, onViewLeaderboard }: CelebrationModalProps) {
  const [activeTab, setActiveTab] = useState<'solution' | 'approaches'>('solution');

  if (!isOpen || !resultData || !questData) return null;

  const { xpEarned, bonusEarned, aiFeedback, solutionApproaches } = resultData;
  const isOptimal = aiFeedback?.verdict === 'optimal';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6 lg:p-8 overflow-y-auto font-sans">
          
          {/* Confetti CSS built-in via style tag */}
          <style dangerouslySetInnerHTML={{__html: `
            .confetti {
              position: absolute;
              width: 10px;
              height: 10px;
              background-color: #f00;
              animation: confetti-fall 3s ease-in-out infinite;
            }
            @keyframes confetti-fall {
              0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
              100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
            }
          `}} />
          {Array.from({ length: 50 }).map((_, i) => {
            const colors = ['#d9f95d', '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            const left = Math.random() * 100;
            const delay = Math.random() * 2;
            return (
              <div 
                key={i} 
                className="confetti z-40" 
                style={{ left: `${left}%`, backgroundColor: color, animationDelay: `${delay}s` }} 
              />
            );
          })}

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-[#0a0a0a] border border-white/[0.1] rounded-2xl max-w-4xl w-full shadow-2xl relative z-50 flex flex-col max-h-[90vh] overflow-hidden"
          >
            {/* Header section */}
            <div className="p-6 md:p-8 text-center relative border-b border-white/[0.05] shrink-0 bg-gradient-to-b from-[#d9f95d]/5 to-transparent">
              <div className="absolute top-4 right-4">
                <button onClick={onClose} className="text-slate-500 hover:text-white p-2">✕</button>
              </div>
              
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#d9f95d]/10 border border-[#d9f95d]/30 text-[#d9f95d] mb-4">
                <Trophy className="h-8 w-8" />
              </div>
              
              <h2 className="text-3xl font-black text-slate-100 tracking-tight">Quest Complete! 🎉</h2>
              <p className="text-slate-400 mt-2">You successfully conquered today's challenge.</p>

              <div className="flex flex-wrap justify-center gap-4 mt-6">
                <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-lg text-amber-500">
                  <Star className="h-5 w-5 fill-current" />
                  <span className="font-bold">+{xpEarned} XP</span>
                </div>
                {bonusEarned && (
                  <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-lg text-orange-400">
                    <Flame className="h-5 w-5 fill-current" />
                    <span className="font-bold">{bonusEarned.description}</span>
                  </div>
                )}
              </div>
            </div>

            {/* AI Feedback Tabs */}
            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
              {/* Tab Navigation */}
              <div className="flex border-b border-white/[0.05] px-4 pt-2 bg-black/40">
                <button
                  onClick={() => setActiveTab('solution')}
                  className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'solution' ? 'border-[#d9f95d] text-[#d9f95d]' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                >
                  Your Solution
                </button>
                {solutionApproaches && solutionApproaches.length > 0 && (
                  <button
                    onClick={() => setActiveTab('approaches')}
                    className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'approaches' ? 'border-[#d9f95d] text-[#d9f95d]' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                  >
                    Better Approaches
                  </button>
                )}
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-black/20">
                {activeTab === 'solution' && aiFeedback && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-slate-200">AI Code Review</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-400">Score:</span>
                        <div className="flex text-[#d9f95d]">
                          {Array.from({ length: 10 }).map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < aiFeedback.codeQuality.score ? 'fill-current' : 'text-slate-700'}`} />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4">
                        <h4 className="text-emerald-500 font-bold mb-2 flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Strengths</h4>
                        <ul className="text-sm text-slate-300 space-y-1.5 list-disc list-inside">
                          {aiFeedback.codeQuality.strengths.map((s: string, i: number) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                      <div className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-4">
                        <h4 className="text-rose-500 font-bold mb-2 flex items-center gap-2"><ChevronRight className="h-4 w-4" /> Areas to Improve</h4>
                        <ul className="text-sm text-slate-300 space-y-1.5 list-disc list-inside">
                          {aiFeedback.codeQuality.improvements.map((s: string, i: number) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                    </div>

                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 flex flex-wrap gap-6 items-center">
                      <div>
                        <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Time Complexity</div>
                        <div className="font-mono text-slate-200">{aiFeedback.complexity.userTimeComplexity}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Space Complexity</div>
                        <div className="font-mono text-slate-200">{aiFeedback.complexity.userSpaceComplexity}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Verdict</div>
                        <div className={`font-bold uppercase ${isOptimal ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {isOptimal ? 'Optimal' : 'Can Be Improved'}
                        </div>
                      </div>
                    </div>

                    {aiFeedback.tips && aiFeedback.tips.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-bold text-slate-300">Pro Tips</h4>
                        <ul className="text-sm text-slate-400 space-y-1 list-disc list-inside">
                          {aiFeedback.tips.map((tip: string, i: number) => <li key={i}>{tip}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'approaches' && solutionApproaches && (
                  <div className="space-y-8">
                    {solutionApproaches.map((app: any, idx: number) => {
                      const isOpt = app.name === questData.optimal_approach;
                      return (
                        <div key={idx} className={`rounded-xl border ${isOpt ? 'border-[#d9f95d]/30 bg-[#d9f95d]/5' : 'border-white/[0.05] bg-white/[0.02]'} overflow-hidden`}>
                          <div className={`p-4 border-b ${isOpt ? 'border-[#d9f95d]/20' : 'border-white/[0.05]'} flex items-center justify-between`}>
                            <h3 className="font-bold text-slate-200 flex items-center gap-2">
                              {app.name}
                              {isOpt && <span className="bg-[#d9f95d] text-black text-[10px] px-2 py-0.5 rounded uppercase font-black tracking-wider">Optimal</span>}
                            </h3>
                            <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                              <span>T: {app.timeComplexity}</span>
                              <span>S: {app.spaceComplexity}</span>
                            </div>
                          </div>
                          <div className="p-4 space-y-4">
                            <p className="text-sm text-slate-300 leading-relaxed">{app.explanation}</p>
                            <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-xs font-mono text-slate-300 border border-white/[0.05]">
                              <code>{app.code}</code>
                            </pre>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-white/[0.05] bg-black/60 flex flex-wrap justify-between items-center gap-4 shrink-0">
              <Link href="/dashboard" className="text-slate-400 hover:text-white text-sm font-semibold flex items-center gap-2 transition-colors">
                <LayoutDashboard className="h-4 w-4" /> Back to Dashboard
              </Link>
              <div className="flex gap-2">
                <button onClick={onViewLeaderboard} className="px-4 py-2 border border-white/[0.1] hover:bg-white/[0.05] rounded-lg text-slate-200 text-sm font-bold transition-colors">
                  View Leaderboard
                </button>
                <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-sm font-bold flex items-center gap-2 transition-colors">
                  <Share2 className="h-4 w-4" /> Share
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
