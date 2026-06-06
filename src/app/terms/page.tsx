import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { FileText, CheckCircle, Scale, ShieldAlert, Cpu } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black bg-noise flex flex-col text-slate-100 font-sans selection:bg-[#06b6d4]/30 selection:text-[#06b6d4] overflow-x-hidden relative">
      <Navbar />
      
      <main className="flex-1 relative z-10 pt-32 pb-24">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#06b6d4]/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-20 left-0 w-[400px] h-[400px] bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <div className="space-y-16">
            
            {/* Header */}
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#06b6d4]/10 border border-[#06b6d4]/20 text-[#06b6d4] text-sm font-medium mb-4">
                <FileText className="w-4 h-4" />
                Legal Agreements
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight">
                Terms of <span className="font-script text-[#06b6d4] italic font-normal">Service</span>
              </h1>
              <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
                By accessing ScratchCode, you agree to these terms. Read carefully to understand your rights and responsibilities.
              </p>
              <div className="pt-4 flex items-center justify-center gap-2 text-sm text-slate-500 font-medium">
                Last updated: <span className="text-slate-300 px-3 py-1 rounded-md bg-white/5 border border-white/10">{new Date().toLocaleDateString()}</span>
              </div>
            </div>

            {/* Content Cards */}
            <div className="space-y-8">
              
              <section className="bg-[#111111] border border-white/10 rounded-2xl p-8 md:p-10 hover:border-white/20 transition-colors group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <CheckCircle className="w-32 h-32 text-white" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="bg-white/10 text-white p-2 rounded-lg"><CheckCircle className="w-5 h-5" /></span>
                    1. Acceptance & User Accounts
                  </h3>
                  <div className="prose prose-invert prose-slate max-w-none prose-p:text-slate-400 prose-li:text-slate-400">
                    <p>By creating an account, you confirm that you have read and agreed to these terms. You are responsible for:</p>
                    <ul>
                      <li>Maintaining the confidentiality of your account credentials.</li>
                      <li>Notifying us immediately of any unauthorized use.</li>
                    </ul>
                    <p>We reserve the right to suspend or terminate accounts that violate our policies or engage in abusive behavior.</p>
                  </div>
                </div>
              </section>

              <section className="bg-[#111111] border border-white/10 rounded-2xl p-8 md:p-10 hover:border-white/20 transition-colors group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <ShieldAlert className="w-32 h-32 text-white" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="bg-[#06b6d4]/10 text-[#06b6d4] p-2 rounded-lg"><ShieldAlert className="w-5 h-5" /></span>
                    2. Acceptable Use
                  </h3>
                  <div className="prose prose-invert prose-slate max-w-none prose-p:text-slate-400 prose-li:text-slate-400">
                    <p>Our interactive coding environments are provided for educational purposes. You agree not to:</p>
                    <ul>
                      <li><strong className="text-slate-200">Abuse resources:</strong> Use the platform for cryptocurrency mining or malicious activities.</li>
                      <li><strong className="text-slate-200">Hack:</strong> Attempt to bypass our security or sandbox restrictions.</li>
                      <li><strong className="text-slate-200">Exploit:</strong> Upload code designed to harm, disrupt, or exploit the platform or other users.</li>
                      <li><strong className="text-slate-200">Scrape:</strong> Copy our curriculum content without permission.</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="bg-[#111111] border border-white/10 rounded-2xl p-8 md:p-10 hover:border-white/20 transition-colors group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Cpu className="w-32 h-32 text-white" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="bg-indigo-500/10 text-indigo-500 p-2 rounded-lg"><Cpu className="w-5 h-5" /></span>
                    3. Intellectual Property
                  </h3>
                  <div className="prose prose-invert prose-slate max-w-none prose-p:text-slate-400 prose-li:text-slate-400">
                    <p>All curriculum content, platform design, logos, and features are the intellectual property of ScratchCode.</p>
                    <p>The code you write and create remains yours, subject to the MIT License if you choose to share it publicly on our platform.</p>
                  </div>
                </div>
              </section>

              <div className="grid md:grid-cols-2 gap-8">
                <section className="bg-black border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-colors">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                    <Scale className="w-5 h-5 text-slate-400" /> Disclaimers
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    ScratchCode is provided "as is". We do not guarantee continuous, uninterrupted, or secure access to our services, though we strive to provide the best experience possible. In no event shall ScratchCode be liable for indirect damages.
                  </p>
                </section>

                <section className="bg-black border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-colors">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                    <FileText className="w-5 h-5 text-slate-400" /> Updates
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    We may update these terms from time to time. We will notify users of significant changes. Continued use of the platform after changes constitutes acceptance of the new terms.
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
