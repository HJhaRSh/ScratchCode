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
      <div className="min-h-screen bg-slate-950 flex flex-col text-slate-100">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-4 md:p-8 overflow-y-auto space-y-8 max-w-7xl mx-auto w-full">
            {/* Header skeletal layout */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-6">
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-72" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 w-32 rounded-full" />
                <Skeleton className="h-9 w-28 rounded-full" />
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-[#0B1528] border border-slate-800/80 rounded-2xl p-6 flex items-center gap-5">
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
                  <div className="bg-[#0B1528] border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
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
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
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
                <div className="bg-[#0B1528] border border-slate-800/80 rounded-2xl p-6 space-y-5">
                  <div className="flex justify-between border-b border-slate-850 pb-3">
                    <Skeleton className="h-6 w-36 animate-pulse" />
                    <Skeleton className="h-5 w-16 animate-pulse" />
                  </div>
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-850">
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
      <div className="min-h-screen bg-slate-950 flex flex-col text-slate-100">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-4 md:p-8 flex items-center justify-center">
            <div className="bg-[#0B1528] border border-slate-800 rounded-2xl p-8 max-w-md w-full text-center space-y-6 shadow-xl shadow-red-950/10">
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
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-500 px-6 font-bold text-slate-950 hover:bg-emerald-400 transition-all w-full"
                >
                  Sign In
                </Link>
              ) : (
                <button
                  onClick={fetchDashboardData}
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 hover:border-slate-600 text-white px-6 font-bold hover:bg-slate-750 transition-all w-full"
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
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-100">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto space-y-8 max-w-7xl mx-auto w-full">
          {/* Header HUD greeting */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                Coder HUD <span className="text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest animate-pulse">Online</span>
              </h1>
              <p className="text-slate-400 text-sm">Welcome back, <span className="font-semibold text-emerald-400">@{user?.username}</span>! Keep your daily streak blazing.</p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <span className="inline-flex h-9 items-center gap-1.5 rounded-full bg-slate-900 border border-slate-800 px-4 text-xs font-bold text-slate-300">
                <Compass className="h-4 w-4 text-cyan-400" /> Sector: Dashboard
              </span>
              <span className="inline-flex h-9 items-center gap-1.5 rounded-full bg-slate-900 border border-slate-800 px-4 text-xs font-bold text-slate-300">
                <Code2 className="h-4 w-4 text-purple-400" /> Version: 1.0.0
              </span>
            </div>
          </div>

          {/* TOP ROW — 3 stat cards side by side */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Streak Card */}
            <motion.div 
              whileHover={{ scale: 1.015 }}
              className="bg-[#0B1528] border border-slate-800/80 hover:border-orange-500/40 rounded-2xl p-6 flex items-center gap-5 relative overflow-hidden group transition-all shadow-[0_4px_20px_rgba(0,0,0,0.25)]"
            >
              <div className="absolute top-0 right-0 h-24 w-24 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-all" />
              <div className="h-14 w-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-3xl text-orange-400">
                <motion.span
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                  🔥
                </motion.span>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Current Streak</div>
                <div className="text-2xl font-black text-white group-hover:text-orange-400 transition-colors">
                  {user?.streak_count} Days
                </div>
                <div className="text-[11px] text-slate-500">
                  {user?.streak_count && user.streak_count > 0 ? "You're on fire! Keep it up." : "Complete a lesson to start a streak!"}
                </div>
              </div>
            </motion.div>

            {/* XP Card */}
            <motion.div 
              whileHover={{ scale: 1.015 }}
              className="bg-[#0B1528] border border-slate-800/80 hover:border-amber-500/40 rounded-2xl p-6 flex items-center gap-5 relative overflow-hidden group transition-all shadow-[0_4px_20px_rgba(0,0,0,0.25)]"
            >
              <div className="absolute top-0 right-0 h-24 w-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all" />
              <div className="h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-3xl text-amber-400">
                <Star className="h-7 w-7 text-amber-400 fill-amber-400/20 group-hover:rotate-45 transition-transform duration-300" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Cumulative Experience</div>
                <div className="text-2xl font-black text-white group-hover:text-amber-400 transition-colors">
                  {user?.xp} XP
                </div>
                <div className="text-[11px] text-slate-500">Total XP accumulated overall</div>
              </div>
            </motion.div>

            {/* Level Card */}
            <motion.div 
              whileHover={{ scale: 1.015 }}
              className="bg-[#0B1528] border border-slate-800/80 hover:border-emerald-500/40 rounded-2xl p-6 flex items-center gap-5 relative overflow-hidden group transition-all shadow-[0_4px_20px_rgba(0,0,0,0.25)]"
            >
              <div className="absolute top-0 right-0 h-24 w-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all" />
              <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-3xl text-emerald-400">
                <Award className="h-7 w-7 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Rank Standing</div>
                <div className="text-lg font-black text-white truncate group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  Lvl {user?.level} <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{levelName}</span>
                </div>
                {/* Level Progress Subtext Bar */}
                <div className="space-y-1">
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-500" 
                      style={{ width: `${levelProgress.percent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-500 font-semibold font-mono">
                    <span>{levelProgress.current} / {levelProgress.next} XP</span>
                    {levelProgress.needed > 0 ? (
                      <span>-{levelProgress.needed} XP to Level Up</span>
                    ) : (
                      <span>MAX LEVEL Reached</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* TWO COLUMN GRID — Content Main */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left / Center Column (2/3 width on desktop) */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* CONTINUE LEARNING SECTION */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-emerald-400 fill-emerald-400/10" />
                  <h2 className="text-xl font-bold text-white tracking-tight">Continue Learning</h2>
                </div>

                {hasStartedTracks ? (
                  <div className="grid grid-cols-1 gap-4">
                    {data.tracks_progress.map((track) => (
                      <motion.div
                        key={track.track_slug}
                        whileHover={{ y: -2 }}
                        className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md transition-all relative overflow-hidden"
                      >
                        {/* Custom visual color strip */}
                        <div 
                          className="absolute left-0 top-0 bottom-0 w-1.5" 
                          style={{ backgroundColor: track.track_color || '#10B981' }}
                        />
                        
                        {/* Track Info */}
                        <div className="flex items-center gap-4 flex-1">
                          <div className="h-12 w-12 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-center text-2xl shadow-inner">
                            {track.track_icon || '🚀'}
                          </div>
                          <div className="space-y-1.5 flex-1">
                            <h3 className="font-bold text-white text-base flex items-center gap-2">
                              {track.track_title}
                              <span className="text-[10px] px-1.5 py-0.5 bg-slate-800 rounded font-bold text-slate-400">
                                {track.progress_percentage}% Complete
                              </span>
                            </h3>
                            {/* Track progress bar */}
                            <div className="space-y-1 max-w-md">
                              <div className="w-full h-2 bg-slate-950 border border-slate-900 rounded-full overflow-hidden">
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
                                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs tracking-wide px-5 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md shadow-emerald-500/10 cursor-pointer"
                              >
                                Resume Mission <ChevronRight className="h-4 w-4 stroke-[3px]" />
                              </Link>
                            </>
                          ) : (
                            <div className="md:text-right">
                              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1 md:justify-end">
                                🎉 Track Mastered
                              </div>
                              <div className="text-[10px] text-slate-500 mt-0.5">
                                You finished all lessons in this track!
                              </div>
                              <Link
                                href="/tracks"
                                className="mt-2.5 inline-flex h-8 items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-[10px] px-3.5 transition-colors cursor-pointer"
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
                    className="bg-[#0B1528]/80 border border-dashed border-slate-800 rounded-2xl p-8 text-center space-y-6 shadow-xl relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 opacity-50" />
                    <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl relative">
                      <Sparkles className="h-8 w-8 text-emerald-400 animate-pulse" />
                    </div>
                    <div className="space-y-2 max-w-sm mx-auto relative">
                      <h3 className="text-lg font-bold text-white">Select Your Coding Track</h3>
                      <p className="text-xs text-slate-400">You haven't started a learning curriculum yet. Initiate a track to learn core coding units, compile exercises, and win badges!</p>
                    </div>
                    <div className="relative">
                      <Link
                        href="/tracks"
                        className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 shadow-lg shadow-emerald-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                      >
                        Choose Your First Track <ChevronRight className="h-4.5 w-4.5 stroke-[2.5px]" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* ACTIVITY THIS WEEK (Bar Chart) */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-md">
                <div className="flex items-center justify-between border-b border-slate-850 pb-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-cyan-400" /> Daily Activity This Week
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-slate-950 border border-slate-850 px-2.5 py-1 rounded-md">
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
                              <span className="bg-slate-950 border border-slate-850 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded shadow shadow-emerald-500/5 whitespace-nowrap">
                                ⭐ {day.xp} XP
                              </span>
                            </div>

                            {/* Bar container */}
                            <div className="w-full flex-1 flex items-end justify-center relative">
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${day.xp > 0 ? Math.max(10, heightPercent) : 0}%` }}
                                transition={{ delay: idx * 0.05, duration: 0.6, ease: "easeOut" }}
                                className={`w-3/4 sm:w-1/2 rounded-t-lg relative transition-colors ${
                                  day.xp > 0 
                                    ? "bg-gradient-to-t from-emerald-500 to-cyan-400 shadow-[0_0_10px_rgba(16,185,129,0.15)] group-hover:from-emerald-400 group-hover:to-cyan-300" 
                                    : "bg-slate-800/40"
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
                    <div className="h-48 flex flex-col items-center justify-center text-center space-y-2 border border-slate-850 border-dashed rounded-xl bg-slate-950/30">
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
              <div className="bg-[#0B1528] border border-slate-800/80 rounded-2xl p-6 space-y-5 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 h-16 w-16 bg-cyan-500/5 rounded-full blur-xl" />
                
                <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-400" /> Top Coders This Week
                  </h3>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    Weekly
                  </span>
                </div>

                <div className="space-y-2.5">
                  {data && data.leaderboard.length > 0 ? (
                    data.leaderboard.map((row) => {
                      const isCurrentUser = row.username === user?.username;
                      
                      // Custom metallic colors for top 3
                      let rankBadgeClass = "bg-slate-900 border-slate-800 text-slate-400";
                      if (row.rank === 1) rankBadgeClass = "bg-amber-500/15 border-amber-500/30 text-amber-400 shadow shadow-amber-500/10";
                      else if (row.rank === 2) rankBadgeClass = "bg-slate-300/10 border-slate-300/20 text-slate-300";
                      else if (row.rank === 3) rankBadgeClass = "bg-amber-700/15 border-amber-700/25 text-amber-600";

                      return (
                        <div
                          key={row.username}
                          className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                            isCurrentUser
                              ? "bg-emerald-500/5 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.05)]"
                              : "bg-slate-900/60 border-slate-850 hover:border-slate-800"
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
                                isCurrentUser ? "text-emerald-400" : "text-slate-200"
                              }`}
                              title={`@${row.username}`}
                            >
                              @{row.username}
                              {isCurrentUser && (
                                <span className="block text-[8px] text-emerald-500 font-bold uppercase tracking-wider font-mono">You</span>
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
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-md relative">
                <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Award className="h-5 w-5 text-emerald-400" /> Recent Badges
                  </h3>
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
                              className="bg-slate-950 border border-slate-850 rounded-xl p-3 flex items-center gap-3.5 group hover:border-slate-800 transition-colors"
                            >
                              <div className="h-10 w-10 rounded-lg bg-slate-900 flex items-center justify-center text-2xl filter drop-shadow group-hover:scale-110 transition-transform">
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
                          href="/profile/me" 
                          className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 transition-colors group cursor-pointer justify-center"
                        >
                          View all badges 
                          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      </div>
                    </>
                  ) : (
                    // Badges Empty State
                    <div className="text-center py-6 border border-slate-850 border-dashed rounded-xl bg-slate-950/30 space-y-3">
                      <div className="text-2xl filter grayscale opacity-60">🏅</div>
                      <div className="space-y-0.5 max-w-[200px] mx-auto">
                        <div className="text-xs font-bold text-slate-400">No Badges Unlocked</div>
                        <p className="text-[10px] text-slate-500 leading-normal">Complete your first lesson to earn a badge</p>
                      </div>
                      <div className="pt-1.5">
                        <Link 
                          href="/tracks" 
                          className="inline-flex h-7 items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold px-3.5 transition-colors cursor-pointer"
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
