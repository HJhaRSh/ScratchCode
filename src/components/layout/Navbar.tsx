'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight, User, Settings, LogOut, ChevronDown, Compass, BookOpen, Award, Play } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/hooks/useUser';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();
  const { user, loading, signOut } = useUser();

  // Detect if we're inside the app (logged-in pages)
  const isAppPage = pathname.startsWith('/dashboard') ||
    pathname.startsWith('/tracks') ||
    pathname.startsWith('/badges') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/account') ||
    pathname.startsWith('/learn');

  const landingNavLinks = [
    { name: 'Tracks', href: '/#tracks' },
    { name: 'How it works', href: '/#how-it-works' },
    { name: 'Visualizer', href: '/visualizer' },
    { name: 'Features', href: '/#features' },
  ];

  const navLinks = landingNavLinks;
  const showBottomNav = isAppPage && !pathname.startsWith('/learn');

  return (
    <>
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-lg py-4 transition-all duration-300">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <span className="font-logo text-2xl font-bold text-white tracking-tighter hover:text-[#d9f95d] transition-colors">&lt;scratch.code&gt;</span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = link.href.startsWith('/')
              ? pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
              : pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-display tracking-wide font-medium transition-colors hover:text-white ${
                  isActive ? 'text-white' : 'text-slate-400'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Auth CTA / Profile Dropdown & Mobile Toggle */}
        <div className="flex items-center gap-4">
          {!loading && user ? (
            <div className="relative hidden md:block">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 h-10 px-3 rounded-lg hover:bg-white/[0.05] transition-colors"
              >
                <div className="h-7 w-7 rounded-full border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                  <User className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-300">
                  {user.user_metadata?.username || user.email?.split('@')[0]}
                </span>
                <ChevronDown className={`h-3 w-3 text-slate-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-56 rounded-xl bg-[#0a0a0a] border border-white/[0.08] shadow-2xl overflow-hidden flex flex-col z-50"
                  >
                    <div className="p-4 border-b border-white/[0.05]">
                      <div className="text-[10px] font-medium tracking-wider text-slate-500 uppercase">Signed in as</div>
                      <div className="text-sm font-medium text-white truncate mt-0.5">{user.email}</div>
                    </div>
                    <div className="p-2 flex flex-col gap-1">
                      <Link href="/dashboard" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.03] rounded-lg transition-colors">
                        <User className="h-4 w-4" /> Dashboard
                      </Link>
                      <Link href="/account" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.03] rounded-lg transition-colors">
                        <Settings className="h-4 w-4" /> Account
                      </Link>
                    </div>
                    <div className="p-2 border-t border-white/10">
                      <button 
                        onClick={() => { signOut(); setIsProfileOpen(false); }}
                        className="flex w-full items-center gap-3 px-3 py-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <LogOut className="h-4 w-4" /> Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden md:inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#d9f95d] px-6 text-xs font-mono font-bold uppercase tracking-[0.1em] text-slate-950 hover:bg-[#b8d945] transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(217,249,93,0.2)]"
            >
              Start Coding <ArrowRight className="h-4 w-4" />
            </Link>
          )}

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden h-10 w-10 rounded-lg flex items-center justify-center bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#0b0c10] border-b border-white/[0.05] p-4 shadow-xl md:hidden">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors font-display tracking-wide font-medium"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 mt-2 border-t border-white/[0.05]">
              {!loading && user ? (
                <button
                  onClick={() => { signOut(); setIsMobileMenuOpen(false); }}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 text-xs font-mono font-bold uppercase tracking-[0.2em] text-red-400"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#d9f95d] px-4 text-xs font-mono font-bold uppercase tracking-[0.2em] text-slate-950"
                >
                  Start Coding <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>

      {/* Mobile Bottom Navigation Bar (Global for App Pages) */}
      {showBottomNav && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-t border-white/[0.07] flex items-center pb-safe">
          {[
            { href: '/dashboard', icon: Compass, label: 'Dashboard', color: pathname === '/dashboard' ? 'text-cyan-400' : 'text-slate-500 hover:text-cyan-400' },
            { href: '/tracks', icon: BookOpen, label: 'Tracks', color: pathname.startsWith('/tracks') ? 'text-orange-400' : 'text-slate-500 hover:text-orange-400' },
            { href: '/badges', icon: Award, label: 'Badges', color: pathname.startsWith('/badges') ? 'text-purple-400' : 'text-slate-500 hover:text-purple-400' },
            { href: '/visualizer', icon: Play, label: 'Visualizer', color: pathname === '/visualizer' ? 'text-green-400' : 'text-slate-500 hover:text-green-400' },
          ].map(({ href, icon: Icon, label, color }) => (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors ${color}`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
            </Link>
          ))}
        </nav>
      )}
    </>
  );
}
