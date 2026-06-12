'use client';

import React, { useState } from 'react';
import { Share2 } from 'lucide-react';
import ShareModal from './ShareModal';

interface ShareButtonProps {
  type: 'QUEST_SOLVED' | 'STREAK_MILESTONE' | 'TRACK_COMPLETE' | 'BADGE_EARNED' | 'CHALLENGE_WON';
  questId?: string;
  lessonId?: string;
  streakCount?: number;
  badgeName?: string;
  language?: string;
  theme?: 'dark' | 'ocean' | 'fire' | 'forest' | 'aurora';
  variant?: 'icon' | 'button' | 'banner';
  className?: string;
}

export default function ShareButton({
  type, questId, lessonId, streakCount, badgeName, language, theme = 'dark', variant = 'button', className = ''
}: ShareButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [certData, setCertData] = useState<any>(null);

  const handleShareClick = async () => {
    if (certData) {
      setModalOpen(true);
      return;
    }
    
    setIsGenerating(true);
    try {
      const res = await fetch('/api/certificates/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type, questId, lessonId, streakCount, badgeName, language, theme
        })
      });
      const data = await res.json();
      if (res.ok) {
        setCertData({
          ...data.cardData,
          shareUrl: `${window.location.origin}/cert/${data.shareToken}`
        });
        setModalOpen(true);
      } else {
        console.error('Failed to generate certificate:', data.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderButton = () => {
    if (variant === 'icon') {
      return (
        <button 
          onClick={handleShareClick}
          disabled={isGenerating}
          className={`p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors disabled:opacity-50 ${className}`}
          title="Share Achievement"
        >
          {isGenerating ? <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Share2 className="h-4 w-4" />}
        </button>
      );
    }
    
    if (variant === 'banner') {
      return (
        <button 
          onClick={handleShareClick}
          disabled={isGenerating}
          className={`inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-bold px-4 shadow-lg transition-all disabled:opacity-50 ${className}`}
        >
          {isGenerating ? <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Share2 className="h-4 w-4" />}
          Share Certificate
        </button>
      );
    }

    return (
      <button 
        onClick={handleShareClick}
        disabled={isGenerating}
        className={`px-4 py-2 bg-[#d9f95d] hover:bg-[#b8d945] text-black rounded-lg font-bold flex items-center gap-2 transition-colors disabled:opacity-50 ${className}`}
      >
        {isGenerating ? <div className="h-4 w-4 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : <Share2 className="h-4 w-4" />}
        Share
      </button>
    );
  };

  return (
    <>
      {renderButton()}
      {certData && (
        <ShareModal 
          isOpen={modalOpen} 
          onClose={() => setModalOpen(false)} 
          certificateData={certData} 
        />
      )}
    </>
  );
}
