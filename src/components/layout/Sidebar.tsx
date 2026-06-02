import React from 'react';
import Link from 'next/link';
import { BookOpen, Compass, Award, Settings } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-64 border-r border-slate-800 bg-slate-950 flex flex-col h-[calc(100vh-4rem)] sticky top-16 shrink-0">
      <div className="flex-1 py-6 px-4 space-y-6">
        <div className="space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md bg-slate-900 text-white hover:bg-slate-900 transition-colors"
          >
            <Compass className="h-4 w-4 text-cyan-400" />
            Dashboard
          </Link>
          <Link
            href="/tracks"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-slate-400 hover:text-white hover:bg-slate-900/50 transition-colors"
          >
            <BookOpen className="h-4 w-4 text-emerald-400" />
            Tracks
          </Link>
          <Link
            href="/profile/me"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-slate-400 hover:text-white hover:bg-slate-900/50 transition-colors"
          >
            <Award className="h-4 w-4 text-amber-400" />
            Badges
          </Link>
        </div>
      </div>
      <div className="p-4 border-t border-slate-900">
        <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors rounded-md hover:bg-slate-900/50 cursor-pointer">
          <Settings className="h-4 w-4" />
          Settings
        </div>
      </div>
    </aside>
  );
}
