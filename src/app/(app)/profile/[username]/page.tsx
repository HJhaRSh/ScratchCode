'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Award } from 'lucide-react';

export default function UserProfilePage({ params }: { params: { username: string } }) {
  const mockUser = {
    username: params.username,
    level: 3,
    xp: 2450,
    streak: 8,
    badges: [
      { slug: 'first-code', title: 'First Code', emoji: '💻' },
      { slug: 'on-fire', title: 'On Fire', emoji: '🔥' },
      { slug: 'project-builder', title: 'Project Builder', emoji: '🛠️' },
    ],
  };

  return (
    <div className="min-h-screen bg-black bg-noise flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto space-y-8 max-w-4xl">
          {/* Profile Header */}
          <div className="bg-[#111111] border border-white/[0.05] rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="h-20 w-20 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500 flex items-center justify-center text-3xl font-display tracking-tight font-bold text-slate-950 uppercase shadow-lg shadow-emerald-500/10">
              {mockUser.username.substring(0, 2)}
            </div>
            <div className="space-y-2 text-center md:text-left flex-1">
              <h2 className="text-2xl font-bold text-white">@{mockUser.username}</h2>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <span className="inline-flex h-7 items-center gap-1 rounded bg-slate-800 border border-slate-700 px-2.5 text-xs text-slate-300 font-semibold">
                  ⭐ {mockUser.xp} XP
                </span>
                <span className="inline-flex h-7 items-center gap-1 rounded bg-orange-500/10 border border-orange-500/20 px-2.5 text-xs text-orange-400 font-semibold">
                  🔥 {mockUser.streak} Day Streak
                </span>
                <span className="inline-flex h-7 items-center gap-1 rounded bg-amber-500/10 border border-amber-500/20 px-2.5 text-xs text-amber-400 font-semibold">
                  🎓 Level {mockUser.level} Developer
                </span>
              </div>
            </div>
          </div>

          {/* Badges Panel */}
          <div className="space-y-4">
            <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-400" /> Earned Badges ({mockUser.badges.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {mockUser.badges.map((b) => (
                <div key={b.slug} className="bg-[#111111] border border-white/[0.05] rounded-xl p-5 flex flex-col items-center justify-center text-center space-y-2 group hover:border-slate-700 transition-colors">
                  <span className="text-3xl filter drop-shadow">{b.emoji}</span>
                  <div className="text-sm font-semibold text-slate-200">{b.title}</div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
