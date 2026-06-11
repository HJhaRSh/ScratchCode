'use client';

import React, { useEffect, useState } from 'react';
import { Flame, Trophy, CheckCircle2, XCircle, SkipForward, Lock, Calendar, Star, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function DailyQuestHistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [streak, setStreak] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [todayDayNum, setTodayDayNum] = useState(1);
  const [selectedDay, setSelectedDay] = useState<any>(null);

  useEffect(() => {
    // Calculate today's day number
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    setTodayDayNum(Math.floor(diff / oneDay));

    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/daily-quest/history');
        const data = await res.json();
        if (res.ok) {
          setHistory(data.history || []);
          setStreak(data.streak || { current_streak: 0, longest_streak: 0, total_solved: 0 });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getFavLanguage = () => {
    if (!history.length) return 'None';
    const counts = history.reduce((acc, h) => {
      if (h.language) {
        acc[h.language] = (acc[h.language] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    if (Object.keys(counts).length === 0) return 'None';
    const sorted = Object.entries(counts).sort((a: any, b: any) => b[1] - a[1]);
    return sorted[0][0];
  };

  const getCardIcon = (status: string) => {
    if (status === 'SOLVED') return <CheckCircle2 className="h-6 w-6 text-emerald-500" />;
    if (status === 'FAILED' || status === 'ATTEMPTED') return <XCircle className="h-6 w-6 text-rose-500" />;
    if (status === 'SKIPPED') return <SkipForward className="h-6 w-6 text-slate-500" />;
    return <Lock className="h-6 w-6 text-slate-700" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#d9f95d] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Generate last 30 days
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const dNum = todayDayNum - i;
    const existing = history.find(h => h.day_number === dNum);
    return existing || { day_number: dNum, status: 'SKIPPED', title: `Quest Day ${dNum}` };
  });

  return (
    <div className="min-h-screen bg-black bg-noise text-slate-100 font-sans p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link href="/daily-quest" className="text-slate-400 hover:text-[#d9f95d] text-sm font-bold flex items-center gap-2 mb-2 transition-colors">
              <ChevronLeft className="h-4 w-4" /> Back to Quest
            </Link>
            <h1 className="text-3xl font-black text-slate-100 flex items-center gap-3">
              <Calendar className="h-8 w-8 text-[#d9f95d]" /> Quest History
            </h1>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#111] border border-white/[0.05] p-4 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-orange-500/10 rounded-lg text-orange-500"><Flame className="h-6 w-6 fill-current" /></div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Streak</div>
              <div className="text-xl font-black text-slate-200">{streak?.current_streak || 0} days</div>
            </div>
          </div>
          <div className="bg-[#111] border border-white/[0.05] p-4 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 rounded-lg text-amber-500"><Trophy className="h-6 w-6 fill-current" /></div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Longest Streak</div>
              <div className="text-xl font-black text-slate-200">{streak?.longest_streak || 0} days</div>
            </div>
          </div>
          <div className="bg-[#111] border border-white/[0.05] p-4 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-500"><CheckCircle2 className="h-6 w-6" /></div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Solved</div>
              <div className="text-xl font-black text-slate-200">{streak?.total_solved || 0}</div>
            </div>
          </div>
          <div className="bg-[#111] border border-white/[0.05] p-4 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500"><span className="text-xl">💻</span></div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fav Language</div>
              <div className="text-xl font-black text-slate-200 capitalize">{getFavLanguage()}</div>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-[#111] border border-white/[0.05] rounded-xl p-6">
          <h2 className="text-lg font-bold text-slate-200 mb-6">Last 30 Days</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {last30Days.map((day, idx) => (
              <div 
                key={idx}
                onClick={() => day.status === 'SOLVED' && setSelectedDay(day)}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center gap-2 transition-all ${
                  day.status === 'SOLVED' ? 'bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10 cursor-pointer' :
                  day.status === 'FAILED' || day.status === 'ATTEMPTED' ? 'bg-rose-500/5 border-rose-500/20' :
                  'bg-white/[0.02] border-white/[0.05] opacity-50'
                }`}
              >
                <div className="text-xs font-bold text-slate-500">Day {day.day_number}</div>
                {getCardIcon(day.status)}
                <div className="text-[10px] font-bold text-slate-300 truncate w-full px-2" title={day.title}>
                  {day.title}
                </div>
                {day.xp_earned > 0 && (
                  <div className="text-[10px] text-amber-500 font-bold flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" /> +{day.xp_earned}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Day Solution Modal */}
      {selectedDay && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-white/[0.1] max-w-2xl w-full rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-white/[0.05] pb-4">
              <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                {selectedDay.title} <span className="text-slate-500 text-sm font-normal">(Day {selectedDay.day_number})</span>
              </h2>
              <button onClick={() => setSelectedDay(null)} className="text-slate-500 hover:text-white">✕</button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Your Solution ({selectedDay.language})</h3>
                <div className="bg-black border border-white/[0.05] p-4 rounded-xl text-xs font-mono text-slate-300 overflow-x-auto">
                  {/* Ideally fetch the submitted code from another API, history doesn't return submitted_code to save bandwidth. */}
                  <div className="italic text-slate-500">Code snapshot not included in history summary payload.</div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.05] flex justify-end">
              <button onClick={() => setSelectedDay(null)} className="px-6 py-2 bg-white/[0.05] hover:bg-white/[0.1] rounded-lg text-sm font-bold transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
