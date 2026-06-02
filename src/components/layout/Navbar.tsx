'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Terminal, ArrowRight } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');
  const isLearn = pathname?.startsWith('/learn');

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  // If in a learning environment or dashboard, we might want a different or simpler navbar
  if (isLearn) return null; // Let the learn layout handle its own specific header

  const navLinks = [
    { name: 'Tracks', href: '/#tracks' },
    { name: 'How it works', href: '/#how-it-works' },
    { name: 'Features', href: '/#features' },
  ];

  return (
    <header className="fixed top-6 z-50 w-full px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="glass-pill px-4 sm:px-6 h-14 w-full max-w-5xl flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2 group" onClick={closeMenu}>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30 group-hover:border-emerald-500/50 transition-colors">
              <Terminal className="h-4.5 w-4.5 text-emerald-400" />
            </div>
            <span className="font-bold text-lg text-white tracking-tight group-hover:text-emerald-400 transition-colors">
              ScratchCode
            </span>
          </Link>

          {/* Desktop Navigation links */}
          <nav className="hidden md:flex gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>

        {/* Desktop Call to Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Sign in
          </Link>
          <Link
            href="/signup"
            className="group relative inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-emerald-500 px-5 text-sm font-bold text-slate-950 hover:bg-emerald-400 hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-1.5">Get Started <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-slate-300 hover:text-white transition-colors focus:outline-none p-2"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu - Full Screen Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-[#030712]/95 backdrop-blur-xl pt-24 px-6 md:hidden overflow-y-auto">
          <nav className="flex flex-col space-y-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-2xl font-bold text-slate-300 hover:text-white"
                onClick={closeMenu}
              >
                {link.name}
              </a>
            ))}
            <div className="pt-8 border-t border-slate-800 flex flex-col space-y-4">
              <Link
                href="/login"
                className="w-full h-12 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-lg font-bold text-white hover:bg-slate-800 transition-colors"
                onClick={closeMenu}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 text-lg font-bold text-slate-950 hover:bg-emerald-400 transition-colors"
                onClick={closeMenu}
              >
                Get Started <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
