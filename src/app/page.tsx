'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import CodingBackground from '@/components/ui/CodingBackground';
import CodeTerminalHero from '@/components/ui/CodeTerminalHero';
import CodeVisualizerMock from '@/components/ui/CodeVisualizerMock';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { Play, 
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
  Sparkles,
  Scan,
  Eye,
  GitBranch
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useUser } from '@/hooks/useUser';

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
    difficultyColor: 'bg-[#d9f95d]/10 text-[#d9f95d] border-[#d9f95d]/20',
    description: 'Learn the most versatile programming language. Great for scripting, data analysis, and automation.',
    href: '/signup?track=python',
    customIcon: '🐍',
  },
  {
    name: 'JavaScript',
    icon: Code,
    iconColor: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    units: 9,
    hours: 18,
    difficulty: 'Beginner',
    difficultyColor: 'bg-[#d9f95d]/10 text-[#d9f95d] border-[#d9f95d]/20',
    description: 'Go from zero to job-ready JavaScript — the language of the web. Build real projects, understand the browser, and write modern ES6+ code.',
    href: '/signup?track=javascript',
    customIcon: '⚡',
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
    name: 'C Programming',
    icon: Cpu,
    iconColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    units: 18,
    hours: 25,
    difficulty: 'Intermediate',
    difficultyColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    description: 'Understand core system architectures, memory layout, pointers, and low-level programming concepts.',
    href: '/signup?track=c-programming',
    customIcon: '⚙️',
  },
  {
    name: 'Java',
    icon: Terminal,
    iconColor: 'text-red-400 bg-red-500/10 border-red-500/20',
    units: 14,
    hours: 20,
    difficulty: 'Beginner',
    difficultyColor: 'bg-[#d9f95d]/10 text-[#d9f95d] border-[#d9f95d]/20',
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
    color: 'text-[#d9f95d] bg-[#d9f95d]/10 border-[#d9f95d]/20 hover:bg-[#d9f95d]/20',
  },
  {
    title: 'Code Visualizer',
    description: 'Step through your code line-by-line. Watch variables change in real time, trace call stacks, and see memory objects form — just like Python Tutor.',
    icon: Scan,
    color: 'text-violet-400 bg-violet-500/10 border-violet-500/20 hover:bg-violet-500/20',
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
  const { user, loading } = useUser();
  const ctaLink = (!loading && user) ? '/dashboard' : '/signup';
  const heroCtaText = (!loading && user) ? 'Go to Dashboard' : 'Start for free';
  const finalCtaText = (!loading && user) ? 'Go to Dashboard' : 'Get Started for Free';
  return (
    <div className="min-h-screen bg-black bg-noise flex flex-col text-slate-100 font-sans selection:bg-[#d9f95d]/30 selection:text-[#d9f95d] overflow-x-hidden relative">
      <CodingBackground />
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center pt-20 pb-32 border-b border-white/[0.04]">
        {/* Soft elegant glowing backdrops */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_70%_50%,rgba(217,249,93,0.05),transparent)] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-8 max-w-7xl relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 text-[10px] font-mono font-bold tracking-[0.2em] text-slate-400 uppercase"
            >
              [01] Zero-Install Coding Platform
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-[1.05]"
            >
              Learn to <br />
              code from <br />
              <span className="font-script accent-lime font-normal italic pr-4">
                absolute zero.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-slate-400 text-lg md:text-xl max-w-lg leading-relaxed"
            >
              Short lessons. Real code. No installs. Pick a language and write your first program in under 30 seconds.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto"
            >
              <Link
                href={ctaLink}
                className="w-full sm:w-auto inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#d9f95d] px-8 font-display font-bold text-slate-950 hover:bg-[#b8d945] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                {heroCtaText} <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#how-it-works"
                className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-xl glass-panel px-8 font-display font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-300"
              >
                <div className="w-2 h-2 rounded-full bg-[#d9f95d] mr-2" />
                How it works
              </a>
            </motion.div>

            {/* Stats Row */}
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, delay: 0.4 }}
               className="flex flex-wrap items-center gap-6 pt-8 text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase"
            >
              <div className="flex items-center gap-2">
                <span className="accent-lime">★ 5.0</span> Learner Rating
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-700 hidden sm:block" />
              <div className="flex items-center gap-2">
                <span className="accent-lime">100K+</span> Executions
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-700 hidden sm:block" />
              <div className="flex items-center gap-2">
                <span className="accent-lime">Zero</span> Setup Required
              </div>
            </motion.div>
          </div>

          {/* Right Column - Code Terminal Animation */}
          <div className="hidden lg:block w-full">
            <CodeTerminalHero />
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <motion.section 
        id="how-it-works"
        {...fadeInUp}
        className="py-24 lg:py-32 border-b border-white/[0.04] bg-[#111111] relative overflow-hidden"
      >
        {/* Cyan Ambient Glow */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-[#06b6d4]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-8 max-w-7xl relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column - Visual/Cards (Reversed: Text is on Right now) */}
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: '-80px' }}
            className="flex flex-col order-2 lg:order-1"
          >
            {/* Step 1 */}
            <motion.div variants={staggerItem} className="py-8 flex flex-col sm:flex-row gap-6 items-start group relative border-b border-white/[0.05] last:border-0">
              <div className="absolute top-0 right-0 p-4 font-mono text-white/[0.02] text-8xl font-black select-none pointer-events-none -z-10 translate-x-4 -translate-y-4">01</div>
              <div className="h-12 w-12 shrink-0 flex items-center justify-center text-slate-500 group-hover:text-[#06b6d4] transition-all group-hover:scale-110">
                <BookOpen className="h-8 w-8" />
              </div>
              <div className="space-y-2 relative z-10 pt-1">
                <h3 className="text-xl font-bold text-white group-hover:text-[#06b6d4] transition-colors">Pick a language</h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-sm">Choose from our beginner-friendly catalog, tailored specifically for learners with absolutely zero technical background.</p>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div variants={staggerItem} className="py-8 flex flex-col sm:flex-row gap-6 items-start group relative border-b border-white/[0.05] last:border-0">
               <div className="absolute top-0 right-0 p-4 font-mono text-white/[0.02] text-8xl font-black select-none pointer-events-none -z-10 translate-x-4 -translate-y-4">02</div>
              <div className="h-12 w-12 shrink-0 flex items-center justify-center text-slate-500 group-hover:text-[#06b6d4] transition-all group-hover:scale-110">
                <Lightbulb className="h-8 w-8" />
              </div>
              <div className="space-y-2 relative z-10 pt-1">
                <h3 className="text-xl font-bold text-white group-hover:text-[#06b6d4] transition-colors">Learn the concept</h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-sm">Absorb a highly visual, 3-minute lesson highlighting exactly one practical coding concept. No boring academic theory.</p>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div variants={staggerItem} className="py-8 flex flex-col sm:flex-row gap-6 items-start group relative border-b border-white/[0.05] last:border-0">
               <div className="absolute top-0 right-0 p-4 font-mono text-white/[0.02] text-8xl font-black select-none pointer-events-none -z-10 translate-x-4 -translate-y-4">03</div>
              <div className="h-12 w-12 shrink-0 flex items-center justify-center text-slate-500 group-hover:text-[#06b6d4] transition-all group-hover:scale-110">
                <Code className="h-8 w-8" />
              </div>
              <div className="space-y-2 relative z-10 pt-1">
                <h3 className="text-xl font-bold text-white group-hover:text-[#06b6d4] transition-colors">Write real code</h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-sm">Solve puzzles inside our in-browser interactive compiler. Receive instant execution responses and automated smart feedback.</p>
              </div>
            </motion.div>

          </motion.div>

          {/* Right Column - Text (Reversed) */}
          <div className="space-y-8 order-1 lg:order-2 lg:pl-12">
            <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold tracking-[0.2em] text-[#06b6d4] uppercase">
              [02] The Process
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tighter leading-[1.05]">
              How ScratchCode <br/>
              <span className="font-script text-[#06b6d4] font-normal italic pr-2">actually works.</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-md leading-relaxed">
              Our unique system eliminates typical learning friction. Build habits, write code, and advance one bite-sized concept at a time.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Language Tracks Section */}
      <motion.section 
        id="tracks"
        {...fadeInUp}
        className="py-24 lg:py-32 border-b border-white/[0.04] bg-black relative overflow-hidden"
      >
        {/* Orange Ambient Glow */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-[#f97316]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-8 max-w-7xl relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column - Text (Standard) */}
          <div className="space-y-8 order-1 lg:order-1 lg:pr-12">
            <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold tracking-[0.2em] text-[#f97316] uppercase">
              [03] The Curriculum
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tighter leading-[1.05]">
              Explore our <br/>
              <span className="font-script text-[#f97316] font-normal italic pr-2">language tracks.</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-md leading-relaxed">
              Hand-picked, structured curricula to take you from absolute zero to building projects with confidence. Select your path and start executing immediately.
            </p>
            <div className="pt-4">
              <Link
                href="#tracks"
                className="inline-flex h-12 items-center justify-center rounded-xl glass-panel px-8 font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-300"
              >
                <div className="w-2 h-2 rounded-full bg-[#f97316] mr-2" />
                View all tracks
              </Link>
            </div>
          </div>

          {/* Right Column - Visual/Cards (Standard) */}
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: '-80px' }}
            className="flex flex-col order-2 lg:order-2"
          >
            {tracks.slice(0, 4).map((track, i) => (
              <motion.div
                key={track.name}
                variants={staggerItem}
                className="py-6 flex flex-col sm:flex-row items-center justify-between group border-b border-white/[0.05] last:border-0 hover:bg-white/[0.02] px-4 -mx-4 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-6 w-full sm:w-auto">
                  <div className="h-12 w-12 flex items-center justify-center font-mono text-3xl text-slate-500 group-hover:text-[#f97316] transition-colors">
                    {track.customIcon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-[#f97316] transition-colors">{track.name}</h3>
                    <p className="text-slate-400 text-sm max-w-[280px] truncate">{track.description}</p>
                  </div>
                </div>

                <div className="mt-4 sm:mt-0 w-full sm:w-auto flex justify-end">
                  <Link
                    href={(!loading && user) ? `/tracks/${track.href.split('=')[1]}` : track.href}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#f97316] transition-colors"
                  >
                    {(!loading && user) ? 'Continue Track' : 'Start Track'} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Code Visualizer Showcase Section */}
      <motion.section
        id="visualizer"
        {...fadeInUp}
        className="py-24 lg:py-32 border-b border-white/[0.04] bg-[#111111] relative overflow-hidden"
      >
        {/* Green ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-green-500/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-8 max-w-7xl relative z-10">
          {/* Header */}
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold tracking-[0.2em] text-green-400 uppercase">
              [04] The Visualizer
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tighter leading-[1.05]">
              See your code{' '}<br/>
              <span className="font-script text-green-400 font-normal italic pr-2">come alive.</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Our built-in Code Visualizer lets you step through every line of your Python code, watch variables change in real time, and instantly apply AI-suggested fixes for runtime errors — all inside the browser.
            </p>
          </div>

          {/* Mock visualizer UI */}
          <CodeVisualizerMock />

          <div className="flex justify-center mt-12">
            <Link
              href="/visualizer"
              className="w-full sm:w-auto inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-green-400 px-8 font-display font-bold text-slate-950 hover:bg-green-500 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              Try it live <Play className="w-4 h-4 fill-current" />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Feature Highlights Section */}
      <motion.section 
        id="features"
        {...fadeInUp}
        className="py-24 lg:py-32 border-b border-white/[0.04] bg-black relative overflow-hidden"
      >
        {/* Purple Ambient Glow */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-[#a855f7]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-8 max-w-7xl relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column - Cards (Reversed: Text is on Right now) */}
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: '-80px' }}
            className="grid sm:grid-cols-2 gap-x-8 gap-y-16 order-2 lg:order-1"
          >
            {highlights.map((feat, i) => {
              const IconComponent = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  variants={staggerItem}
                  className="flex flex-col items-start gap-4 group relative"
                >
                  <div className="h-12 w-12 flex items-center justify-start text-slate-500 group-hover:text-[#a855f7] transition-all group-hover:scale-110 group-hover:-translate-y-1">
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <div className="space-y-2 relative z-10">
                    <h3 className="text-xl font-bold text-white group-hover:text-[#a855f7] transition-colors">{feat.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Right Column - Text (Reversed) */}
          <div className="space-y-8 order-1 lg:order-2 lg:pl-12">
            <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold tracking-[0.2em] text-[#a855f7] uppercase">
              [05] The Advantage
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tighter leading-[1.05]">
              Built for <br/>
              <span className="font-script text-[#a855f7] font-normal italic pr-2">beginner success.</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-md leading-relaxed">
              We design every mechanic around zero friction, continuous momentum, and deep concepts. Don't waste time on configuration.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Final Call To Action */}
      <motion.section 
        {...fadeInUp}
        className="py-32 relative overflow-hidden flex flex-col items-center text-center border-t border-white/[0.02]"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#d9f95d]/10 rounded-[100%] blur-[120px] pointer-events-none" />
        
        <div className="container mx-auto px-4 max-w-4xl relative z-10 space-y-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-mono font-bold tracking-[0.2em] text-slate-300 uppercase">
            [05] Start Your Journey
          </div>
          
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[1.05]">
            Ready to write <br/>
            <span className="text-slate-500 font-normal italic pr-2">your first line?</span>
          </h2>
          
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            No credit cards, no complex setups. Just pick a language and experience the thrill of compile success in 30 seconds.
          </p>
          
          <div className="pt-8">
            <Link
              href={ctaLink}
              className="w-full sm:w-auto inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-white px-10 text-base font-display tracking-wide font-bold text-black hover:bg-[#d9f95d] hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.2)]"
            >
              {finalCtaText} <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
