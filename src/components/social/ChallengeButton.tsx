'use client';

import React, { useState } from 'react';
import { Swords } from 'lucide-react';
import ChallengeModal from './ChallengeModal';

interface ChallengeButtonProps {
  lessonId?: string;
  questId?: string;
  title: string;
  className?: string;
  variant?: 'button' | 'icon';
}

export default function ChallengeButton({ lessonId, questId, title, className = '', variant = 'button' }: ChallengeButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {variant === 'button' ? (
        <button
          onClick={() => setModalOpen(true)}
          className={`px-4 py-2 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-400 rounded-lg font-bold flex items-center gap-2 transition-colors ${className}`}
        >
          <Swords className="h-4 w-4" />
          Challenge Friend
        </button>
      ) : (
        <button
          onClick={() => setModalOpen(true)}
          className={`p-2 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-colors ${className}`}
          title="Challenge a Friend"
        >
          <Swords className="h-5 w-5" />
        </button>
      )}

      <ChallengeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        lessonId={lessonId}
        questId={questId}
        title={title}
      />
    </>
  );
}
