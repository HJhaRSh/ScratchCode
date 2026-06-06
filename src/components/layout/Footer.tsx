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
            
            <div className="space-y-6">
              <h4 className="text-[11px] font-display font-bold uppercase tracking-[0.2em] text-slate-500">Social</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors flex items-center gap-3 group">
                    <div className="bg-white/5 p-2 rounded-lg group-hover:bg-white/10 transition-colors">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 19 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 9 18v4"></path>
                        <path d="M9 18c-4.51 2-5-2-7-2"></path>
                      </svg>
                    </div>
                    GitHub
                  </a>
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
