'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Link as LinkIcon, CheckCircle2 } from 'lucide-react';
import CertificateCard, { CertificateCardProps } from './CertificateCard';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificateData: CertificateCardProps & { shareUrl: string };
}



export default function ShareModal({ isOpen, onClose, certificateData }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  React.useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      setScale(entries[0].contentRect.width / 1200);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(certificateData.shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  // Share Texts
  const shareTextBase = `I just earned a new achievement on ScratchCode: ${certificateData.title}! 🔥`;
  const shareTextTwitter = encodeURIComponent(`${shareTextBase}\nCheck it out here:\n${certificateData.shareUrl} #coding #scratchcode`);
  const shareTextLinkedin = encodeURIComponent(`${shareTextBase}\nCheck it out here:\n${certificateData.shareUrl}`);
  const shareTextWhatsapp = encodeURIComponent(`${shareTextBase}\n${certificateData.shareUrl}`);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-[#0f0f13] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl z-10 my-8"
        >
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Share Your Achievement</h2>
            <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="w-full rounded-xl overflow-hidden shadow-2xl border border-[rgba(255,255,255,0.1)] bg-[#000000] p-2" ref={containerRef}>
              <div className="relative w-full" style={{ paddingTop: '52.5%' }}>
                 <div className="absolute top-0 left-0 origin-top-left" style={{ transform: `scale(${scale})` }}>
                   <CertificateCard {...certificateData} />
                 </div>
              </div>
            </div>

            {/* Share Actions */}
            <div className="pt-4 border-t border-white/10">
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-2">Share On</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <a href={`https://twitter.com/intent/tweet?text=${shareTextTwitter}`} target="_blank" rel="noopener noreferrer" 
                     className="flex items-center justify-center gap-2 px-2 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors">
                    <svg className="h-5 w-5 fill-current shrink-0" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                  <a href={`https://www.linkedin.com/feed/?shareActive=true&text=${shareTextLinkedin}`} target="_blank" rel="noopener noreferrer"
                     className="flex items-center justify-center gap-2 px-2 py-3 rounded-xl bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2]/20 transition-colors">
                    <svg className="h-5 w-5 fill-current shrink-0" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </a>
                  <a href={`https://wa.me/?text=${shareTextWhatsapp}`} target="_blank" rel="noopener noreferrer"
                     className="flex items-center justify-center gap-2 px-2 py-3 rounded-xl bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-colors">
                    <svg className="h-5 w-5 fill-current shrink-0" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                  </a>
                  <button 
                    onClick={handleCopyLink}
                    className="flex items-center justify-center gap-2 px-2 py-3 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-colors"
                  >
                    {copied ? <CheckCircle2 className="h-5 w-5 text-[#d9f95d]" /> : <LinkIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
