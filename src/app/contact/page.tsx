'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Mail, MapPin, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error: any) {
      console.error('Contact error:', error);
      setStatus('error');
      setErrorMessage(error.message || 'Failed to send message.');
    }
  };
  return (
    <div className="min-h-screen bg-black bg-noise flex flex-col text-slate-100 font-sans selection:bg-[#d9f95d]/30 selection:text-[#d9f95d] overflow-x-hidden relative">
      <Navbar />
      <main className="flex-1 container mx-auto px-6 py-32 max-w-4xl relative z-10">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#d9f95d]/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="space-y-12 relative z-10">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
              Contact <span className="font-script text-[#d9f95d] italic font-normal">Us</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl">
              Have questions, feedback, or need support? We're here to help you on your coding journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#111111] border border-white/10 rounded-2xl p-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-[#d9f95d]/10 text-[#d9f95d] p-3 rounded-lg">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Email Us</h3>
                  <p className="text-slate-400 mt-1 mb-2">Fill out the form and we will get back to you as soon as possible.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-[#06b6d4]/10 text-[#06b6d4] p-3 rounded-lg">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Office Location</h3>
                  <p className="text-slate-400 mt-1">Made with ♥ in India<br />Remote team operating globally.</p>
                </div>
              </div>
            </div>

            <form className="bg-[#111111] border border-white/10 rounded-2xl p-8 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#d9f95d] transition-colors" 
                  placeholder="Your name" 
                  disabled={status === 'loading'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#d9f95d] transition-colors" 
                  placeholder="your@email.com" 
                  disabled={status === 'loading'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Message</label>
                <textarea 
                  rows={4} 
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#d9f95d] transition-colors resize-none" 
                  placeholder="How can we help you?"
                  disabled={status === 'loading'}
                ></textarea>
              </div>

              {status === 'error' && (
                <div className="flex items-center gap-2 text-rose-500 text-sm bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p>{errorMessage}</p>
                </div>
              )}

              {status === 'success' && (
                <div className="flex items-center gap-2 text-[#d9f95d] text-sm bg-[#d9f95d]/10 p-3 rounded-lg border border-[#d9f95d]/20">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <p>Message sent successfully! We'll be in touch soon.</p>
                </div>
              )}

              <button 
                type="submit" 
                disabled={status === 'loading' || status === 'success'}
                className="w-full flex justify-center items-center gap-2 bg-[#d9f95d] text-black font-bold py-3 rounded-lg hover:bg-[#b8d945] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : status === 'success' ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Sent!
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
