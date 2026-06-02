'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { 
  Flame, 
  Star, 
  Award, 
  ChevronRight, 
  Zap, 
  Loader2, 
  Trophy, 
  Calendar,
  Sparkles,
  TrendingUp,
  Compass,
  Code2
} from 'lucide-react';
import { motion } from 'framer-motion';
import Skeleton from '@/components/ui/Skeleton';

interface ExtendedTrackProgress {
  track_slug: string;
  track_title: string;
  track_icon?: string;
  track_color?: string;
  completed_lessons: number;
  total_lessons: number;
  progress_percentage: number;
  next_lesson?: {
    id: string;
    title: string;
    unit_title: string;
  };
}

interface ExtendedDashboardData {
  user: {
    xp: number;
    level: number;
    streak_count: number;
    streak_last_date?: Date | string | null;
    username: string;
    avatar_url?: string | null;
  };
  tracks_progress: ExtendedTrackProgress[];
  recent_badges: {
    id: string;
    slug: string;
    title: string;
    description: string;
    icon_emoji: string;
    earned_at: string;
  }[];
  weekly_xp: {
    day: string;
    xp: number;
  }[];
  leaderboard: {
    rank: number;
    username: string;
    avatar_url?: string | null;
    xp_this_week: number;
  }[];
}

const LEVEL_NAMES: Record<number, string> = {
  1: 'Novice Developer',
  2: 'Apprentice Coder',
  3: 'Full-Stack Engineer',
  4: 'Master Architect',
};

const getLevelName = (level: number) => {
  return LEVEL_NAMES[level] || 'Elite Architect';
};

const getLevelProgress = (xp: number) => {
  if (xp >= 5000) {
    return { percent: 100, current: xp, next: 5000, needed: 0 };
  }
  if (xp >= 2000) {
    const currentLevelXP = xp - 2000;
    const nextLevelXP = 3000; // 5000 - 2000
    const percent = Math.min(100, Math.round((currentLevelXP / nextLevelXP) * 100));
    return { percent, current: currentLevelXP, next: nextLevelXP, needed: 5000 - xp };
  }
  if (xp >= 500) {
    const currentLevelXP = xp - 500;
    const nextLevelXP = 1500; // 2000 - 500
    const percent = Math.min(100, Math.round((currentLevelXP / nextLevelXP) * 100));
    return { percent, current: currentLevelXP, next: nextLevelXP, needed: 2000 - xp };
  }
  const percent = Math.min(100, Math.round((xp / 500) * 100));
  return { percent, current: xp, next: 500, needed: 500 - xp };
};

export default function DashboardPage() {
  const [data, setData] = useState<ExtendedDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/dashboard');
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Please sign in to access your dashboard');
        }
        throw new Error('Failed to retrieve dashboard details');
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
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black bg-noise flex flex-col text-slate-100">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-4 md:p-8 overflow-y-auto space-y-8 max-w-7xl mx-auto w-full">
            {/* Header skeletal layout */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.05] pb-10 relative">
              <div className="absolute -top-20 left-0 w-[500px] h-[250px] bg-[#d9f95d]/5 rounded-[100%] blur-[120px] pointer-events-none" />
              <div className="space-y-4 relative z-10">
                <Skeleton className="h-6 w-32 rounded-full bg-white/5" />
                <Skeleton className="h-12 w-64 md:w-96 bg-white/5" />
                <Skeleton className="h-5 w-72 bg-white/5" />
              </div>
              <div className="flex gap-3 relative z-10 md:pb-2">
                <Skeleton className="h-10 w-40 rounded-full bg-white/5" />
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-[#0B1528] border border-white/[0.05]/80 rounded-2xl p-6 flex items-center gap-5">
                  <Skeleton className="h-14 w-14 rounded-2xl animate-pulse" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-3 w-24 animate-pulse" />
                    <Skeleton className="h-6 w-32 animate-pulse" />
                    <Skeleton className="h-2 w-full animate-pulse" />
                  </div>
                </div>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Left Column (2/3 width) */}
              <div className="lg:col-span-2 space-y-8">
                {/* Continue Learning */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-40 animate-pulse" />
                  </div>
                  <div className="bg-[#0B1528] border border-white/[0.05] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4 flex-1">
                      <Skeleton className="h-12 w-12 rounded-xl animate-pulse" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-48 animate-pulse" />
                        <Skeleton className="h-2.5 w-full max-w-sm animate-pulse" />
                      </div>
                    </div>
                    <Skeleton className="h-10 w-36 rounded-xl animate-pulse" />
                  </div>
                </div>

                {/* Activity Chart */}
                <div className="bg-white/[0.01] backdrop-blur-xl border border-white/[0.05] rounded-2xl p-6 space-y-6">
                  <div className="flex justify-between border-b border-slate-850 pb-4">
                    <Skeleton className="h-6 w-48 animate-pulse" />
                    <Skeleton className="h-6 w-24 animate-pulse" />
                  </div>
                  <div className="h-48 flex items-end gap-3 sm:gap-6 px-2 pt-4">
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                        <Skeleton className="w-full rounded-t-lg animate-pulse" style={{ height: `${20 + i * i * 2}%` }} />
                        <Skeleton className="h-3 w-8 animate-pulse" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column (1/3 width) */}
              <div className="space-y-8">
                {/* Leaderboard */}
                <div className="bg-[#0B1528] border border-white/[0.05]/80 rounded-2xl p-6 space-y-5">
                  <div className="flex justify-between border-b border-slate-850 pb-3">
                    <Skeleton className="h-6 w-36 animate-pulse" />
                    <Skeleton className="h-5 w-16 animate-pulse" />
                  </div>
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.01] backdrop-blur-xl/60 border border-slate-850">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-6 w-6 rounded-lg animate-pulse" />
                          <Skeleton className="h-8 w-8 rounded-full animate-pulse" />
                          <Skeleton className="h-4 w-20 animate-pulse" />
                        </div>
                        <Skeleton className="h-4 w-12 animate-pulse" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black bg-noise flex flex-col text-slate-100">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-4 md:p-8 flex items-center justify-center">
            <div className="bg-[#0B1528] border border-white/[0.05] rounded-2xl p-8 max-w-md w-full text-center space-y-6 shadow-xl shadow-none">
              <div className="h-16 w-16 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mx-auto text-3xl">
                ⚠️
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">Dashboard Offline</h3>
                <p className="text-sm text-slate-400">{error}</p>
              </div>
              {error.includes('sign in') ? (
                <Link
                  href="/login"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-[#d9f95d] px-6 font-bold text-slate-950 hover:bg-[#d9f95d] transition-all w-full"
                >
                  Sign In
                </Link>
              ) : (
                <button
                  onClick={fetchDashboardData}
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-white/10 border border-slate-700 hover:border-slate-600 text-white px-6 font-bold hover:bg-slate-750 transition-all w-full"
                >
                  Retry Connection
                </button>
              )}
            </div>
          </main>
        </div>
      </div>
    );
  }

  const user = data?.user;
  const levelName = user ? getLevelName(user.level) : '';
  const levelProgress = user ? getLevelProgress(user.xp) : { percent: 0, current: 0, next: 100, needed: 0 };
  const hasStartedTracks = data && data.tracks_progress.length > 0;
  const maxWeeklyXP = data ? Math.max(...data.weekly_xp.map((d) => d.xp), 0) : 0;

  return (
    <div className="min-h-screen bg-black bg-noise flex flex-col text-slate-100">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto space-y-8 max-w-7xl mx-auto w-full">
          {/* Header HUD greeting */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.05] pb-10 relative">
            <div className="absolute -top-20 left-0 w-[500px] h-[250px] bg-[#d9f95d]/5 rounded-[100%] blur-[120px] pointer-events-none" />
            
            <div className="space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-mono font-bold tracking-[0.2em] text-[#d9f95d] uppercase">
                [01] Command Center
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[1.05]">
                Welcome back, <br className="hidden md:block" />
                <span className="text-[#d9f95d] font-script font-normal italic pr-2">{user?.username || 'Coder'}</span>
              </h1>
              <p className="text-slate-400 text-lg max-w-md">Ready to execute some code today? Keep your daily streak blazing.</p>
            </div>
            
            <div className="flex flex-wrap gap-3 relative z-10 md:pb-2">
              <span className="inline-flex h-10 items-center gap-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 px-5 text-xs font-mono font-bold tracking-widest uppercase text-slate-300 shadow-xl">
                <Compass className="h-4 w-4 text-cyan-400" /> Dashboard
              </span>
              <span className="inline-flex h-10 items-center gap-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 px-5 text-xs font-mono font-bold tracking-widest uppercase text-emerald-400 shadow-xl animate-pulse">
                 Online
              </span>
            </div>
          </div>

          {/* TOP ROW — Unified Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/[0.05] border-b border-white/[0.05] mb-12">
            {/* Streak Stat */}
            <div className="py-8 px-4 md:px-8 relative group hover:bg-white/[0.02] transition-colors flex flex-col justify-center">
              <div className="flex items-center justify-between mb-4">
                <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-500 group-hover:text-orange-400 transition-colors">Current Streak</div>
                <Flame className="h-5 w-5 text-orange-500/50 group-hover:text-orange-400 transition-colors" />
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-5xl font-black text-white tracking-tighter">{user?.streak_count || 0}</div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Days</div>
              </div>
              <div className="mt-4 text-xs text-slate-400 font-medium">
                {user?.streak_count && user.streak_count > 0 ? "You're on fire! Keep it up." : "Complete a lesson to start."}
              </div>
            </div>

            {/* XP Stat */}
            <div className="py-8 px-4 md:px-8 relative group hover:bg-white/[0.02] transition-colors flex flex-col justify-center">
              <div className="flex items-center justify-between mb-4">
                <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-500 group-hover:text-emerald-400 transition-colors">Total Experience</div>
                <Star className="h-5 w-5 text-emerald-500/50 group-hover:text-emerald-400 transition-colors" />
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-5xl font-black text-white tracking-tighter">{user?.xp || 0}</div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">XP</div>
              </div>
              <div className="mt-4 text-xs text-slate-400 font-medium">
                Accumulated across all tracks.
              </div>
            </div>

            {/* Level Stat */}
            <div className="py-8 px-4 md:px-8 relative group hover:bg-white/[0.02] transition-colors flex flex-col justify-center">
              <div className="flex items-center justify-between mb-4">
                <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-500 group-hover:text-purple-400 transition-colors">Rank Standing</div>
                <Award className="h-5 w-5 text-purple-500/50 group-hover:text-purple-400 transition-colors" />
              </div>
              <div className="flex items-baseline gap-3 mb-4">
                <div className="text-5xl font-black text-white tracking-tighter">{user?.level || 1}</div>
                <div className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-1 rounded border border-purple-500/20 uppercase tracking-widest">{levelName}</div>
              </div>
              {/* Ultra minimal progress bar */}
              <div className="space-y-2 w-full">
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#d9f95d] rounded-full transition-all duration-500" 
                    style={{ width: `${levelProgress.percent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>{levelProgress.current} / {levelProgress.next}</span>
                  <span>{levelProgress.percent.toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </div>
          {/* TWO COLUMN GRID — Content Main */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left / Center Column (2/3 width on desktop) */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* CONTINUE LEARNING SECTION */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-cyan-400 fill-cyan-400/10" />
                  <h2 className="text-xl font-bold text-white tracking-tight">Continue Learning</h2>
                </div>

                {hasStartedTracks ? (
                  <div className="grid grid-cols-1 gap-4">
                    {data.tracks_progress.map((track) => (
                      <motion.div
                        key={track.track_slug}
                        whileHover={{ y: -1 }}
                        className="bg-transparent border-b border-white/[0.05] last:border-0 hover:bg-white/[0.01] p-4 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all relative overflow-hidden"
                      >
                        {/* Custom visual color strip */}
                        <div 
                          className="absolute left-0 top-0 bottom-0 w-1.5" 
                          style={{ backgroundColor: track.track_color || '#10B981' }}
                        />
                        
                        {/* Track Info */}
                        <div className="flex items-center gap-4 flex-1">
                          <div className="h-12 w-12 rounded-xl bg-black bg-noise border border-slate-850 flex items-center justify-center text-2xl shadow-inner">
                            {track.track_icon || '🚀'}
                          </div>
                          <div className="space-y-1.5 flex-1">
                            <h3 className="font-bold text-white text-base flex items-center gap-2">
                              {track.track_title}
                              <span className="text-[10px] px-1.5 py-0.5 bg-white/10 rounded font-bold text-slate-400">
                                {track.progress_percentage}% Complete
                              </span>
                            </h3>
                            {/* Track progress bar */}
                            <div className="space-y-1 max-w-md">
                              <div className="w-full h-2 bg-black bg-noise border border-white/[0.05] rounded-full overflow-hidden">
                                <div 
                                  className="h-full rounded-full transition-all duration-500" 
                                  style={{ 
                                    width: `${track.progress_percentage}%`,
                                    backgroundColor: track.track_color || '#10B981'
                                  }}
                                />
                              </div>
                              <div className="text-[11px] text-slate-500 font-medium">
                                Lesson Progress: <span className="font-bold text-slate-400">{track.completed_lessons}</span> of <span className="font-bold text-slate-400">{track.total_lessons}</span> Completed
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Next Lesson Redirect Widget */}
                        <div className="flex flex-col md:items-end gap-3 min-w-[200px]">
                          {track.next_lesson ? (
                            <>
                              <div className="space-y-0.5 md:text-right">
                                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black font-mono">Next Objective</div>
                                <div className="text-xs font-bold text-slate-300 truncate max-w-[200px]" title={track.next_lesson.title}>
                                  {track.next_lesson.title}
                                </div>
                                <div className="text-[10px] text-slate-400 italic">
                                  {track.next_lesson.unit_title}
                                </div>
                              </div>
                              <Link
                                href={`/learn/${track.next_lesson.id}`}
                                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-[#d9f95d] hover:bg-[#d9f95d] text-slate-950 font-extrabold text-xs tracking-wide px-5 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md shadow-[#d9f95d]/10 cursor-pointer"
                              >
                                Resume Mission <ChevronRight className="h-4 w-4 stroke-[3px]" />
                              </Link>
                            </>
                          ) : (
                            <div className="md:text-right">
                              <div className="text-xs font-bold text-[#d9f95d] flex items-center gap-1 md:justify-end">
                                🎉 Track Mastered
                              </div>
                              <div className="text-[10px] text-slate-500 mt-0.5">
                                You finished all lessons in this track!
                              </div>
                              <Link
                                href="/tracks"
                                className="mt-2.5 inline-flex h-8 items-center justify-center rounded-lg bg-white/10 hover:bg-slate-700 text-white font-bold text-[10px] px-3.5 transition-colors cursor-pointer"
                              >
                                Explore Other Tracks
                              </Link>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  // EMPTY STATE — Choose your first track
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-dashed border-white/10 rounded-xl p-12 text-center space-y-6 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-amber-500/5 opacity-50" />
                    <div className="h-16 w-16 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-full flex items-center justify-center mx-auto text-3xl relative">
                      <Sparkles className="h-8 w-8 text-orange-400 animate-pulse" />
                    </div>
                    <div className="space-y-2 max-w-sm mx-auto relative">
                      <h3 className="text-lg font-bold text-white">Select Your Coding Track</h3>
                      <p className="text-xs text-slate-400">You haven't started a learning curriculum yet. Initiate a track to learn core coding units, compile exercises, and win badges!</p>
                    </div>
                    <div className="relative">
                      <Link
                        href="/tracks"
                        className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-bold px-6 shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                      >
                        Choose Your First Track <ChevronRight className="h-4.5 w-4.5 stroke-[2.5px]" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* ACTIVITY THIS WEEK (Bar Chart) */}
              <div className="space-y-6 pt-8 border-t border-white/[0.05]">
                <div className="flex items-center justify-between border-b border-white/10 pb-6">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-mono font-bold tracking-[0.2em] text-slate-300 uppercase">
                    [03] Activity Chart
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-black bg-noise border border-slate-850 px-2.5 py-1 rounded-md">
                    <TrendingUp className="h-3.5 w-3.5 text-cyan-400" /> Last 7 Days
                  </div>
                </div>

                {/* Pure CSS Bar Chart */}
                <div className="space-y-4">
                  {data && data.weekly_xp.some((day) => day.xp > 0) ? (
                    <div className="h-48 flex items-end gap-3 sm:gap-6 px-2 pt-4 relative">
                      {/* Grid guideline accents */}
                      <div className="absolute inset-x-0 bottom-0 border-b border-slate-850" />
                      <div className="absolute inset-x-0 bottom-1/2 border-b border-slate-850 border-dashed" />
                      <div className="absolute inset-x-0 top-0 border-b border-slate-850/50" />

                      {data.weekly_xp.map((day, idx) => {
                        const heightPercent = maxWeeklyXP > 0 
                          ? Math.round((day.xp / maxWeeklyXP) * 100) 
                          : 0;

                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center h-full group relative">
                            {/* Hover tooltip */}
                            <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-10">
                              <span className="bg-black bg-noise border border-slate-850 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded shadow shadow-[#d9f95d]/5 whitespace-nowrap">
                                ⭐ {day.xp} XP
                              </span>
                            </div>

                            <div className="w-full flex-1 flex items-end justify-center relative">
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${day.xp > 0 ? Math.max(10, heightPercent) : 0}%` }}
                                transition={{ delay: idx * 0.05, duration: 0.6, ease: "easeOut" }}
                                className={`w-3/4 sm:w-1/2 rounded-t-lg relative transition-colors ${
                                  day.xp > 0 
                                    ? "bg-gradient-to-t from-purple-500 to-pink-500 shadow-[0_0_10px_rgba(168,85,247,0.15)] group-hover:from-purple-400 group-hover:to-pink-400" 
                                    : "bg-white/10/40"
                                }`}
                              />
                            </div>

                            {/* X-axis day Label */}
                            <div className="text-[10px] font-semibold text-slate-500 mt-2 font-mono group-hover:text-slate-300 transition-colors uppercase">
                              {day.day}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    // Chart Empty State (No XP earned in 7 days)
                    <div className="h-48 flex flex-col items-center justify-center text-center space-y-2 border border-slate-850 border-dashed rounded-xl bg-black bg-noise/30">
                      <div className="text-2xl filter saturate-50 opacity-60">📊</div>
                      <div className="text-xs font-bold text-slate-400">No activity recorded this week</div>
                      <p className="text-[10px] text-slate-500 max-w-[240px]">Work on track modules and correct exercises to populate your weekly mini-chart stats!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column (1/3 width on desktop) */}
            <div className="space-y-8">
              
              {/* LEADERBOARD WIDGET */}
              <div className="space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 h-16 w-16 bg-cyan-500/5 rounded-full blur-xl" />
                
                <div className="flex items-center justify-between border-b border-white/10 pb-6">
                  <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/10 bg-amber-500/5 px-4 py-1.5 text-[10px] font-mono font-bold tracking-[0.2em] text-amber-400 uppercase">
                    [04] Top Coders
                  </div>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase tracking-widest">
                    Weekly
                  </span>
                </div>

                <div className="space-y-2.5">
                  {data && data.leaderboard.length > 0 ? (
                    data.leaderboard.map((row) => {
                      const isCurrentUser = row.username === user?.username;
                      
                      // Custom metallic colors for top 3
                      let rankBadgeClass = "bg-white/[0.01] backdrop-blur-xl border-white/[0.05] text-slate-400";
                      if (row.rank === 1) rankBadgeClass = "bg-amber-500/15 border-amber-500/30 text-amber-400 shadow shadow-amber-500/10";
                      else if (row.rank === 2) rankBadgeClass = "bg-slate-300/10 border-slate-300/20 text-slate-300";
                      else if (row.rank === 3) rankBadgeClass = "bg-amber-700/15 border-amber-700/25 text-amber-600";

                      return (
                        <div
                          key={row.username}
                          className={`flex items-center justify-between py-3 border-b border-white/[0.05] last:border-0 transition-all ${
                            isCurrentUser
                              ? "bg-cyan-500/5 px-3 rounded-lg -mx-3"
                              : "hover:bg-white/[0.01] px-3 rounded-lg -mx-3"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Rank circle */}
                            <div className={`h-6 w-6 rounded-lg border font-mono text-[10px] font-black flex items-center justify-center ${rankBadgeClass}`}>
                              {row.rank === 1 ? '🥇' : row.rank === 2 ? '🥈' : row.rank === 3 ? '🥉' : row.rank}
                            </div>
                            {/* User Avatar */}
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-xs flex items-center justify-center select-none shadow">
                              {row.username.substring(0, 2).toUpperCase()}
                            </div>
                            {/* Username */}
                            <span 
                              className={`text-xs font-bold truncate max-w-[120px] ${
                                isCurrentUser ? "text-cyan-400" : "text-slate-200"
                              }`}
                              title={`@${row.username}`}
                            >
                              @{row.username}
                              {isCurrentUser && (
                                <span className="block text-[8px] text-cyan-400 font-bold uppercase tracking-wider font-mono">You</span>
                              )}
                            </span>
                          </div>
                          
                          {/* XP this week */}
                          <div className="text-right flex items-center gap-1 text-xs font-mono font-bold text-amber-400">
                            ⭐ {row.xp_this_week} <span className="text-[10px] text-slate-500 font-sans font-medium">XP</span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    // Leaderboard Empty State
                    <div className="text-center py-6 text-slate-500 space-y-1">
                      <div className="text-xl">🏆</div>
                      <div className="text-xs font-bold">Leaderboard unpopulated</div>
                      <p className="text-[9px] text-slate-500">Wait for users to start earning XP to populate the standings!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* RECENT BADGES WIDGET */}
              <div className="space-y-6 pt-12 border-t border-white/[0.05] relative">
                <div className="flex items-center justify-between border-b border-white/10 pb-6">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-mono font-bold tracking-[0.2em] text-slate-300 uppercase">
                    [05] Recent Badges
                  </div>
                </div>

                <div className="space-y-3">
                  {data && data.recent_badges.length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 gap-2.5">
                        {data.recent_badges.map((b) => {
                          const date = new Date(b.earned_at);
                          const formattedDate = date.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          });

                          return (
                            <div 
                              key={b.slug}
                              className="flex items-center gap-3.5 group hover:bg-white/[0.01] p-2 transition-colors border-b border-white/[0.05] last:border-0"
                            >
                              <div className="h-10 w-10 rounded-lg bg-white/[0.01] backdrop-blur-xl flex items-center justify-center text-2xl filter drop-shadow group-hover:scale-110 transition-transform">
                                {b.icon_emoji}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-xs font-bold text-slate-200 leading-snug truncate">{b.title}</div>
                                <div className="text-[9px] text-slate-400 font-semibold leading-relaxed mt-0.5">{b.description}</div>
                              </div>
                              <div className="text-[9px] font-mono text-slate-500 font-bold text-right self-start pt-0.5 whitespace-nowrap">
                                {formattedDate}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="pt-2 border-t border-slate-850">
                        <Link 
                          href="/badges" 
                          className="text-xs text-[#d9f95d] hover:text-emerald-300 font-bold flex items-center gap-1 transition-colors group cursor-pointer justify-center"
                        >
                          View all badges 
                          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      </div>
                    </>
                  ) : (
                    // Badges Empty State
                    <div className="text-center py-6 border border-slate-850 border-dashed rounded-xl bg-black bg-noise/30 space-y-3">
                      <div className="text-2xl filter grayscale opacity-60">🏅</div>
                      <div className="space-y-0.5 max-w-[200px] mx-auto">
                        <div className="text-xs font-bold text-slate-400">No Badges Unlocked</div>
                        <p className="text-[10px] text-slate-500 leading-normal">Complete your first lesson to earn a badge</p>
                      </div>
                      <div className="pt-1.5">
                        <Link 
                          href="/tracks" 
                          className="inline-flex h-7 items-center justify-center rounded-lg bg-white/10 hover:bg-slate-700 text-white text-[10px] font-bold px-3.5 transition-colors cursor-pointer"
                        >
                          Explore Tracks
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
