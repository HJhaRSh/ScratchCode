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
    difficultyColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    iconBg: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    gradient: 'from-blue-600 via-blue-500 to-cyan-400',
    textColor: 'text-blue-400',
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
  'c-cpp': {
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
    <div className="min-h-screen bg-[#070d19] flex flex-col text-slate-100 font-sans">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-8 max-w-7xl mx-auto w-full">
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
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
              Choose Your{' '}
              <span className="relative bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
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
                  className="bg-[#0B1528] border border-slate-800/80 rounded-2xl p-6 space-y-6 flex flex-col justify-between"
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
                  <div className="mt-6 pt-6 border-t border-slate-800/60 space-y-4">
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
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {tracks.map((track) => {
                const meta = TRACK_METADATA[track.slug] || defaultMeta;
                const progress = track.progress_percentage || 0;
                const isStarted = track.started || false;

                // Determine button label
                let btnLabel = 'Start Track';
                if (isStarted) {
                  btnLabel = progress === 100 ? 'Review Track' : 'Continue Track';
                }

                return (
                  <motion.div
                    key={track.id}
                    variants={fadeInUp}
                    className="bg-[#0B1528] border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 hover:scale-[1.01] hover:shadow-2xl hover:shadow-black/35 transition-all duration-300 group relative overflow-hidden"
                  >
                    {/* Top colored border stripe */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${meta.gradient}`} />

                    <div className="space-y-5">
                      {/* Card Header */}
                      <div className="flex items-start justify-between">
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center border font-mono text-3xl ${meta.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                          {track.icon}
                        </div>
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${meta.difficultyColor}`}>
                          {meta.difficulty}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors duration-300">
                          {track.title}
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed min-h-[60px]">
                          {track.description}
                        </p>
                      </div>
                    </div>

                    {/* Progress details */}
                    <div className="mt-6 pt-6 border-t border-slate-800/60 space-y-5">
                      {isStarted && (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400 font-medium">Your progress</span>
                            <span className={`font-bold ${meta.textColor}`}>{progress}%</span>
                          </div>
                          {/* Progress Bar Container */}
                          <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                              className={`h-full bg-gradient-to-r ${meta.gradient} rounded-full`}
                            />
                          </div>
                        </div>
                      )}

                      {/* Meta information */}
                      <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                        <span className="flex items-center gap-1.5">
                          <Layers className="h-4 w-4 text-emerald-500" />
                          {track.total_units} Units
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4 text-emerald-500" />
                          {track.total_lessons} Lessons
                        </span>
                      </div>

                      {/* CTA Button */}
                      <Link
                        href={`/tracks/${track.slug}`}
                        className={`inline-flex w-full h-11 items-center justify-center gap-1.5 rounded-xl bg-slate-900 border border-slate-800 text-sm font-bold text-slate-200 hover:text-slate-950 hover:bg-emerald-500 hover:border-emerald-500 group-hover:shadow-lg group-hover:shadow-emerald-500/10 transition-all duration-300`}
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
