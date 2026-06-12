import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/[0.05] pt-24 pb-12 relative z-10 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-full max-w-3xl h-48 bg-[#d9f95d]/5 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-20">
          <div className="md:col-span-6 lg:col-span-5 space-y-6">
            <Link href="/" className="inline-block group">
              <span className="font-logo text-3xl font-bold text-white tracking-tighter group-hover:text-[#d9f95d] transition-colors duration-300">
                &lt;scratch.code&gt;
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              India's premiere zero-install platform. Teaching absolute beginners programming through real, immediate browser execution.
            </p>
          </div>
          
          <div className="md:col-span-6 lg:col-span-7 flex flex-wrap gap-16 lg:justify-end">
            <div className="space-y-6">
              <h4 className="text-[11px] font-display font-bold uppercase tracking-[0.2em] text-slate-500">Platform</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li>
                  <Link href="/tracks" className="text-slate-300 hover:text-[#d9f95d] transition-colors flex items-center gap-2 group">
                    Tracks
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link href="/visualizer" className="text-slate-300 hover:text-[#d9f95d] transition-colors flex items-center gap-2 group">
                    Code Visualizer
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link href="/daily-quest" className="text-slate-300 hover:text-[#d9f95d] transition-colors flex items-center gap-2 group">
                    Daily Quests
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              </ul>
            </div>



            <div className="space-y-6">
              <h4 className="text-[11px] font-display font-bold uppercase tracking-[0.2em] text-slate-500">Legal</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li>
                  <Link href="/privacy" className="text-slate-300 hover:text-[#d9f95d] transition-colors flex items-center gap-2 group">
                    Privacy Policy
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-slate-300 hover:text-[#d9f95d] transition-colors flex items-center gap-2 group">
                    Terms of Service
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-slate-300 hover:text-[#d9f95d] transition-colors flex items-center gap-2 group">
                    Contact Us
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              </ul>
            </div>
            

          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d9f95d] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d9f95d]"></span>
            </span>
            All systems operational
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-[11px] uppercase tracking-wider font-bold text-slate-500">
            <p>© {new Date().getFullYear()} ScratchCode. All rights reserved.</p>
            <p className="flex items-center gap-1.5 border border-white/10 rounded-full px-4 py-2 bg-white/[0.02]">
              Made with <span className="text-rose-500 text-sm animate-pulse">♥</span> in India
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
