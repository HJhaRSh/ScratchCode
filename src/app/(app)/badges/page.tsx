'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Skeleton from '@/components/ui/Skeleton';
import { Award, Lock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface Badge {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon_emoji: string;
  earned_at: string | null;
}

interface BadgesData {
  earned: Badge[];
  unearned: Badge[];
}

const badgeColors = [
  { border: 'border-cyan-500/30', bgGlow: 'from-cyan-500/10', dropShadow: 'drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]', text: 'text-cyan-400', hoverBorder: 'hover:border-cyan-500/50', textMuted: 'text-cyan-500/80', bgOrb: 'bg-cyan-500/20', progressGradient: 'from-cyan-500 to-blue-500' },
  { border: 'border-[#d9f95d]/30', bgGlow: 'from-[#d9f95d]/10', dropShadow: 'drop-shadow-[0_0_15px_rgba(217,249,93,0.3)]', text: 'text-[#d9f95d]', hoverBorder: 'hover:border-[#d9f95d]/50', textMuted: 'text-[#d9f95d]/80', bgOrb: 'bg-[#d9f95d]/20', progressGradient: 'from-[#d9f95d] to-lime-500' },
  { border: 'border-purple-500/30', bgGlow: 'from-purple-500/10', dropShadow: 'drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]', text: 'text-purple-400', hoverBorder: 'hover:border-purple-500/50', textMuted: 'text-purple-500/80', bgOrb: 'bg-purple-500/20', progressGradient: 'from-purple-500 to-fuchsia-500' },
  { border: 'border-orange-500/30', bgGlow: 'from-orange-500/10', dropShadow: 'drop-shadow-[0_0_15px_rgba(249,115,22,0.4)]', text: 'text-orange-400', hoverBorder: 'hover:border-orange-500/50', textMuted: 'text-orange-500/80', bgOrb: 'bg-orange-500/20', progressGradient: 'from-orange-500 to-amber-500' },
  { border: 'border-pink-500/30', bgGlow: 'from-pink-500/10', dropShadow: 'drop-shadow-[0_0_15px_rgba(236,72,153,0.4)]', text: 'text-pink-400', hoverBorder: 'hover:border-pink-500/50', textMuted: 'text-pink-500/80', bgOrb: 'bg-pink-500/20', progressGradient: 'from-pink-500 to-rose-500' },
];

export default function BadgesPage() {
  const [data, setData] = useState<BadgesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBadges = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/badges');
      if (!res.ok) {
        throw new Error('Failed to retrieve badges');
      }
      const jsonData = await res.json();
      setData(jsonData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBadges();
  }, []);

  const totalBadges = data ? data.earned.length + data.unearned.length : 0;
  const earnedBadges = data ? data.earned.length : 0;
  const progressPercent = totalBadges > 0 ? Math.round((earnedBadges / totalBadges) * 100) : 0;

  // Use purple as the primary accent color for the header in this page
  const headerColor = badgeColors[2]; 

  return (
    <div className="min-h-screen bg-black bg-noise flex flex-col text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto space-y-8 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.05] pb-10 relative">
            <div className={`absolute -top-20 left-0 w-[500px] h-[250px] ${headerColor.bgOrb} rounded-[100%] blur-[120px] pointer-events-none`} />
            
            <div className="space-y-4 relative z-10">
              <div className={`inline-flex items-center gap-2 rounded-full border border-cyan-500/10 bg-cyan-500/5 px-4 py-1.5 text-[10px] font-mono font-bold tracking-[0.2em] ${headerColor.text} uppercase`}>
                [02] Achievements
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[1.05]">
                Your <span className={`${headerColor.text} font-script font-normal italic pr-2`}>Badges</span>
              </h1>
              <p className="text-slate-400 text-lg max-w-md">Complete lessons, master tracks, and build your streak to collect them all.</p>
            </div>
            
            <div className="flex flex-col items-end gap-3 relative z-10 md:pb-2">
              <div className="text-right space-y-1">
                <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-500">Collection Progress</div>
                <div className="text-3xl font-black text-white tracking-tighter">
                  {loading ? '-' : earnedBadges} <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">/ {loading ? '-' : totalBadges}</span>
                </div>
              </div>
              <div className="w-48 h-2 bg-black bg-noise border border-white/[0.05] rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 bg-gradient-to-r ${headerColor.progressGradient}`} 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-[#0B1528] border border-white/[0.05] rounded-2xl p-6 flex flex-col items-center gap-5 text-center">
                  <Skeleton className="h-20 w-20 rounded-full animate-pulse" />
                  <div className="space-y-3 w-full">
                    <Skeleton className="h-6 w-3/4 mx-auto animate-pulse" />
                    <Skeleton className="h-4 w-full animate-pulse" />
                    <Skeleton className="h-4 w-5/6 mx-auto animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-[#0B1528] border border-white/[0.05] rounded-2xl p-12 text-center space-y-6 max-w-lg mx-auto shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl" />
              <div className="text-4xl">⚠️</div>
              <div className="space-y-2 relative z-10">
                <h3 className="text-xl font-bold text-white">Could not load badges</h3>
                <p className="text-slate-400">{error}</p>
              </div>
              <button
                onClick={fetchBadges}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-white/10 border border-slate-700 hover:border-slate-600 text-white px-6 font-bold hover:bg-slate-750 transition-all relative z-10"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Earned Badges */}
              {data && data.earned.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                    <Sparkles className={`h-5 w-5 ${headerColor.text}`} />
                    <h2 className="text-xl font-bold text-white tracking-tight">Earned Badges</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.earned.map((badge, idx) => {
                      const color = badgeColors[idx % badgeColors.length];
                      return (
                        <motion.div
                          key={badge.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className={`bg-white/[0.02] backdrop-blur-xl border ${color.border} rounded-2xl p-6 flex flex-col items-center text-center gap-4 relative overflow-hidden group ${color.hoverBorder} transition-colors`}
                        >
                          <div className={`absolute inset-0 bg-gradient-to-b ${color.bgGlow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                          
                          <div className={`h-24 w-24 rounded-full bg-black bg-noise border ${color.border} flex items-center justify-center text-5xl filter ${color.dropShadow} group-hover:scale-110 transition-transform duration-500 relative z-10`}>
                            {badge.icon_emoji}
                          </div>
                          
                          <div className="space-y-2 relative z-10">
                            <h3 className={`text-lg font-bold text-white group-hover:${color.text} transition-colors`}>{badge.title}</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">{badge.description}</p>
                          </div>
                          
                          <div className={`mt-auto pt-4 w-full border-t border-white/5 text-xs ${color.textMuted} font-mono font-bold tracking-wider relative z-10`}>
                            EARNED ON {badge.earned_at ? new Date(badge.earned_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase() : 'UNKNOWN'}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Unearned Badges */}
              {data && data.unearned.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                    <Lock className="h-5 w-5 text-slate-500" />
                    <h2 className="text-xl font-bold text-slate-300 tracking-tight">Locked Badges</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.unearned.map((badge, idx) => {
                      // Using subtle hints of colors for unearned badges
                      const color = badgeColors[idx % badgeColors.length];
                      return (
                        <motion.div
                          key={badge.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="bg-white/[0.01] backdrop-blur-xl border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center gap-4 group hover:border-white/10 transition-colors"
                        >
                          <div className={`h-24 w-24 rounded-full bg-black bg-noise border border-white/10 flex items-center justify-center text-5xl filter grayscale opacity-40 group-hover:grayscale-[50%] group-hover:opacity-100 ${color.dropShadow} transition-all duration-500`}>
                            {badge.icon_emoji}
                          </div>
                          
                          <div className="space-y-2 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                            <h3 className="text-lg font-bold text-slate-300">{badge.title}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">{badge.description}</p>
                          </div>
                          
                          <div className="mt-auto pt-4 w-full border-t border-white/5 text-[10px] text-slate-600 font-mono font-bold tracking-wider uppercase flex items-center justify-center gap-1">
                            <Lock className="h-3 w-3" /> Locked
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {data && data.earned.length === 0 && data.unearned.length === 0 && (
                <div className="text-center py-12 border border-slate-850 border-dashed rounded-xl bg-black bg-noise/30 space-y-4">
                  <div className="text-4xl opacity-50">🏆</div>
                  <div className="space-y-1">
                    <div className="text-lg font-bold text-slate-400">No Badges Available</div>
                    <p className="text-sm text-slate-500">Check back later when new badges are added.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
