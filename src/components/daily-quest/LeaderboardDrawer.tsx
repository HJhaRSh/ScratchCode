import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, RefreshCcw, Timer, Star } from 'lucide-react';
import Image from 'next/image';

interface LeaderboardDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  dayNumber: number;
}

interface Solver {
  username: string;
  avatar: string | null;
  xp_earned: number;
  language: string;
  time_taken: number;
}

export default function LeaderboardDrawer({ isOpen, onClose, dayNumber }: LeaderboardDrawerProps) {
  const [solvers, setSolvers] = useState<Solver[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/daily-quest/leaderboard');
      if (res.ok) {
        const data = await res.json();
        setSolvers(data.leaderboard || []);
      } else {
        setError('Failed to fetch leaderboard');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLeaderboard();
    }
  }, [isOpen]);

  const formatTime = (ms: number) => {
    if (!ms || ms <= 0) return '--:--';
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const remainingSeconds = s % 60;
    return `${m}m ${remainingSeconds}s`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0a0a0a] border-l border-white/[0.05] z-50 flex flex-col font-sans"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/[0.05]">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                <h2 className="text-lg font-bold text-slate-100">Leaderboard</h2>
                <span className="text-xs text-slate-500 bg-white/[0.05] px-2 py-0.5 rounded-full">Day {dayNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={fetchLeaderboard}
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                  title="Refresh"
                >
                  <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin text-[#d9f95d]' : ''}`} />
                </button>
                <button 
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {loading && solvers.length === 0 ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-2 border-[#d9f95d]/20 border-t-[#d9f95d] rounded-full animate-spin" />
                </div>
              ) : error ? (
                <div className="text-center py-8 text-rose-500 text-sm">{error}</div>
              ) : solvers.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm">
                  No one has solved today's quest yet. Be the first!
                </div>
              ) : (
                <div className="space-y-2">
                  {solvers.map((solver, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/[0.05] rounded-lg"
                    >
                      <div className="flex-shrink-0 w-6 text-center text-xs font-bold text-slate-500">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                      </div>
                      
                      <div className="h-8 w-8 rounded-full bg-slate-800 overflow-hidden flex-shrink-0">
                        {solver.avatar ? (
                          <Image src={solver.avatar} alt={solver.username} width={32} height={32} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-400 bg-slate-800">
                            {solver.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-slate-200 truncate">
                          {solver.username}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          Solved in {solver.language}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                          <Timer className="h-3 w-3" />
                          {formatTime(solver.time_taken)}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold">
                          <Star className="h-3 w-3 fill-current" />
                          +{solver.xp_earned}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
