'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Compass, Award, Code2, Play } from 'lucide-react';

const NAV_ITEMS = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Compass,
    activeColor: 'text-cyan-400',
    indicatorColor: 'bg-cyan-400',
  },
  {
    name: 'Tracks',
    href: '/tracks',
    icon: BookOpen,
    activeColor: 'text-orange-400',
    indicatorColor: 'bg-orange-400',
  },
  {
    name: 'Badges',
    href: '/badges',
    icon: Award,
    activeColor: 'text-purple-400',
    indicatorColor: 'bg-purple-400',
  },
  {
    name: 'Visualizer',
    href: '/visualizer',
    icon: Play,
    activeColor: 'text-green-400',
    indicatorColor: 'bg-green-400',
  }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 border-r border-slate-800/50 bg-black bg-noise flex flex-col h-[calc(100vh-4rem)] sticky top-16 shrink-0 z-40">
      <div className="flex-1 py-8 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-6">
          <div className="text-xs font-semibold text-slate-500 px-8 flex items-center gap-2 tracking-wide">
            <Code2 className="h-4 w-4 opacity-70" /> Menu
          </div>
          
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-8 py-3 transition-colors relative ${
                    isActive 
                      ? `bg-white/[0.02] ${item.activeColor}` 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.01]'
                  }`}
                >
                  {isActive && (
                    <div 
                      className={`absolute left-0 top-0 bottom-0 w-1 ${item.indicatorColor}`}
                    />
                  )}
                  
                  <item.icon className={`h-4.5 w-4.5 transition-colors ${isActive ? item.activeColor : ''}`} />
                  <span className={`text-sm font-medium tracking-wide ${isActive ? 'font-bold' : ''}`}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>
          {/* Links removed as per request */}
        </div>
      </div>
    </aside>
  );
}
