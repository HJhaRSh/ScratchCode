'use client';

import React from 'react';
import { BookOpen, HelpCircle, Code, ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import ExercisePane from './ExercisePane';
import StaticCodeBox from '@/components/ui/StaticCodeBox';

interface ContentSection {
  type: 'paragraph' | 'heading' | 'code_block' | 'callout' | 'list';
  text?: string;
  language?: string;
  code?: string;
  variant?: 'info' | 'warning' | 'tip';
  items?: string[];
}

interface ConceptPaneProps {
  title: string;
  contentJson: any;
  testCasesJson?: any;
  duration: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lessonType: 'CONCEPT' | 'EXERCISE' | 'PROJECT';
  previousLessonId: string | null;
  nextLessonId: string | null;
}

export default function ConceptPane({
  title,
  contentJson,
  testCasesJson,
  duration,
  activeTab,
  setActiveTab,
  lessonType,
  previousLessonId,
  nextLessonId,
}: ConceptPaneProps) {
  // Safe extraction of instructions/prompts
  const prompt = contentJson?.prompt || '';
  const instructions = contentJson?.instructions || '';
  const taskDescription = instructions 
    ? `${prompt}\n\n${instructions}`
    : prompt || 'No instructions provided for this lesson.';

  // Safe extraction of expected console output
  let expectedOutput = '';
  if (testCasesJson) {
    try {
      const tc = typeof testCasesJson === 'string' ? JSON.parse(testCasesJson) : testCasesJson;
      expectedOutput = tc.expected_output || tc.expected || (tc.test_cases?.[0]?.expected_output) || '';
    } catch {
      expectedOutput = '';
    }
  }

  // Determine which tabs are relevant
  const showExerciseTab = lessonType === 'EXERCISE';
  const showProjectTab = lessonType === 'PROJECT';

  // Helper to render inline code safely
  const renderParagraphText = (text: string) => {
    if (!text) return null;
    const parts = text.split(/`([^`]+)`/g);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return (
          <code key={index} className="bg-slate-900 border border-slate-800 text-pink-400 px-1.5 py-0.5 rounded text-xs font-mono">
            {part}
          </code>
        );
      }
      return part;
    });
  };

  const parseTextWithCodeBlocks = (text: string) => {
    if (!text) return null;
    const blocks = text.split(/```/g);
    return blocks.map((block, index) => {
      // Even index means it's regular text
      if (index % 2 === 0) {
        if (!block.trim()) return null;
        return (
          <div key={index} className="space-y-4">
            {block.trim().split('\n\n').map((p, i) => (
              <p key={i}>{renderParagraphText(p)}</p>
            ))}
          </div>
        );
      } else {
        // Odd index means it's a code block
        // First line is language, rest is code
        const firstNewline = block.indexOf('\n');
        const lang = firstNewline !== -1 ? block.slice(0, firstNewline).trim() : 'code';
        const code = firstNewline !== -1 ? block.slice(firstNewline + 1).trim() : block.trim();
        return (
          <StaticCodeBox key={index} code={code} language={lang} />
        );
      }
    });
  };

  // Render the structured concept sections
  const renderConceptContent = () => {
    if (!contentJson) return null;

    // Handle standard database seed format: intro & body
    if (contentJson.intro || contentJson.body) {
      return (
        <div className="space-y-5 text-slate-300 leading-relaxed">
          {contentJson.intro && (
            <div className="py-4 border-b border-white/[0.05] text-slate-200 font-medium">
              {renderParagraphText(contentJson.intro)}
            </div>
          )}
          {contentJson.body && (
            <div className="space-y-4">
              {parseTextWithCodeBlocks(contentJson.body)}
            </div>
          )}
        </div>
      );
    }

    // Handle rich sections format
    if (Array.isArray(contentJson.sections)) {
      return (
        <div className="space-y-5 text-slate-300 leading-relaxed">
          {contentJson.sections.map((section: ContentSection, idx: number) => {
            switch (section.type) {
              case 'heading':
                return (
                  <h3 key={idx} className="text-lg font-bold text-slate-100 mt-6 mb-2 border-b border-slate-900 pb-1">
                    {section.text}
                  </h3>
                );
              case 'paragraph':
                return <p key={idx}>{renderParagraphText(section.text || '')}</p>;
              case 'code_block':
                return (
                  <StaticCodeBox key={idx} code={section.code || ''} language={section.language || 'code'} />
                );
              case 'callout':
                const variantStyles = {
                  info: 'border-cyan-500/20 text-cyan-200',
                  warning: 'border-amber-500/20 text-amber-200',
                  tip: 'border-emerald-500/20 text-emerald-200',
                };
                return (
                  <div
                    key={idx}
                    className={`py-4 border-y border-white/[0.05] text-sm flex gap-3 ${
                      variantStyles[section.variant || 'info']
                    }`}
                  >
                    <HelpCircle className="h-5 w-5 shrink-0 text-cyan-400" />
                    <div>{renderParagraphText(section.text || '')}</div>
                  </div>
                );
              case 'list':
                return (
                  <ul key={idx} className="list-disc pl-6 space-y-2">
                    {section.items?.map((item: string, i: number) => (
                      <li key={i}>{renderParagraphText(item)}</li>
                    ))}
                  </ul>
                );
              default:
                return null;
            }
          })}
        </div>
      );
    }

    return <p className="text-slate-400 italic">No conceptual content available.</p>;
  };

  return (
    <div className="flex flex-col h-full bg-transparent text-slate-100 overflow-hidden border-r border-white/[0.05]">
      {/* Tab Navigation Bar */}
      <div className="flex border-b border-white/[0.05] bg-transparent px-4 shrink-0">
        <button
          onClick={() => setActiveTab('concept')}
          className={`flex items-center gap-2 px-4 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'concept'
              ? 'border-emerald-500 text-emerald-400 font-extrabold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          Concept
        </button>

        {showExerciseTab && (
          <button
            onClick={() => setActiveTab('exercise')}
            className={`flex items-center gap-2 px-4 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'exercise'
                ? 'border-emerald-500 text-emerald-400 font-extrabold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="h-4 w-4" />
            Exercise
          </button>
        )}

        {showProjectTab && (
          <button
            onClick={() => setActiveTab('project')}
            className={`flex items-center gap-2 px-4 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'project'
                ? 'border-emerald-500 text-emerald-400 font-extrabold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="h-4 w-4" />
            Project
          </button>
        )}
      </div>

      {/* Dynamic Tab Body content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {activeTab === 'concept' ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.05]">
              <h2 className="text-xl font-extrabold tracking-tight text-slate-100">{title}</h2>
              <span className="text-[10px] bg-transparent text-slate-400 px-2 py-1 rounded border border-white/[0.05] font-semibold uppercase tracking-wider">
                ⏱️ {duration} mins read
              </span>
            </div>
            {renderConceptContent()}
          </div>
        ) : (
          <ExercisePane
            taskDescription={taskDescription}
            expectedOutput={expectedOutput}
          />
        )}
      </div>

      {/* Fixed footer for adjacent lesson navigation */}
      <div className="p-4 bg-transparent border-t border-white/[0.05] flex justify-between gap-4 shrink-0">
        {previousLessonId ? (
          <Link
            href={`/learn/${previousLessonId}`}
            className="flex-1 inline-flex h-9 items-center justify-center gap-1.5 rounded bg-slate-900 hover:bg-slate-805 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Prev Lesson
          </Link>
        ) : (
          <div className="flex-1" />
        )}

        {nextLessonId ? (
          <Link
            href={`/learn/${nextLessonId}`}
            className="flex-1 inline-flex h-9 items-center justify-center gap-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold transition-colors shadow-md shadow-emerald-500/5"
          >
            Next Lesson
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </div>
  );
}
