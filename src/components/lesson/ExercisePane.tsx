'use client';

import React from 'react';
import { Target, List, CheckSquare, Lightbulb, ClipboardList, BookOpen } from 'lucide-react';
import StaticCodeBox from '@/components/ui/StaticCodeBox';

interface ExercisePaneProps {
  contentJson: any;
  lessonType: 'CONCEPT' | 'EXERCISE' | 'PROJECT';
  testCasesJson?: any;
}

export default function ExercisePane({ contentJson, lessonType, testCasesJson }: ExercisePaneProps) {
  const sections: any[] = Array.isArray(contentJson?.sections) ? contentJson.sections : [];

  // ── Strategy 1: explicit { type: 'exercise' | 'project' } section ────────
  const exerciseSection = sections.find((s: any) => s.type === 'exercise' || s.type === 'project');

  // ── Strategy 2: List sections (bulleted steps) ───────────────────────────
  // For PROJECT: list items after "Project Brief" heading
  // For EXERCISE: any list items in the content
  const projectBriefIdx = sections.findIndex(
    (s: any) => s.type === 'heading' && (
      s.text === 'Project Brief' ||
      s.text?.toLowerCase().includes('brief') ||
      s.text?.toLowerCase().includes('project brief')
    )
  );

  // Get list sections: prefer those after "Project Brief" heading for projects
  const listSections = sections.filter((s: any, idx: number) => {
    if (s.type !== 'list') return false;
    if (lessonType === 'PROJECT' && projectBriefIdx !== -1) return idx > projectBriefIdx;
    return true;
  });
  const allListSteps: string[] = listSections.flatMap((s: any) => s.items || []);

  // ── Strategy 3: paragraph content as description ─────────────────────────
  const paragraphs = sections.filter((s: any) => s.type === 'paragraph').map((s: any) => s.text || '');
  const mainParagraph = paragraphs[0] || '';

  // ── Strategy 4: test_cases as step prompts ───────────────────────────────
  let testCases: any[] = [];
  try {
    const tc = typeof testCasesJson === 'string' ? JSON.parse(testCasesJson) : testCasesJson;
    if (Array.isArray(tc)) testCases = tc;
    else if (Array.isArray(tc?.test_cases)) testCases = tc.test_cases;
  } catch {}

  // ── Build steps from exercise section description ─────────────────────────
  let stepsFromDesc: string[] = [];
  if (exerciseSection?.description) {
    stepsFromDesc = exerciseSection.description
      .split('\n')
      .filter((l: string) => l.trim())
      .map((l: string) => l.replace(/^\d+\.\s*/, '').trim())
      .filter((l: string) => l.length > 0);
  }

  // ── Final resolved values ─────────────────────────────────────────────────
  const isProject = lessonType === 'PROJECT';
  const title =
    exerciseSection?.title ||
    (isProject ? 'Project Brief' : 'Exercise Goal');

  // Pick the best step source
  const steps: string[] =
    exerciseSection?.steps?.length     ? exerciseSection.steps :
    stepsFromDesc.length               ? stepsFromDesc :
    allListSteps.length                ? allListSteps :
    [];

  const description =
    (exerciseSection?.description && !stepsFromDesc.length)
      ? exerciseSection.description
      : '';

  const hint =
    exerciseSection?.hint ||
    sections.find((s: any) => s.type === 'callout' && s.variant === 'tip')?.text ||
    '';

  // Expected output code block (Python/JS comments or HTML)
  const outputCodeBlock = sections.find((s: any) =>
    s.type === 'code_block' && (
      s.code?.includes('# Expected') ||
      s.code?.includes('// Expected') ||
      s.code?.includes('Expected Output') ||
      s.code?.includes('Expected output')
    )
  );

  // ── Derive test_case steps if we truly have no other steps ───────────────
  const tcSteps: string[] = testCases.map((tc: any) => {
    if (tc.type === 'dom_exists')      return `Your page must contain a <${tc.selector}> element${tc.hint ? ` — ${tc.hint}` : ''}`;
    if (tc.type === 'output_contains') return `Output must contain: "${tc.value}"`;
    if (tc.type === 'line_count')      return `Produce at least ${tc.min} lines of output`;
    return tc.hint || tc.description || tc.type;
  });

  const finalSteps = steps.length > 0 ? steps : (testCases.length > 0 && !description ? tcSteps : []);

  // If we have absolutely nothing to show, render a graceful fallback
  const hasNothing = finalSteps.length === 0 && !description && !mainParagraph && testCases.length === 0;

  // ── Color palette ─────────────────────────────────────────────────────────
  const accentColor   = isProject ? 'text-violet-400'  : 'text-emerald-400';
  const borderColor   = isProject ? 'border-violet-500/20' : 'border-emerald-500/20';
  const badgeCls      = isProject
    ? 'bg-violet-500/10 border-violet-500/20 text-violet-300'
    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300';
  const stepNumCls    = isProject
    ? 'border-violet-500/30 text-violet-300 bg-violet-500/10'
    : 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10';

  if (hasNothing) {
    // Last-resort: just show the concept content as the task description
    return (
      <div className="flex flex-col gap-5 text-slate-100 font-sans">
        <div className={`border-b pb-5 space-y-3 ${borderColor}`}>
          <div className={`flex items-center gap-2 ${accentColor}`}>
            <Target className="h-5 w-5" />
            <h3 className="font-bold text-sm uppercase tracking-wider">
              {isProject ? 'Project Goal' : 'Exercise Goal'}
            </h3>
            <span className={`ml-auto text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${badgeCls}`}>
              {lessonType}
            </span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            Complete the exercise in the code editor on the right. Use the starter code as a guide and click <strong className="text-slate-300">Submit Code</strong> when done.
          </p>
        </div>
        <QuickTips isProject={isProject} accentColor={accentColor} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 text-slate-100 font-sans">

      {/* ── Header ── */}
      <div className={`border-b pb-5 space-y-3 ${borderColor}`}>
        <div className={`flex items-center gap-2 ${accentColor}`}>
          <Target className="h-5 w-5" />
          <h3 className="font-bold text-sm uppercase tracking-wider">
            {isProject ? 'Project Goal' : 'Exercise Goal'}
          </h3>
          <span className={`ml-auto text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${badgeCls}`}>
            {lessonType}
          </span>
        </div>
        <h4 className="font-bold text-slate-100 text-base tracking-tight leading-snug">{title}</h4>

        {/* Paragraph description (when no numbered steps) */}
        {description && !finalSteps.length && (
          <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">{description}</p>
        )}

        {/* Paragraph from concept (HTML/CSS style lessons with no explicit exercise block) */}
        {!description && !finalSteps.length && mainParagraph && (
          <p className="text-slate-400 text-sm leading-relaxed">{mainParagraph}</p>
        )}
      </div>

      {/* ── Numbered Steps ── */}
      {finalSteps.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <List className="h-4 w-4" />
            {steps.length > 0 ? 'Steps to complete' : 'Requirements'}
          </div>
          <ol className="space-y-2">
            {finalSteps.map((step: string, i: number) => (
              <li key={i} className="flex items-start gap-3 group">
                <span className={`shrink-0 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${stepNumCls}`}>
                  {i + 1}
                </span>
                <span className="text-slate-300 text-sm leading-relaxed group-hover:text-slate-200 transition-colors">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* ── Expected Output Block ── */}
      {outputCodeBlock && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <ClipboardList className="h-4 w-4" />
            Expected Output
          </div>
          <StaticCodeBox code={outputCodeBlock.code} language={outputCodeBlock.language || 'text'} />
        </div>
      )}

      {/* ── Hint ── */}
      {hint && (
        <div className="flex items-start gap-3 bg-amber-500/5 border border-amber-500/15 rounded-lg px-4 py-3">
          <Lightbulb className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">Hint</p>
            <p className="text-sm text-amber-200/80 leading-relaxed">{hint}</p>
          </div>
        </div>
      )}

      {/* ── Test Cases (when steps were NOT already derived from them) ── */}
      {testCases.length > 0 && steps.length > 0 && (
        <div className="space-y-2 border-t border-white/[0.05] pt-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <CheckSquare className="h-4 w-4 text-cyan-400" />
            Evaluation Criteria ({testCases.length} check{testCases.length > 1 ? 's' : ''})
          </div>
          <ul className="space-y-1.5">
            {testCases.map((tc: any, i: number) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-slate-400">
                <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-cyan-500/60 mt-1.5" />
                <span>
                  {tc.type === 'output_contains' && <>Output must contain: <code className="text-cyan-300 font-mono bg-slate-900/80 px-1.5 py-0.5 rounded">{tc.value}</code></>}
                  {tc.type === 'dom_exists' && <>Page must have a <code className="text-cyan-300 font-mono bg-slate-900/80 px-1.5 py-0.5 rounded">&lt;{tc.selector}&gt;</code> element{tc.hint ? ` — ${tc.hint}` : ''}</>}
                  {tc.type === 'line_count' && <>Produce at least <code className="text-cyan-300 font-mono bg-slate-900/80 px-1.5 py-0.5 rounded">{tc.min}</code> lines of output</>}
                  {!['output_contains', 'dom_exists', 'line_count'].includes(tc.type) && (tc.hint || tc.description || tc.type)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Quick Tips ── */}
      <QuickTips isProject={isProject} accentColor={accentColor} />
    </div>
  );
}

function QuickTips({ isProject, accentColor }: { isProject: boolean; accentColor: string }) {
  return (
    <div className="border-t border-dashed border-white/[0.05] pt-4 space-y-2 text-xs text-slate-500">
      <div className="flex items-center gap-1.5 font-semibold text-slate-400">
        <BookOpen className="h-4 w-4 text-cyan-400" />
        Quick Tips:
      </div>
      <ul className="list-disc pl-5 space-y-1">
        <li>Click <strong className="text-slate-300">Run Code</strong> to test your output as you go.</li>
        <li>Click <strong className={accentColor}>Submit Code</strong> when ready to evaluate.</li>
        <li>Tap <strong className="text-slate-300">Get Hint</strong> in the top bar if you are stuck.</li>
      </ul>
    </div>
  );
}
