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
  Trophy, 
  Sparkles,
  TrendingUp,
  Compass,
  Code2,
  CheckCircle2,
  Clock,
  BookOpen,
  BarChart2,
  ListChecks,
  ArrowRight,
  Target,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
    in_progress?: boolean;
  };
}

interface ActivityLogEntry {
  lesson_id: string;
  lesson_title: string;
  lesson_type: 'CONCEPT' | 'EXERCISE' | 'PROJECT';
  language: string;
  duration_minutes: number;
  xp_reward: number;
  xp_earned: number;
  attempts: number;
  completed_at: string | null;
  track_title: string;
  track_slug: string;
  track_icon: string;
  track_color: string | null;
  unit_title: string;
}

interface DashboardStats {
  total_completed: number;
  total_in_progress: number;
  total_estimated_minutes: number;
  total_attempts: number;
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
  activity_log: ActivityLogEntry[];
  stats: DashboardStats;
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
  const [activityTab, setActivityTab] = useState<'chart' | 'log'>('chart');
  const [logFilter, setLogFilter] = useState<'ALL' | 'CONCEPT' | 'EXERCISE' | 'PROJECT'>('ALL');

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
        <main className="flex-1 p-4 pt-20 md:p-8 md:pt-24 pb-24 md:pb-8 overflow-y-auto space-y-6 md:space-y-8 max-w-7xl mx-auto w-full">
          {/* Header HUD greeting */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 border-b border-white/[0.05] pb-6 md:pb-10 relative overflow-hidden sm:overflow-visible">
            <div className="absolute -top-20 left-0 w-full sm:w-[500px] h-[250px] bg-[#d9f95d]/5 rounded-[100%] blur-[120px] pointer-events-none" />
            
            <div className="space-y-3 relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[9px] md:px-4 md:py-1.5 md:text-[10px] font-mono font-bold tracking-[0.2em] text-[#d9f95d] uppercase">
                [01] Command Center
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-7xl font-black text-white tracking-tighter leading-[1.05]">
                Welcome back,{' '}
                <span className="text-[#d9f95d] font-script font-normal italic pr-2">{user?.username || 'Coder'}</span>
              </h1>
              <p className="text-slate-400 text-sm md:text-lg max-w-md">Ready to execute some code today? Keep your daily streak blazing.</p>
            </div>
            
            <div className="hidden md:flex flex-wrap gap-3 relative z-10 md:pb-2">
              <span className="inline-flex h-10 items-center gap-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 px-5 text-xs font-mono font-bold tracking-widest uppercase text-slate-300 shadow-xl">
                <Compass className="h-4 w-4 text-cyan-400" /> Dashboard
              </span>
              <span className="inline-flex h-10 items-center gap-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 px-5 text-xs font-mono font-bold tracking-widest uppercase text-emerald-400 shadow-xl animate-pulse">
                 Online
              </span>
            </div>
          </div>

          {/* TOP ROW — Unified Stats Grid (3-col on all sizes) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.05] border border-white/[0.05] rounded-2xl mb-6 md:mb-12 overflow-hidden">
            {/* Streak Stat */}
            <div className="py-5 px-3 md:py-8 md:px-8 relative group hover:bg-white/[0.02] transition-colors flex flex-col justify-center">
              <div className="flex items-center justify-between mb-2 md:mb-4">
                <div className="text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-slate-500 group-hover:text-orange-400 transition-colors leading-tight">Streak</div>
                <Flame className="h-4 w-4 md:h-5 md:w-5 text-orange-500/50 group-hover:text-orange-400 transition-colors shrink-0" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <div className="text-3xl md:text-5xl font-black text-white tracking-tighter">{user?.streak_count || 0}</div>
                <div className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-widest">Days</div>
              </div>
              <div className="mt-1.5 md:mt-4 text-[10px] md:text-xs text-slate-400 font-medium hidden sm:block">
                {user?.streak_count && user.streak_count > 0 ? "You're on fire!" : "Complete a lesson."}
              </div>
            </div>

            {/* XP Stat */}
            <div className="py-5 px-3 md:py-8 md:px-8 relative group hover:bg-white/[0.02] transition-colors flex flex-col justify-center">
              <div className="flex items-center justify-between mb-2 md:mb-4">
                <div className="text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-slate-500 group-hover:text-emerald-400 transition-colors leading-tight">XP</div>
                <Star className="h-4 w-4 md:h-5 md:w-5 text-emerald-500/50 group-hover:text-emerald-400 transition-colors shrink-0" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <div className="text-3xl md:text-5xl font-black text-white tracking-tighter">{user?.xp || 0}</div>
                <div className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-widest hidden sm:block">XP</div>
              </div>
              <div className="mt-1.5 md:mt-4 text-[10px] md:text-xs text-slate-400 font-medium hidden sm:block">
                All tracks.
              </div>
            </div>

            {/* Level Stat */}
            <div className="py-5 px-3 md:py-8 md:px-8 relative group hover:bg-white/[0.02] transition-colors flex flex-col justify-center">
              <div className="flex items-center justify-between mb-2 md:mb-4">
                <div className="text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-slate-500 group-hover:text-purple-400 transition-colors leading-tight">Level</div>
                <Award className="h-4 w-4 md:h-5 md:w-5 text-purple-500/50 group-hover:text-purple-400 transition-colors shrink-0" />
              </div>
              <div className="flex items-baseline gap-2 mb-2 md:mb-4">
                <div className="text-3xl md:text-5xl font-black text-white tracking-tighter">{user?.level || 1}</div>
                <div className="hidden sm:block text-[9px] md:text-[10px] font-bold text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20 uppercase tracking-widest leading-tight">{levelName}</div>
              </div>
              <div className="space-y-1 w-full">
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#d9f95d] rounded-full transition-all duration-500" style={{ width: `${levelProgress.percent}%` }} />
                </div>
                <div className="hidden sm:flex justify-between text-[10px] font-mono text-slate-500">
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

              {/* CODE VISUALIZER BANNER */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative overflow-hidden rounded-2xl border border-violet-500/25 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(99,102,241,0.05) 100%)' }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_100%_50%,rgba(139,92,246,0.1),transparent)] pointer-events-none" />
                <div className="h-12 w-12 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center shrink-0 text-2xl">
                  🔍
                </div>
                <div className="flex-1 min-w-0 relative">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-bold text-sm">Try the Code Visualizer</h3>
                    <span className="text-[9px] font-bold uppercase tracking-widest bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full border border-violet-500/25">New</span>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed max-w-lg">Step through your Python code line-by-line. Watch variables update, track object memory, and understand exactly how your program runs.</p>
                </div>
                <Link
                  href="/visualizer"
                  className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/30 text-violet-200 font-bold text-xs transition-all"
                >
                  Open in Editor <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </motion.div>
              
              {/* CONTINUE LEARNING SECTION */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-cyan-400 fill-cyan-400/10" />
                    <h2 className="text-xl font-bold text-white tracking-tight">Continue Learning</h2>
                  </div>
                  {hasStartedTracks && (
                    <Link href="/tracks" className="text-xs font-bold text-[#d9f95d] hover:text-white transition-colors flex items-center gap-1">
                      Explore Tracks <ArrowRight className="h-3 w-3" />
                    </Link>
                  )}
                </div>

                {hasStartedTracks ? (
                  <div className="grid grid-cols-1 gap-4">
                    {data.tracks_progress.map((track) => (
                      <motion.div
                        key={track.track_slug}
                        whileHover={{ y: -1 }}
                        className="bg-transparent border-b border-white/[0.05] last:border-0 hover:bg-white/[0.01] p-3 md:p-4 flex flex-col gap-4 transition-all relative overflow-hidden"
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
                        <div className="flex flex-row items-center justify-between gap-3">
                          {track.next_lesson ? (
                            <>
                              <div className="space-y-0.5 min-w-0 flex-1">
                                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black font-mono">
                                  {track.next_lesson.in_progress ? '⚡ In Progress' : 'Next Objective'}
                                </div>
                                <div className="text-xs font-bold text-slate-300 truncate" title={track.next_lesson.title}>
                                  {track.next_lesson.title}
                                </div>
                                <div className="text-[10px] text-slate-400 italic truncate">
                                  {track.next_lesson.unit_title}
                                </div>
                              </div>
                              <Link
                                href={`/learn/${track.next_lesson.id}`}
                                className={`shrink-0 inline-flex h-9 items-center justify-center gap-1 rounded-xl font-extrabold text-xs tracking-wide px-4 active:scale-[0.97] transition-all shadow-md cursor-pointer ${
                                  track.next_lesson.in_progress
                                    ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/20'
                                    : 'bg-[#d9f95d] hover:bg-[#d9f95d] text-slate-950 shadow-[#d9f95d]/10'
                                }`}
                              >
                                {track.next_lesson.in_progress ? 'Resume' : 'Start'} <ChevronRight className="h-3.5 w-3.5 stroke-[3px]" />
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

              {/* ACTIVITY TRACKER — Tabbed: XP Chart + Full Log */}
              <div className="space-y-0 pt-8 border-t border-white/[0.05]">
                {/* Section header + tabs */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5 mb-6">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-mono font-bold tracking-[0.2em] text-slate-300 uppercase">
                    [03] Progress Tracker
                  </div>
                  {/* Tabs */}
                  <div className="flex items-center bg-white/[0.03] border border-white/[0.06] rounded-lg p-0.5 gap-0.5">
                    <button
                      onClick={() => setActivityTab('chart')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold transition-all ${
                        activityTab === 'chart'
                          ? 'bg-white/10 text-white'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <BarChart2 className="h-3.5 w-3.5" /> XP Chart
                    </button>
                    <button
                      onClick={() => setActivityTab('log')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold transition-all ${
                        activityTab === 'log'
                          ? 'bg-white/10 text-white'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <ListChecks className="h-3.5 w-3.5" /> Activity Log
                      {data && data.stats.total_completed > 0 && (
                        <span className="bg-[#d9f95d]/20 text-[#d9f95d] font-mono text-[9px] px-1.5 py-0.5 rounded">
                          {data.stats.total_completed}
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {activityTab === 'chart' ? (
                    <motion.div
                      key="chart"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="space-y-6"
                    >
                      {/* Overall Stats Row */}
                      {data && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-3 text-center">
                            <div className="text-2xl font-black text-[#d9f95d]">{data.stats.total_completed}</div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Completed</div>
                          </div>
                          <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-3 text-center">
                            <div className="text-2xl font-black text-emerald-400">
                              {data.stats.total_estimated_minutes >= 60
                                ? `${Math.floor(data.stats.total_estimated_minutes / 60)}h ${data.stats.total_estimated_minutes % 60}m`
                                : `${data.stats.total_estimated_minutes}m`}
                            </div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Time Spent</div>
                          </div>
                          <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-3 text-center">
                            <div className="text-2xl font-black text-purple-400">{data.stats.total_attempts}</div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Attempts</div>
                          </div>
                          <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-3 text-center">
                            <div className="text-2xl font-black text-amber-400">
                              {data.stats.total_attempts > 0
                                ? (data.stats.total_completed / data.stats.total_attempts * 100).toFixed(0)
                                : 0}%
                            </div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Success Rate</div>
                          </div>
                        </div>
                      )}

                      {/* 7-Day XP Bar Chart */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                          <TrendingUp className="h-3.5 w-3.5 text-cyan-400" />
                          XP Earned — Last 7 Days
                        </div>
                        {data && data.weekly_xp.some((day) => day.xp > 0) ? (
                          <div className="h-44 flex items-end gap-3 sm:gap-5 px-2 pt-4 relative">
                            <div className="absolute inset-x-0 bottom-0 border-b border-white/[0.05]" />
                            <div className="absolute inset-x-0 bottom-1/2 border-b border-white/[0.04] border-dashed" />
                            <div className="absolute inset-x-0 top-0 border-b border-white/[0.03]" />
                            {data.weekly_xp.map((day, idx) => {
                              const heightPercent = maxWeeklyXP > 0 ? Math.round((day.xp / maxWeeklyXP) * 100) : 0;
                              const isToday = idx === 6;
                              return (
                                <div key={idx} className="flex-1 flex flex-col items-center h-full group relative">
                                  <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-all duration-150 pointer-events-none z-10">
                                    <div className="bg-[#111] border border-white/10 text-white font-mono text-[9px] font-bold px-2 py-1 rounded shadow whitespace-nowrap">
                                      ⭐ {day.xp} XP
                                    </div>
                                  </div>
                                  <div className="w-full flex-1 flex items-end justify-center">
                                    <motion.div
                                      initial={{ height: 0 }}
                                      animate={{ height: `${day.xp > 0 ? Math.max(8, heightPercent) : 0}%` }}
                                      transition={{ delay: idx * 0.05, duration: 0.5, ease: 'easeOut' }}
                                      className={`w-3/4 sm:w-1/2 rounded-t-md transition-colors ${
                                        isToday
                                          ? 'bg-gradient-to-t from-[#d9f95d] to-emerald-400 shadow-[0_0_12px_rgba(217,249,93,0.2)]'
                                          : day.xp > 0
                                          ? 'bg-gradient-to-t from-purple-500 to-pink-400 shadow-[0_0_8px_rgba(168,85,247,0.15)] group-hover:from-purple-400 group-hover:to-pink-300'
                                          : 'bg-white/[0.04]'
                                      }`}
                                    />
                                  </div>
                                  <div className={`text-[10px] font-mono font-semibold mt-2 uppercase transition-colors ${
                                    isToday ? 'text-[#d9f95d]' : 'text-slate-500 group-hover:text-slate-300'
                                  }`}>
                                    {isToday ? 'Today' : day.day}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="h-44 flex flex-col items-center justify-center text-center space-y-2 border border-white/[0.05] border-dashed rounded-xl bg-white/[0.01]">
                            <div className="text-2xl opacity-40">📊</div>
                            <div className="text-xs font-bold text-slate-400">No XP earned this week</div>
                            <p className="text-[10px] text-slate-500 max-w-[200px]">Complete lessons to populate your chart</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="log"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="space-y-4"
                    >
                      {/* Filter chips */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {(['ALL', 'CONCEPT', 'EXERCISE', 'PROJECT'] as const).map((f) => (
                          <button
                            key={f}
                            onClick={() => setLogFilter(f)}
                            className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border transition-all ${
                              logFilter === f
                                ? 'bg-white/10 border-white/20 text-white'
                                : 'border-white/[0.06] text-slate-500 hover:text-slate-300 hover:border-white/10'
                            }`}
                          >
                            {f === 'ALL' ? 'All Types' : f}
                          </button>
                        ))}
                      </div>

                      {/* Activity log entries */}
                      {data && data.activity_log.length > 0 ? (
                        <div className="space-y-0 max-h-[480px] overflow-y-auto pr-1 custom-scrollbar">
                          {data.activity_log
                            .filter((e) => logFilter === 'ALL' || e.lesson_type === logFilter)
                            .map((entry, idx) => {
                              const completedDate = entry.completed_at ? new Date(entry.completed_at) : null;
                              const dateStr = completedDate
                                ? completedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                : 'Unknown';
                              const timeStr = completedDate
                                ? completedDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                                : '';
                              const typeColors: Record<string, string> = {
                                CONCEPT: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
                                EXERCISE: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
                                PROJECT: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
                              };
                              const typeIcons: Record<string, string> = {
                                CONCEPT: '📖',
                                EXERCISE: '⚡',
                                PROJECT: '🚀',
                              };

                              return (
                                <motion.div
                                  key={`${entry.lesson_id}-${idx}`}
                                  initial={{ opacity: 0, x: -8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.03 }}
                                  className="flex items-start gap-3 py-3.5 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.01] px-1 -mx-1 rounded-lg transition-colors group"
                                >
                                  {/* Track icon */}
                                  <div
                                    className="shrink-0 h-8 w-8 rounded-lg flex items-center justify-center text-base border border-white/[0.06]"
                                    style={{ backgroundColor: `${entry.track_color}15` || '#ffffff08' }}
                                  >
                                    {entry.track_icon || '📚'}
                                  </div>

                                  {/* Main content */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-0.5">
                                      <Link
                                        href={`/learn/${entry.lesson_id}`}
                                        className="text-xs font-bold text-slate-200 hover:text-white transition-colors leading-snug line-clamp-1"
                                      >
                                        {entry.lesson_title}
                                      </Link>
                                      {/* Date on right — visible all sizes */}
                                      <div className="shrink-0 text-right ml-2">
                                        <div className="text-[9px] font-bold text-slate-500 whitespace-nowrap">{dateStr}</div>
                                        <div className="text-[8px] text-slate-700 mt-0.5 hidden sm:block">{timeStr}</div>
                                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 ml-auto mt-0.5" />
                                      </div>
                                    </div>

                                    <div className="text-[9px] text-slate-600 mb-1.5 truncate">
                                      {entry.track_title} · {entry.unit_title}
                                    </div>

                                    {/* Stats row — wraps on mobile */}
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="flex items-center gap-0.5 text-[9px] font-mono font-bold text-amber-400">
                                        ⭐ +{entry.xp_earned}
                                      </span>
                                      <span className={`text-[8px] font-bold uppercase tracking-wider px-1 py-0.5 rounded border ${typeColors[entry.lesson_type]}`}>
                                        {entry.lesson_type}
                                      </span>
                                      <span className="flex items-center gap-0.5 text-[9px] text-slate-500">
                                        <Clock className="h-2.5 w-2.5" /> {entry.duration_minutes}m
                                      </span>
                                      <span className="flex items-center gap-0.5 text-[9px] text-slate-500">
                                        <Target className="h-2.5 w-2.5" /> {entry.attempts}×
                                      </span>
                                      <span className="flex items-center gap-0.5 text-[9px] text-slate-500 hidden sm:flex">
                                        <Code2 className="h-2.5 w-2.5" /> {entry.language}
                                      </span>
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })}
                        </div>
                      ) : (
                        <div className="h-44 flex flex-col items-center justify-center text-center space-y-2 border border-white/[0.05] border-dashed rounded-xl">
                          <BookOpen className="h-8 w-8 text-slate-600" />
                          <div className="text-xs font-bold text-slate-400">No completed lessons yet</div>
                          <p className="text-[10px] text-slate-500 max-w-[200px]">Complete lessons to see your full activity history</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
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
