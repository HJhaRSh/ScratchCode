'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, CheckCircle2, Swords, Timer, Target } from 'lucide-react';

interface ChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonId?: string;
  questId?: string;
  title: string;
}

export default function ChallengeModal({ isOpen, onClose, lessonId, questId, title }: ChallengeModalProps) {
  const [customMessage, setCustomMessage] = useState("I bet you can't solve this faster than me! ⚔️");
  const [expiresInHours, setExpiresInHours] = useState(24);
  const [maxAttempts, setMaxAttempts] = useState(3);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [challengeUrl, setChallengeUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreateChallenge = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/challenges/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeType: questId ? 'DAILY_QUEST' : 'LESSON',
          lessonId,
          questId,
          message: customMessage,
          expiresInHours,
          attemptsAllowed: maxAttempts
        })
      });
      const data = await res.json();
      if (res.ok) {
        setChallengeUrl(`${window.location.origin}/challenge/${data.challengeToken}`);
        setShareTexts({
          twitter: data.shareText.twitter.replace(data.challengeUrl, `${window.location.origin}/challenge/${data.challengeToken}`),
          linkedin: data.shareText.linkedin.replace(data.challengeUrl, `${window.location.origin}/challenge/${data.challengeToken}`),
          whatsapp: data.shareText.whatsapp.replace(data.challengeUrl, `${window.location.origin}/challenge/${data.challengeToken}`)
        });
      } else {
        setError(data.error || 'Failed to create challenge');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (challengeUrl) {
      navigator.clipboard.writeText(challengeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl z-10"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-orange-500" />
          
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500">
                <Swords className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-white">Challenge a Friend</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-slate-400 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {!challengeUrl ? (
              <>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-300">Target Problem</h3>
                  <div className="p-3 bg-black border border-white/10 rounded-xl text-white font-mono text-sm">
                    {title}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-300 block">Custom Trash Talk (Optional)</label>
                  <textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl p-3 text-white text-sm focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 transition-all min-h-[80px]"
                    placeholder="Type your message..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                      <Timer className="h-4 w-4 text-slate-500" /> Expires In
                    </label>
                    <select 
                      value={expiresInHours}
                      onChange={(e) => setExpiresInHours(Number(e.target.value))}
                      className="w-full bg-black border border-white/10 rounded-xl p-3 text-white text-sm outline-none"
                    >
                      <option value={1}>1 Hour</option>
                      <option value={12}>12 Hours</option>
                      <option value={24}>24 Hours</option>
                      <option value={72}>3 Days</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                      <Target className="h-4 w-4 text-slate-500" /> Max Attempts
                    </label>
                    <select 
                      value={maxAttempts}
                      onChange={(e) => setMaxAttempts(Number(e.target.value))}
                      className="w-full bg-black border border-white/10 rounded-xl p-3 text-white text-sm outline-none"
                    >
                      <option value={1}>1 Attempt (Hardcore)</option>
                      <option value={3}>3 Attempts</option>
                      <option value={5}>5 Attempts</option>
                      <option value={10}>10 Attempts</option>
                    </select>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm font-bold">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleCreateChallenge}
                  disabled={isGenerating}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold text-lg hover:from-rose-400 hover:to-orange-400 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(244,63,94,0.2)] flex items-center justify-center gap-2"
                >
                  {isGenerating ? <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Swords className="h-5 w-5" />}
                  Generate Challenge Link
                </button>
              </>
            ) : (
              <div className="space-y-6 text-center py-4">
                <div className="mx-auto w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 mb-4">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                
                <h3 className="text-xl font-bold text-white">Challenge Ready!</h3>
                <p className="text-slate-400 text-sm">Send this link to your friend. The challenge begins as soon as they open it.</p>
                
                <div className="relative group">
                  <input 
                    type="text" 
                    readOnly 
                    value={challengeUrl} 
                    className="w-full bg-black border border-white/10 rounded-xl p-4 pr-14 text-emerald-400 font-mono text-sm"
                  />
                  <button 
                    onClick={handleCopy}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-colors"
                  >
                    {copied ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5" />}
                  </button>
                </div>
                
                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
