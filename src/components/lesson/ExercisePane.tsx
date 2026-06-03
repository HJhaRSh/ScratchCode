'use client';

import React from 'react';
import { Target, List } from 'lucide-react';

interface ExercisePaneProps {
  taskDescription: string;
  expectedOutput?: string;
  starterCode?: string;
}

export default function ExercisePane({ taskDescription, expectedOutput, starterCode }: ExercisePaneProps) {
  // Check if the description contains a title and description separated by \n\n
  const parts = taskDescription.split('\n\n');
  const hasTitle = parts.length > 1;
  const title = hasTitle ? parts[0] : null;
  const description = hasTitle ? parts.slice(1).join('\n\n') : taskDescription;

  return (
    <div className="flex flex-col gap-6 text-slate-100 font-sans">
      <div className="border-b border-white/[0.05] pb-5 space-y-3">
        <div className="flex items-center gap-2 text-emerald-400">
          <Target className="h-5 w-5" />
          <h3 className="font-bold text-sm uppercase tracking-wider">Exercise Goal</h3>
        </div>
        <div className="space-y-2">
          {title && <h4 className="font-bold text-slate-200 text-sm tracking-wide">{title}</h4>}
          <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">{description}</p>
        </div>
      </div>

      {expectedOutput && (
        <div className="border-b border-white/[0.05] pb-5 space-y-2">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Expected Console Output:</h4>
          <pre className="bg-transparent p-4 border border-white/[0.05] font-mono text-cyan-400 text-xs whitespace-pre-wrap">
            {expectedOutput}
          </pre>
        </div>
      )}

      <div className="border-y border-dashed border-white/[0.05] py-5 space-y-2 text-xs text-slate-400">
        <div className="flex items-center gap-1.5 font-semibold text-slate-300">
          <List className="h-4 w-4 text-cyan-400" />
          Quick Instructions:
        </div>
        <ul className="list-disc pl-5 space-y-1">
          <li>Do not modify the helper function structures unless instructed.</li>
          <li>Ensure strings match casing exactly as requested.</li>
          <li>Click <strong className="text-slate-200">Run Code</strong> to test your outputs during scripting.</li>
          <li>Click <strong className="text-emerald-400">Submit Code</strong> when you are ready to evaluate against test cases.</li>
        </ul>
      </div>
    </div>
  );
}
