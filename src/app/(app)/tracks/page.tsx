'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Link from 'next/link';
import { ArrowRight, Layers, Clock, Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Skeleton from '@/components/ui/Skeleton';

interface Track {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  color_hex: string | null;
  total_units: number;
  total_lessons: number;
  completed_lessons?: number;
  started?: boolean;
  progress_percentage?: number;
}

const TRACK_METADATA: Record<string, {
  difficulty: string;
  difficultyColor: string;
  iconBg: string;
  gradient: string;
  textColor: string;
}> = {
  'python': {
    difficulty: 'Beginner',
    difficultyColor: 'bg-[#d9f95d]/10 text-[#d9f95d] border-[#d9f95d]/20',
    iconBg: 'bg-[#d9f95d]/10 border-[#d9f95d]/20 text-[#d9f95d]',
    gradient: 'from-[#d9f95d] via-lime-400 to-emerald-400',
    textColor: 'text-[#d9f95d]',
  },
  'javascript': {
    difficulty: 'Beginner',
    difficultyColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    iconBg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    gradient: 'from-yellow-500 via-amber-500 to-orange-400',
    textColor: 'text-amber-400',
  },
  'html-css': {
    difficulty: 'Absolute Zero',
    difficultyColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    iconBg: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
    gradient: 'from-orange-500 via-red-500 to-rose-400',
    textColor: 'text-orange-400',
  },
  'c-programming': {
    difficulty: 'Intermediate',
    difficultyColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    iconBg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
    gradient: 'from-indigo-600 via-indigo-500 to-blue-400',
    textColor: 'text-indigo-400',
  },

  'java': {
    difficulty: 'Intermediate',
    difficultyColor: 'bg-red-500/10 text-red-400 border-red-500/20',
    iconBg: 'bg-red-500/10 border-red-500/20 text-red-400',
    gradient: 'from-red-600 via-rose-500 to-pink-400',
    textColor: 'text-red-400',
  },
};

const defaultMeta = {
  difficulty: 'Beginner',
  difficultyColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  iconBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  gradient: 'from-emerald-600 via-teal-500 to-cyan-400',
  textColor: 'text-emerald-400',
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    }
  }
};

export default function TracksPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTracks() {
      try {
        const response = await fetch('/api/tracks');
        if (!response.ok) {
          throw new Error('Failed to load learning tracks.');
        }
        const data = await response.json();
        setTracks(data.tracks || []);
      } catch (err: any) {
        setError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    }
    fetchTracks();
  }, []);

  return (
    <div className="min-h-screen bg-black bg-noise flex flex-col text-slate-100 font-sans">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 pt-20 md:p-8 md:pt-24 pb-24 md:pb-8 overflow-y-auto space-y-8 max-w-7xl mx-auto w-full">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-4 py-1 text-xs font-semibold text-emerald-400">
              <Sparkles className="h-3.5 w-3.5" /> Interactive Curricula
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-[1.1]">
              Choose Your{' '}
              <span className="text-orange-400 font-script font-normal italic pr-2">
                Language Track
              </span>
            </h1>
            <p className="text-slate-400 max-w-2xl leading-relaxed text-sm md:text-base">
              Learn to code with zero local setup. Run real, live code in your browser instantly. Select a path and advance one micro-concept at a time.
            </p>
          </motion.div>

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3"
            >
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Loading Skeletons */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="bg-transparent border-b border-white/[0.05] p-6 space-y-6 flex flex-col justify-between"
                >
                  <div className="space-y-5">
                    <div className="flex justify-between items-start">
                      <Skeleton className="h-12 w-12 rounded-xl animate-pulse" />
                      <Skeleton className="h-6 w-20 rounded-full animate-pulse" />
                    </div>
                    <div className="space-y-3">
                      <Skeleton className="h-7 w-3/4 animate-pulse" />
                      <Skeleton className="h-4 w-full animate-pulse" />
                      <Skeleton className="h-4 w-5/6 animate-pulse" />
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-white/[0.05] space-y-4">
                    <div className="flex justify-between text-xs">
                      <Skeleton className="h-4 w-16 animate-pulse" />
                      <Skeleton className="h-4 w-16 animate-pulse" />
                    </div>
                    <Skeleton className="h-11 w-full rounded-xl animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tracks Grid */}
          {!loading && !error && (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 gap-2"
            >
              {tracks.map((track) => {
                const meta = TRACK_METADATA[track.slug] || defaultMeta;
                const progress = track.progress_percentage || 0;
                const isStarted = track.started || false;

                let btnLabel = 'Start Track';
                if (isStarted) {
                  btnLabel = progress === 100 ? 'Review Track' : 'Continue Track';
                }

                return (
                  <motion.div
                    key={track.id}
                    variants={fadeInUp}
                    className="bg-transparent border-b border-white/[0.05] last:border-0 hover:bg-white/[0.02] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300 group relative overflow-hidden"
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${meta.gradient}`} />

                    <div className="flex items-center gap-6 flex-1 min-w-0 pl-2">
                      <div className={`h-16 w-16 rounded-xl flex items-center justify-center border font-mono text-4xl bg-black bg-noise border-white/[0.05] shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
                        {track.icon}
                      </div>
                      
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl md:text-2xl font-display font-bold tracking-wide text-white group-hover:text-emerald-400 transition-colors duration-300 truncate">
                            {track.title}
                          </h3>
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-display font-bold tracking-wide border ${meta.difficultyColor}`}>
                            {meta.difficulty}
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed truncate max-w-2xl">
                          {track.description}
                        </p>
                        
                        <div className="flex items-center gap-6 text-xs text-slate-400 font-medium pt-1">
                          <span className="flex items-center gap-1.5">
                            <Layers className="h-4 w-4 text-emerald-500" />
                            {track.total_units} Units
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-emerald-500" />
                            {track.total_lessons} Lessons
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-auto flex flex-col items-start md:items-end gap-4 shrink-0 pl-2 md:pl-0">
                      {isStarted && (
                        <div className="w-full md:w-48 space-y-1.5">
                          <div className="flex justify-between items-center text-[10px] uppercase tracking-wider font-bold">
                            <span className="text-slate-500">Progress</span>
                            <span className={meta.textColor}>{progress}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-[#111111] rounded-full overflow-hidden border border-white/[0.05]">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                              className={`h-full bg-gradient-to-r ${meta.gradient} rounded-full`}
                            />
                          </div>
                        </div>
                      )}

                      <Link
                        href={`/tracks/${track.slug}`}
                        className="inline-flex w-full md:w-auto h-10 px-6 items-center justify-center gap-1.5 rounded-xl bg-[#d9f95d] hover:bg-[#b8d945] text-xs font-display font-bold tracking-wide text-slate-950 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                      >
                        {btnLabel} <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* Empty state */}
          {!loading && !error && tracks.length === 0 && (
            <div className="text-center py-12 space-y-3">
              <p className="text-slate-400 text-lg font-medium">No published tracks available at this time.</p>
              <p className="text-xs text-slate-500">Please check back later or enable tracks in the database.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
