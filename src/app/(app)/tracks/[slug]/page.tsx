'use client';

import React, { useEffect, useState, use } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Link from 'next/link';
import { 
  ChevronRight, 
  ChevronDown, 
  Book, 
  Code, 
  Hammer, 
  Lock, 
  CheckCircle2, 
  Play, 
  ArrowLeft, 
  Clock, 
  Trophy, 
  BookOpen, 
  Sparkles,
  AlertCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Lesson {
  id: string;
  lesson_number: number;
  title: string;
  type: 'CONCEPT' | 'EXERCISE' | 'PROJECT';
  duration_minutes: number;
  xp_reward: number;
  language: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'NOT_STARTED';
  isAvailable?: boolean;
  isLocked?: boolean;
}

interface Unit {
  id: string;
  unit_number: number;
  title: string;
  description: string;
  xp_reward: number;
  lessons: Lesson[];
}

interface Track {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  color_hex: string | null;
  total_units: number;
  total_lessons: number;
  estimated_hours: number;
  completed_lessons: number;
  units: Unit[];
}

const TRACK_THEMES: Record<string, {
  accent: string;
  gradient: string;
  shadow: string;
  bannerBg: string;
}> = {
  'python': {
    accent: 'text-blue-400 border-blue-500/20 bg-blue-500/10',
    gradient: 'from-blue-600 to-cyan-500',
    shadow: 'shadow-blue-500/10',
    bannerBg: 'bg-gradient-to-r from-blue-950/40 to-cyan-950/20',
  },
  'javascript': {
    accent: 'text-amber-400 border-amber-500/20 bg-amber-500/10',
    gradient: 'from-yellow-500 to-amber-500',
    shadow: 'shadow-amber-500/10',
    bannerBg: 'bg-gradient-to-r from-yellow-950/20 to-amber-950/10',
  },
  'html-css': {
    accent: 'text-orange-400 border-orange-500/20 bg-orange-500/10',
    gradient: 'from-orange-500 to-red-500',
    shadow: 'shadow-orange-500/10',
    bannerBg: 'bg-gradient-to-r from-orange-950/30 to-red-950/10',
  },
  'c-cpp': {
    accent: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/10',
    gradient: 'from-indigo-600 to-blue-500',
    shadow: 'shadow-indigo-500/10',
    bannerBg: 'bg-gradient-to-r from-indigo-950/30 to-blue-950/10',
  },
  'java': {
    accent: 'text-red-400 border-red-500/20 bg-red-500/10',
    gradient: 'from-red-600 to-rose-500',
    shadow: 'shadow-red-500/10',
    bannerBg: 'bg-gradient-to-r from-red-950/30 to-rose-950/10',
  },
};

const defaultTheme = {
  accent: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10',
  gradient: 'from-emerald-600 to-teal-500',
  shadow: 'shadow-emerald-500/10',
  bannerBg: 'bg-gradient-to-r from-emerald-950/30 to-teal-950/10',
};

export default function TrackDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchTrackDetails() {
      try {
        const response = await fetch(`/api/tracks/${slug}`);
        if (!response.ok) {
          throw new Error('Failed to load track curriculum details.');
        }
        const data = await response.json();
        const fetchedTrack: Track = data.track;

        if (fetchedTrack) {
          // Sequential unlocking computation:
          // A lesson is available if it's the very first lesson, OR the previous lesson is COMPLETED.
          let prevLessonCompleted = true;
          const unitsWithAvailability = fetchedTrack.units.map((unit) => {
            const lessonsWithAvailability = unit.lessons.map((lesson) => {
              const status = lesson.status;
              const isCompleted = status === 'COMPLETED';
              const isAvailable = prevLessonCompleted;

              prevLessonCompleted = isCompleted;

              return {
                ...lesson,
                isAvailable,
                isLocked: !isAvailable && !isCompleted,
              };
            });

            return {
              ...unit,
              lessons: lessonsWithAvailability,
            };
          });

          const finalTrack = {
            ...fetchedTrack,
            units: unitsWithAvailability,
          };

          setTrack(finalTrack);

          // By default, expand the first unit
          if (finalTrack.units.length > 0) {
            setExpandedUnits({ [finalTrack.units[0].id]: true });
          }
        }
      } catch (err: any) {
        setError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    }
    fetchTrackDetails();
  }, [slug]);

  const toggleUnit = (unitId: string) => {
    setExpandedUnits(prev => ({
      ...prev,
      [unitId]: !prev[unitId]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070d19] flex flex-col text-slate-100 font-sans">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 p-6 md:p-8 space-y-6 max-w-4xl mx-auto w-full animate-pulse">
            <div className="h-6 w-24 bg-slate-800 rounded" />
            <div className="h-28 bg-[#0B1528] border border-slate-800 rounded-2xl" />
            <div className="h-40 bg-[#0B1528] border border-slate-800 rounded-2xl" />
            <div className="h-20 bg-[#0B1528] border border-slate-800 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !track) {
    return (
      <div className="min-h-screen bg-[#070d19] flex flex-col text-slate-100 font-sans">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 p-6 md:p-8 flex flex-col items-center justify-center space-y-4 max-w-4xl mx-auto w-full">
            <AlertCircle className="h-16 w-16 text-red-500/80" />
            <h2 className="text-2xl font-bold text-white">Curriculum Not Found</h2>
            <p className="text-slate-400 text-sm text-center max-w-md">
              {error || 'The track you requested does not exist or has not been published yet.'}
            </p>
            <Link
              href="/tracks"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white font-semibold px-5 py-2.5 text-sm transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Tracks
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const theme = TRACK_THEMES[track.slug] || defaultTheme;

  // Flatten all lessons across all units to find the "Continue Learning" lesson
  const allLessons = track.units.reduce<Lesson[]>((acc, unit) => {
    return [...acc, ...unit.lessons];
  }, []);

  const nextIncompleteLesson = allLessons.find(l => l.status !== 'COMPLETED' && l.isAvailable) || allLessons[0];
  const allCompleted = allLessons.every(l => l.status === 'COMPLETED');
  const progressPercent = allLessons.length > 0
    ? Math.round((track.completed_lessons / allLessons.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#070d19] flex flex-col text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-8 max-w-5xl mx-auto w-full">
          {/* Breadcrumb / Back button */}
          <Link
            href="/tracks"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Tracks
          </Link>

          {/* Track Header Details */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`border border-slate-800/80 rounded-2xl p-6 md:p-8 ${theme.bannerBg} relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl ${theme.shadow}`}
          >
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-3.5">
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center border font-mono text-4xl bg-slate-950 border-slate-800`}>
                  {track.icon}
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{track.title}</h1>
                  <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-400 mt-1">
                    <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5 text-emerald-400" /> {track.units.length} units</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-cyan-400" /> {track.estimated_hours} hours est.</span>
                    <span className="flex items-center gap-1"><Trophy className="h-3.5 w-3.5 text-amber-400" /> {track.total_lessons} lessons</span>
                  </div>
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed max-w-xl">
                {track.description}
              </p>

              {/* Progress bar inside header */}
              <div className="space-y-2 max-w-md pt-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">Curriculum Completion</span>
                  <span className="text-white font-bold">{progressPercent}% ({track.completed_lessons}/{allLessons.length} lessons)</span>
                </div>
                <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`h-full bg-gradient-to-r ${theme.gradient}`}
                  />
                </div>
              </div>
            </div>

            {/* Continue Learning CTA Banner */}
            {nextIncompleteLesson && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-shrink-0 w-full md:w-auto"
              >
                <Link
                  href={allCompleted ? `/learn/${allLessons[0]?.id}` : `/learn/${nextIncompleteLesson.id}`}
                  className={`inline-flex w-full md:w-auto h-12 px-6 items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${theme.gradient} text-slate-950 font-extrabold text-sm hover:brightness-110 shadow-lg ${theme.shadow} transition-all`}
                >
                  <Play className="h-4.5 w-4.5 fill-current" />
                  <span>{allCompleted ? 'Review Curriculum' : 'Continue Learning'}</span>
                </Link>
              </motion.div>
            )}
          </motion.div>

          {/* Units Accordion */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-200">Curriculum Units</h2>

            <div className="space-y-4">
              {track.units.map((unit) => {
                const isExpanded = expandedUnits[unit.id] || false;
                return (
                  <div
                    key={unit.id}
                    className="bg-[#0B1528] border border-slate-800/80 rounded-2xl overflow-hidden hover:border-slate-800 transition-colors duration-300"
                  >
                    {/* Unit Accordion Header */}
                    <button
                      onClick={() => toggleUnit(unit.id)}
                      className="w-full p-5 bg-slate-950/60 border-b border-slate-900/60 hover:bg-slate-900/40 flex justify-between items-center text-left transition-colors duration-200 gap-4"
                    >
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                          Unit {unit.unit_number}
                        </span>
                        <h3 className="text-lg font-bold text-white">
                          {unit.title}
                        </h3>
                        <p className="text-slate-400 text-xs leading-relaxed max-w-xl">
                          {unit.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="text-right hidden sm:block">
                          <span className="block text-xs text-slate-500 font-medium">
                            {unit.lessons.length} lessons
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full mt-1">
                            ⭐ {unit.xp_reward} XP
                          </span>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                          {isExpanded ? <ChevronDown className="h-4.5 w-4.5" /> : <ChevronRight className="h-4.5 w-4.5" />}
                        </div>
                      </div>
                    </button>

                    {/* Accordion Expandable Section */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden bg-[#0B1528]/40 divide-y divide-slate-850/60"
                        >
                          {unit.lessons.map((lesson) => {
                            const isCompleted = lesson.status === 'COMPLETED';
                            const isAvailable = lesson.isAvailable;
                            const isLocked = lesson.isLocked;

                            // Select type icon
                            let typeIcon = <Book className="h-4 w-4" />;
                            if (lesson.type === 'EXERCISE') {
                              typeIcon = <Code className="h-4 w-4" />;
                            } else if (lesson.type === 'PROJECT') {
                              typeIcon = <Hammer className="h-4 w-4" />;
                            }

                            // Define layout color states
                            let statusClass = 'opacity-50 text-slate-500';
                            let iconClass = 'text-slate-500 bg-slate-900 border-slate-800';
                            let statusIndicator = <Lock className="h-3.5 w-3.5" />;

                            if (isCompleted) {
                              statusClass = 'hover:bg-slate-900/20';
                              iconClass = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
                              statusIndicator = <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />;
                            } else if (isAvailable) {
                              statusClass = 'hover:bg-slate-900/30';
                              iconClass = 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
                              statusIndicator = (
                                <span className="inline-flex h-7 px-3 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-xs font-bold text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 transition-colors duration-200">
                                  Start <ChevronRight className="h-3 ml-0.5" />
                                </span>
                              );
                            }

                            const content = (
                              <div className="p-4 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                  {/* Type icon */}
                                  <div className={`h-9 w-9 rounded-xl border flex items-center justify-center ${iconClass}`}>
                                    {typeIcon}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h4 className="text-sm font-bold text-slate-200 group-hover:text-emerald-400 transition-colors duration-200">
                                        {lesson.title}
                                      </h4>
                                      <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                                        {lesson.type}
                                      </span>
                                    </div>
                                    <span className="text-xs text-slate-500 font-medium">
                                      {lesson.duration_minutes} mins • ⭐ {lesson.xp_reward} XP
                                    </span>
                                  </div>
                                </div>
                                <div className="flex-shrink-0">
                                  {statusIndicator}
                                </div>
                              </div>
                            );

                            return isLocked ? (
                              <div key={lesson.id} className={statusClass}>
                                {content}
                              </div>
                            ) : (
                              <Link
                                key={lesson.id}
                                href={`/learn/${lesson.id}`}
                                className={`block group transition-colors duration-200 ${statusClass}`}
                              >
                                {content}
                              </Link>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
