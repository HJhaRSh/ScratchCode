'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';
import { 
  BookOpen, 
  Lightbulb, 
  Code, 
  ArrowRight, 
  Terminal, 
  Globe, 
  Cpu, 
  Coffee, 
  PlayCircle,
  Trophy,
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

// Custom SVG Github icon to avoid version discrepancies
const Github = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

// Language Track definitions
const tracks = [
  {
    name: 'Python',
    icon: Coffee,
    iconColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    units: 12,
    hours: 15,
    difficulty: 'Beginner',
    difficultyColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    description: 'Learn the most versatile programming language. Great for scripting, data analysis, and automation.',
    href: '/signup?track=python',
    customIcon: '🐍',
  },
  {
    name: 'JavaScript',
    icon: Code,
    iconColor: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    units: 15,
    hours: 18,
    difficulty: 'Beginner',
    difficultyColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    description: 'Bring websites to life. Master DOM manipulation, events, asynchronous programming, and logic.',
    href: '/signup?track=javascript',
    customIcon: '💛',
  },
  {
    name: 'HTML + CSS',
    icon: Globe,
    iconColor: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    units: 8,
    hours: 10,
    difficulty: 'Absolute Zero',
    difficultyColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    description: 'The skeleton and styling of the web. Perfect for complete beginners wishing to see visual results fast.',
    href: '/signup?track=html-css',
    customIcon: '🌐',
  },
  {
    name: 'C / C++',
    icon: Cpu,
    iconColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    units: 18,
    hours: 25,
    difficulty: 'Intermediate',
    difficultyColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    description: 'Understand core system architectures, memory layout, pointers, and low-level programming concepts.',
    href: '/signup?track=c-cpp',
    customIcon: '⚙️',
  },
  {
    name: 'Java',
    icon: Terminal,
    iconColor: 'text-red-400 bg-red-500/10 border-red-500/20',
    units: 14,
    hours: 20,
    difficulty: 'Beginner',
    difficultyColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    description: 'Deep dive into Object-Oriented programming structures, classes, compilers, and reliable system building.',
    href: '/signup?track=java',
    customIcon: '☕',
  },
];

// Feature Highlights definitions
const highlights = [
  {
    title: 'No install needed',
    description: 'Run real, live code in your browser instantly. No local setups, compilers, or IDE configuration required.',
    icon: PlayCircle,
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20 hover:bg-cyan-500/20',
  },
  {
    title: 'AI mentor hints',
    description: 'Stuck on a tricky challenge? Get context-aware, friendly hints that guide your reasoning, not just the code.',
    icon: Sparkles,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20',
  },
  {
    title: 'Build real projects',
    description: 'Apply what you learn. Every module culminates in a real product, game, or tool built from scratch by you.',
    icon: Trophy,
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20',
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }
};

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.1,
    }
  },
  viewport: { once: true, margin: '-80px' }
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#030712] flex flex-col text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-100 overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-24 md:pt-48 md:pb-32 border-b border-white/[0.04]">
        {/* Soft elegant glowing backdrops */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_-10%,rgba(16,185,129,0.1),rgba(59,130,246,0.05),transparent)]" />
        
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,black,transparent)]" />

        <div className="container mx-auto px-4 max-w-6xl text-center space-y-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full glass-panel px-4 py-1.5 text-xs font-medium text-emerald-400 border-emerald-500/20"
          >
            <Sparkles className="h-3.5 w-3.5" /> India's First Zero-Install Coding Platform
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.1] drop-shadow-2xl"
          >
            Learn to code from{' '}
            <span className="neon-text relative">
              absolute zero.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Short lessons. Real code. No installs. Pick a language and write your first program in under 30 seconds.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center gap-4 pt-6"
          >
            <Link
              href="/signup"
              className="group relative inline-flex h-12 items-center justify-center gap-2 rounded-full bg-emerald-500 px-8 font-bold text-slate-950 hover:bg-emerald-400 hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-500 ease-in-out" />
              <span className="relative z-10 flex items-center gap-2">Start for free <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></span>
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex h-12 items-center justify-center rounded-full glass-panel px-8 font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-300"
            >
              See how it works
            </a>
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <motion.section 
        id="how-it-works"
        {...fadeInUp}
        className="py-24 border-b border-white/[0.04] bg-[#030712] relative"
      >
        <div className="container mx-auto px-4 max-w-6xl space-y-16 relative z-10">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">How ScratchCode Works</h2>
            <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Our unique system eliminates typical learning friction. Build habits, write code, and advance one bite-sized concept at a time.
            </p>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Step 1 */}
            <motion.div 
              variants={staggerItem}
              className="glass-panel p-8 rounded-3xl space-y-5 transition-all duration-300 group hover:border-blue-500/30 hover:shadow-[0_10px_40px_-10px_rgba(59,130,246,0.15)] relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 blur-[40px] rounded-full pointer-events-none group-hover:bg-blue-500/20 transition-all" />
              <div className="absolute top-0 right-0 p-6 font-mono text-white/[0.03] text-6xl font-black select-none">01</div>
              <div className="h-14 w-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 transition-all">
                <BookOpen className="h-7 w-7" />
              </div>
              <div className="space-y-3 relative z-10 pt-2">
                <h3 className="text-2xl font-bold text-white">Pick a language</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Choose from our beginner-friendly catalog, tailored specifically for learners with absolutely zero technical background.
                </p>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              variants={staggerItem}
              className="glass-panel p-8 rounded-3xl space-y-5 transition-all duration-300 group hover:border-amber-500/30 hover:shadow-[0_10px_40px_-10px_rgba(245,158,11,0.15)] relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 blur-[40px] rounded-full pointer-events-none group-hover:bg-amber-500/20 transition-all" />
              <div className="absolute top-0 right-0 p-6 font-mono text-white/[0.03] text-6xl font-black select-none">02</div>
              <div className="h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:bg-amber-500/20 transition-all">
                <Lightbulb className="h-7 w-7" />
              </div>
              <div className="space-y-3 relative z-10 pt-2">
                <h3 className="text-2xl font-bold text-white">Learn the concept</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Absorb a highly visual, 3-minute lesson highlighting exactly one practical coding concept. No boring academic theory.
                </p>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              variants={staggerItem}
              className="glass-panel p-8 rounded-3xl space-y-5 transition-all duration-300 group hover:border-emerald-500/30 hover:shadow-[0_10px_40px_-10px_rgba(16,185,129,0.15)] relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 blur-[40px] rounded-full pointer-events-none group-hover:bg-emerald-500/20 transition-all" />
              <div className="absolute top-0 right-0 p-6 font-mono text-white/[0.03] text-6xl font-black select-none">03</div>
              <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 transition-all">
                <Code className="h-7 w-7" />
              </div>
              <div className="space-y-3 relative z-10 pt-2">
                <h3 className="text-2xl font-bold text-white">Write real code</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Solve puzzles inside our in-browser interactive compiler. Receive instant execution responses and automated smart feedback.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Language Tracks Section */}
      <motion.section 
        id="tracks"
        {...fadeInUp}
        className="py-24 border-b border-white/[0.04] bg-[#030712] relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_40%,rgba(16,185,129,0.03),transparent)] pointer-events-none" />

        <div className="container mx-auto px-4 max-w-6xl space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Explore Our Language Tracks</h2>
            <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Hand-picked, structured curricula to take you from absolute zero to building projects with confidence. Select your path.
            </p>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {tracks.map((track) => (
              <motion.div
                key={track.name}
                variants={staggerItem}
                className="glass-panel rounded-3xl p-8 flex flex-col justify-between hover:border-white/10 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] transition-all duration-300 group"
              >
                <div className="space-y-6">
                  {/* Header: Icon, Name, Difficulty badge */}
                  <div className="flex items-start justify-between">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center border font-mono text-2xl ${track.iconColor} group-hover:scale-110 transition-transform`}>
                      {track.customIcon}
                    </div>
                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${track.difficultyColor}`}>
                      {track.difficulty}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">{track.name}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{track.description}</p>
                  </div>
                </div>

                {/* Info and CTA button */}
                <div className="mt-8 pt-6 border-t border-white/[0.04] space-y-5">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Layers className="h-4 w-4 text-emerald-500" />
                      {track.units} Units
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-emerald-500" />
                      Est. {track.hours} Hours
                    </span>
                  </div>

                  <Link
                    href={track.href}
                    className="inline-flex w-full h-10 items-center justify-center gap-2 rounded-lg bg-white/5 border border-white/10 text-sm font-semibold text-slate-200 hover:text-slate-950 hover:bg-emerald-500 hover:border-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300"
                  >
                    Start Track <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Feature Highlights Section */}
      <motion.section 
        id="features"
        {...fadeInUp}
        className="py-24 border-b border-white/[0.04] bg-[#030712] relative"
      >
        <div className="container mx-auto px-4 max-w-6xl space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Built for Beginner Success</h2>
            <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              We design every mechanic around zero friction, continuous momentum, and deep concepts.
            </p>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {highlights.map((feat) => {
              const IconComponent = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  variants={staggerItem}
                  className="glass-panel rounded-3xl p-8 space-y-5 group hover:border-white/10 transition-all duration-300"
                >
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border transition-colors ${feat.color}`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{feat.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {feat.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* Final Call To Action */}
      <motion.section 
        {...fadeInUp}
        className="py-32 bg-[#030712] relative overflow-hidden text-center"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.06),transparent)]" />
        <div className="container mx-auto px-4 max-w-3xl space-y-8 relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight">
            Ready to write your first line of code?
          </h2>
          <p className="text-slate-400 text-base md:text-xl max-w-xl mx-auto leading-relaxed">
            No credit cards, no setups. Just pick a path and experience the thrill of compile success in 30 seconds.
          </p>
          <div className="pt-6">
            <Link
              href="/signup"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-white px-10 text-base font-bold text-slate-950 hover:bg-slate-200 hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)]"
            >
              Get Started for Free <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-[#030712] border-t border-white/[0.04] py-16 text-slate-400 relative z-10">
        <div className="container mx-auto px-4 max-w-6xl space-y-12">
          {/* Main Footer Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <Terminal className="h-4.5 w-4.5 text-emerald-400" />
                </div>
                <span className="font-bold text-lg text-white">ScratchCode</span>
              </div>
              <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
                India's premiere zero-install platform teaching absolute beginners programming through real browser execution.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:col-span-2 gap-8 md:justify-items-end">
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Legal</h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                  </li>
                  <li>
                    <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Community</h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <a 
                      href="https://github.com" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-1.5 hover:text-white transition-colors"
                    >
                      <Github className="h-4 w-4" />
                      GitHub
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-500">
            <p>© {new Date().getFullYear()} ScratchCode. All rights reserved. Created with ❤️ for future developers.</p>
            <p>Made in India.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
