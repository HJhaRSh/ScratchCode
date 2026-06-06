import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Shield, Lock, Eye, Server, Cookie, AlertCircle } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black bg-noise flex flex-col text-slate-100 font-sans selection:bg-[#f97316]/30 selection:text-[#f97316] overflow-x-hidden relative">
      <Navbar />
      
      <main className="flex-1 relative z-10 pt-32 pb-24">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#f97316]/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-rose-500/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <div className="space-y-16">
            
            {/* Header */}
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f97316]/10 border border-[#f97316]/20 text-[#f97316] text-sm font-medium mb-4">
                <Shield className="w-4 h-4" />
                Data Protection
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight">
                Privacy <span className="font-script text-[#f97316] italic font-normal">Policy</span>
              </h1>
              <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
                We believe in full transparency. Here is exactly how we collect, use, and protect your data.
              </p>
              <div className="pt-4 flex items-center justify-center gap-2 text-sm text-slate-500 font-medium">
                Last updated: <span className="text-slate-300 px-3 py-1 rounded-md bg-white/5 border border-white/10">{new Date().toLocaleDateString()}</span>
              </div>
            </div>

            {/* Content Cards */}
            <div className="space-y-8">
              
              <section className="bg-[#111111] border border-white/10 rounded-2xl p-8 md:p-10 hover:border-white/20 transition-colors group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Eye className="w-32 h-32 text-white" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="bg-white/10 text-white p-2 rounded-lg"><Eye className="w-5 h-5" /></span>
                    1. Information We Collect
                  </h3>
                  <div className="prose prose-invert prose-slate max-w-none prose-p:text-slate-400 prose-li:text-slate-400">
                    <p>We collect information you provide directly to us when you:</p>
                    <ul>
                      <li><strong className="text-slate-200">Create an account:</strong> Email address and username.</li>
                      <li><strong className="text-slate-200">Use our coding environment:</strong> Code snippets and execution logs.</li>
                      <li><strong className="text-slate-200">Track your progress:</strong> Completed lessons, XP, and learning streaks.</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="bg-[#111111] border border-white/10 rounded-2xl p-8 md:p-10 hover:border-white/20 transition-colors group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Server className="w-32 h-32 text-white" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="bg-[#f97316]/10 text-[#f97316] p-2 rounded-lg"><Server className="w-5 h-5" /></span>
                    2. How We Use Your Information
                  </h3>
                  <div className="prose prose-invert prose-slate max-w-none prose-p:text-slate-400 prose-li:text-slate-400">
                    <p>The information we collect is used solely to provide and improve our services:</p>
                    <ul>
                      <li>To authenticate your identity and secure your account.</li>
                      <li>To save your coding progress, badges, and curriculum state.</li>
                      <li>To provide AI-assisted mentoring and code fixes using third-party APIs (your code snippets are sent anonymously).</li>
                      <li>To analyze platform usage and improve performance.</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="bg-[#111111] border border-white/10 rounded-2xl p-8 md:p-10 hover:border-white/20 transition-colors group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Lock className="w-32 h-32 text-white" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="bg-rose-500/10 text-rose-500 p-2 rounded-lg"><Lock className="w-5 h-5" /></span>
                    3. Data Security & Third Parties
                  </h3>
                  <div className="prose prose-invert prose-slate max-w-none prose-p:text-slate-400 prose-li:text-slate-400">
                    <p>We do not sell your personal data. We implement industry-standard security measures and share information only with trusted services:</p>
                    <ul>
                      <li><strong className="text-slate-200">Authentication:</strong> Supabase handles our secure user authentication.</li>
                      <li><strong className="text-slate-200">AI Features:</strong> Code snippets are sent to Groq/LLM providers strictly for generating explanations.</li>
                      <li><strong className="text-slate-200">Code Execution:</strong> Non-browser-based executions may be sent to our secure Judge0 environment.</li>
                    </ul>
                  </div>
                </div>
              </section>

              <div className="grid md:grid-cols-2 gap-8">
                <section className="bg-black border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-colors">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                    <Cookie className="w-5 h-5 text-slate-400" /> Cookies
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    We use essential cookies to keep you logged in and functional cookies to remember your preferences. We do not use invasive tracking or advertising cookies.
                  </p>
                </section>

                <section className="bg-black border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-colors">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-slate-400" /> Your Rights
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    You have the right to access, update, or delete your personal information at any time. Manage your settings or contact us to request data deletion.
                  </p>
                </section>
              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
