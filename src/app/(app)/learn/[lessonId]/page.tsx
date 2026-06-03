'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ConceptPane from '@/components/lesson/ConceptPane';
import CodeEditor from '@/components/editor/CodeEditor';
import OutputPanel from '@/components/editor/OutputPanel';
import SubmitButton from '@/components/editor/SubmitButton';
import HintDrawer from '@/components/lesson/HintDrawer';
import { 
  Flame, 
  Star, 
  Sparkles, 
  Settings, 
  ChevronRight, 
  CheckCircle2, 
  ArrowRight, 
  Trophy, 
  Award,
  Sparkle,
  LayoutDashboard,
} from 'lucide-react';
import Link from 'next/link';

interface LessonDetails {
  id: string;
  title: string;
  type: 'CONCEPT' | 'EXERCISE' | 'PROJECT';
  duration_minutes: number;
  language: string;
  content_json: any;
  starter_code?: string;
  solution_code?: string;
  test_cases_json?: any;
  xp_reward: number;
  unit: {
    title: string;
    unit_number: number;
    track: {
      title: string;
      slug: string;
    };
  };
}

interface UserStats {
  id: string;
  xp: number;
  level: number;
  streak_count: number;
}

export default function LearnLessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params?.lessonId as string;

  // Data Loading States
  const [lesson, setLesson] = useState<LessonDetails | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [previousLessonId, setPreviousLessonId] = useState<string | null>(null);
  const [nextLessonId, setNextLessonId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Workspace View States
  const [activePaneTab, setActivePaneTab] = useState<string>('concept');
  const [mobileView, setMobileView] = useState<'instructions' | 'workspace'>('instructions');

  // IDE states
  const [code, setCode] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<any[] | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // AI Mentor Drawer States
  const [isHintOpen, setIsHintOpen] = useState(false);
  const [hintNumber, setHintNumber] = useState(0);
  const [hintText, setHintText] = useState<string | undefined>(undefined);
  const [hintSnippet, setHintSnippet] = useState<string | undefined>(undefined);
  const [isHintLoading, setIsHintLoading] = useState(false);
  const [attemptsCount, setAttemptsCount] = useState(0);
  const [unlockedHints, setUnlockedHints] = useState<{ [key: number]: { text: string; snippet?: string } }>({});

  // Success Gamification Modal States
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);
  const [newStreak, setNewStreak] = useState(0);
  const [newBadges, setNewBadges] = useState<any[]>([]);

  // Save IN_PROGRESS to DB when user navigates away mid-lesson
  // This ensures "Resume Mission" on the dashboard points back to this lesson
  const saveProgressRef = useRef<{ code: string; lessonId: string } | null>(null);

  useEffect(() => {
    if (lesson && code && !isSuccessOpen) {
      saveProgressRef.current = { code, lessonId };
    }
  }, [code, lesson, lessonId, isSuccessOpen]);

  useEffect(() => {
    const saveInProgress = () => {
      const current = saveProgressRef.current;
      if (!current) return;
      // Use sendBeacon for reliable fire-and-forget on page unload
      const payload = JSON.stringify({ code: current.code });
      navigator.sendBeacon(
        `/api/lessons/${current.lessonId}/save-progress`,
        new Blob([payload], { type: 'application/json' })
      );
    };

    window.addEventListener('beforeunload', saveInProgress);
    return () => {
      window.removeEventListener('beforeunload', saveInProgress);
      // Also save on React route change (unmount)
      saveInProgress();
    };
  }, []);

  // Fetch initial lesson metadata
  useEffect(() => {
    if (!lessonId) return;

    const fetchLesson = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/lessons/${lessonId}`);
        const data = await res.json();

        if (res.ok) {
          setLesson(data.lesson);
          setUserStats(data.user);
          setPreviousLessonId(data.previousLessonId);
          setNextLessonId(data.nextLessonId);

          // Prepopulate editor with LocalStorage Autosaved code, backend progress draft, or base starter code
          const savedDraft = localStorage.getItem(`autosave_code_${lessonId}`);
          const draftCode = savedDraft || data.userProgress?.code_snapshot || data.lesson.starter_code || '';
          setCode(draftCode);
          setAttemptsCount(data.userProgress?.attempts || 0);

          // Default tab logic based on lesson type
          if (data.lesson.type === 'CONCEPT') {
            setActivePaneTab('concept');
          } else if (data.lesson.type === 'EXERCISE') {
            setActivePaneTab('exercise');
          } else if (data.lesson.type === 'PROJECT') {
            setActivePaneTab('project');
          }
        } else {
          setError(data.error || 'Failed to fetch lesson details.');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Connection lost. Could not reach execution backend.');
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

  // Clean output logs when active tab changes
  useEffect(() => {
    setOutput('');
    setError(null);
    setTestResults(null);
  }, [activePaneTab]);

  // 1. Python Local WebWorker Sandbox Execution
  const runPythonCode = (userCode: string) => {
    setIsRunning(true);
    setError(null);
    setOutput('Loading pyodide runtime...');

    // Worker code built dynamically via Blob URL
    const workerScript = `
      importScripts("https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js");
      let pyodide = null;
      
      self.onmessage = async function(e) {
        const { code } = e.data;
        try {
          if (!pyodide) {
            self.postMessage({ type: 'status', text: 'Initializing sandboxed Python engine...' });
            pyodide = await loadPyodide();
          }
          
          let stdoutBuffer = "";
          pyodide.setStdout({
            batched: (str) => {
              stdoutBuffer += str + "\\n";
            }
          });
          
          self.postMessage({ type: 'status', text: 'Running Python compiler...' });
          await pyodide.runPythonAsync(code);
          
          self.postMessage({ type: 'success', stdout: stdoutBuffer.trim() });
        } catch (err) {
          self.postMessage({ type: 'error', error: err.message });
        }
      };
    `;

    const blob = new Blob([workerScript], { type: 'application/javascript' });
    const pyWorker = new Worker(URL.createObjectURL(blob));

    pyWorker.postMessage({ code: userCode });

    pyWorker.onmessage = (e) => {
      const { type, stdout, error: pyErr, text } = e.data;
      if (type === 'status') {
        setOutput(text);
      } else if (type === 'success') {
        setOutput(stdout || 'Code ran successfully with no console outputs.');
        setIsRunning(false);
        pyWorker.terminate();
      } else if (type === 'error') {
        setError(pyErr);
        setIsRunning(false);
        pyWorker.terminate();
      }
    };
  };

  // 2. JavaScript Sandboxed Iframe Console Override Execution
  const runJavaScriptCode = (userCode: string) => {
    setIsRunning(true);
    setError(null);
    setOutput('Running local javascript interpreter...');

    const jsIframe = document.createElement('iframe');
    jsIframe.style.display = 'none';
    jsIframe.setAttribute('sandbox', 'allow-scripts');

    const logs: string[] = [];
    const errors: string[] = [];

    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.source === 'js-sandbox') {
        if (event.data.type === 'log') {
          logs.push(event.data.message);
        } else if (event.data.type === 'error') {
          errors.push(event.data.message);
        }
      }
    };

    window.addEventListener('message', handleMessage);

    const iframeDoc = `
      <!DOCTYPE html>
      <html>
      <head>
        <script>
          const log = (...args) => {
            window.parent.postMessage({ source: 'js-sandbox', type: 'log', message: args.join(' ') }, '*');
          };
          const err = (...args) => {
            window.parent.postMessage({ source: 'js-sandbox', type: 'error', message: args.join(' ') }, '*');
          };
          console.log = log;
          console.error = err;
          window.onerror = (message, source, lineno) => {
            err(message + " (Line " + lineno + ")");
            return true;
          };
        </script>
      </head>
      <body>
        <script>
          try {
            ${userCode}
          } catch(e) {
            console.error(e.message);
          }
        </script>
      </body>
      </html>
    `;

    document.body.appendChild(jsIframe);
    jsIframe.srcdoc = iframeDoc;

    // Timeout execution wrapper
    setTimeout(() => {
      window.removeEventListener('message', handleMessage);
      document.body.removeChild(jsIframe);

      if (errors.length > 0) {
        setError(errors.join('\n'));
      } else {
        setOutput(logs.join('\n') || 'Execution complete (no console.log lines).');
      }
      setIsRunning(false);
    }, 1200);
  };

  // 3. Remote Compiler Execution (C/C++ & Java) via judge0 API
  const runCompiledCode = async (userCode: string, lang: string) => {
    setIsRunning(true);
    setError(null);
    setOutput('Submitting compilation request to Judge0...');

    try {
      const res = await fetch(`/api/lessons/${lessonId}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: userCode, language: lang }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.status.id === 3) {
          setOutput(data.stdout || 'Code compiled successfully with no console stdout outputs.');
        } else {
          setError(data.compile_output || data.stderr || data.status.description || 'Execution failed.');
        }
      } else {
        setError(data.error || 'Server lost connection during compilation.');
      }
    } catch (err: any) {
      console.error(err);
      setError('Connection interrupted. Ensure internet connectivity.');
    } finally {
      setIsRunning(false);
    }
  };

  // Run triggers based on language selection
  const handleRun = () => {
    if (!lesson) return;
    const lang = lesson.language.toLowerCase();

    if (lang === 'python' || lang === 'py') {
      runPythonCode(code);
    } else if (lang === 'javascript' || lang === 'js') {
      runJavaScriptCode(code);
    } else if (['html', 'css', 'html-css'].includes(lang)) {
      setOutput('HTML preview rendered successfully in preview panel.');
      setIsRunning(false);
    } else if (['cpp', 'c++', 'c', 'java'].includes(lang)) {
      runCompiledCode(code, lang);
    } else {
      setError(`Local run execution is not yet configured for ${lesson.language}.`);
    }
  };

  // Overhaul submission
  const handleSubmit = async () => {
    if (!lesson) return;
    setIsSubmitting(true);
    setError(null);
    setTestResults(null);

    try {
      const res = await fetch(`/api/lessons/${lessonId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (res.ok) {
        setTestResults(data.results);
        const allPassed = data.results && data.results.every((r: any) => r.passed);
        
        if (allPassed) {
          const earnedXP = data.xp ? data.xp.xpEarned : data.xp_earned;
          const currentStreak = data.streak ? data.streak.streakCount : data.streak_count;
          const badgesList = data.newBadges || data.new_badges || [];

          setEarnedXp(earnedXP);
          setNewStreak(currentStreak);
          setNewBadges(badgesList);
          setIsSuccessOpen(true);
          setAttemptsCount((prev) => prev + 1);
          
          // Clear active LocalStorage drafts on complete
          localStorage.removeItem(`autosave_code_${lessonId}`);

          // Reactively update top bar stats
          setUserStats((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              xp: data.xp ? data.xp.newXP : data.new_xp,
              level: data.xp ? data.xp.newLevel : data.new_level,
              streak_count: currentStreak,
            };
          });
        } else {
          // Point user to test cases failure
          setError('Some evaluation test cases failed. Review actual output discrepancies in "Test Cases" tab.');
          setAttemptsCount((prev) => prev + 1);
        }
      } else {
        setError(data.error || 'Server error evaluating submission.');
        setAttemptsCount((prev) => prev + 1);
      }
    } catch (err: any) {
      console.error(err);
      setError('Connection interrupted during validation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset editor template
  const handleReset = () => {
    if (!lesson) return;
    if (confirm('Are you sure you want to revert to the starter code template? All typed changes will be erased.')) {
      setCode(lesson.starter_code || '');
      localStorage.removeItem(`autosave_code_${lessonId}`);
      setOutput('');
      setError(null);
      setTestResults(null);
    }
  };

  // Fetch AI Mentor Hint from route
  const handleUnlockHint = async (targetNum?: number | any) => {
    const nextNum = typeof targetNum === 'number' ? targetNum : hintNumber + 1;
    if (nextNum > 3) return;

    if (unlockedHints[nextNum]) {
      setHintText(unlockedHints[nextNum].text);
      setHintSnippet(unlockedHints[nextNum].snippet);
      setHintNumber(nextNum);
      return;
    }

    setIsHintLoading(true);
    try {
      const res = await fetch(`/api/lessons/${lessonId}/hint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code, 
          error_output: error || output || '', 
          hint_number: nextNum 
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setUnlockedHints((prev) => ({ ...prev, [nextNum]: { text: data.hint_text, snippet: data.snippet } }));
        setHintText(data.hint_text);
        setHintSnippet(data.snippet);
        setHintNumber(nextNum);
      } else {
        const errMsg = data.error || "AI Mentor is currently busy compiling logic.";
        if (hintNumber > 0 && unlockedHints[hintNumber]) {
          setHintText(`⚠️ ERROR: ${errMsg}\n\n---\n\nPREVIOUS HINT (${hintNumber}):\n${unlockedHints[hintNumber].text}`);
          setHintSnippet(unlockedHints[hintNumber].snippet);
        } else {
          setHintText(`⚠️ ${errMsg}`);
          setHintSnippet(undefined);
        }
      }
    } catch (err) {
      if (hintNumber > 0 && unlockedHints[hintNumber]) {
        setHintText(`⚠️ ERROR: Could not connect to AI Mentor.\n\n---\n\nPREVIOUS HINT (${hintNumber}):\n${unlockedHints[hintNumber].text}`);
        setHintSnippet(unlockedHints[hintNumber].snippet);
      } else {
        setHintText("⚠️ Could not connect to AI Mentor. Check your connections.");
        setHintSnippet(undefined);
      }
    } finally {
      setIsHintLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-black bg-noise flex flex-col items-center justify-center text-slate-100 font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-4 border-[#d9f95d]/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-sm font-semibold tracking-wider uppercase text-slate-400 animate-pulse">
            Configuring sandbox curriculum...
          </p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="h-screen w-screen bg-black bg-noise flex flex-col items-center justify-center text-slate-150 p-6">
        <div className="bg-transparent border-y border-white/[0.05] p-8 max-w-md text-center space-y-4">
          <h2 className="text-xl font-display font-bold tracking-wide text-rose-500">Curriculum Error</h2>
          <p className="text-sm text-slate-400">
            The requested lesson could not be located in our tracks database. Let's redirect you back safely.
          </p>
          <Link href="/dashboard" className="inline-flex h-10 items-center justify-center px-6 rounded-md bg-[#d9f95d] text-black hover:bg-[#b8d945] text-slate-950 font-bold transition-colors">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black bg-noise flex flex-col overflow-hidden text-slate-100 font-sans antialiased">
      {/* Lesson Header Navbar */}
      <header className="h-14 border-b border-slate-900 bg-black bg-noise px-4 md:px-6 flex items-center justify-between shrink-0 select-none">
        {/* Left Side: Dashboard button + Navigation Breadcrumb */}
        <div className="flex items-center gap-1.5 md:gap-3 text-xs md:text-sm font-semibold overflow-hidden whitespace-nowrap">
          {/* Dashboard quick-exit button */}
          <Link
            href="/dashboard"
            title="Back to Dashboard"
            className="shrink-0 flex items-center gap-1.5 text-slate-400 hover:text-[#d9f95d] transition-colors px-2 py-1 rounded hover:bg-white/[0.05] border border-transparent hover:border-white/[0.05]"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline text-xs font-bold">Dashboard</span>
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-700 shrink-0" />
          <Link 
            href={`/tracks/${lesson.unit.track.slug}`} 
            className="text-slate-400 hover:text-white transition-colors"
          >
            {lesson.unit.track.title}
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-600 shrink-0" />
          <span className="text-slate-400 overflow-hidden text-ellipsis max-w-[100px] md:max-w-none">
            Unit {lesson.unit.unit_number}
          </span>
          <ChevronRight className="h-3 w-3 text-slate-600 shrink-0" />
          <span className="text-slate-200 overflow-hidden text-ellipsis max-w-[120px] md:max-w-none font-bold">
            {lesson.title}
          </span>
        </div>

        {/* Right Side: Achievements and Settings */}
        <div className="flex items-center gap-2 md:gap-5 shrink-0">
          {userStats && (
            <>
              {/* Streak Count with Orange Glowing Flame */}
              <div 
                title="Current active coding streak"
                className="flex items-center gap-1.5 text-orange-400 text-xs font-display tracking-tight font-bold bg-orange-950/15 px-2 py-1 rounded border border-orange-500/10 shadow-sm"
              >
                <Flame className="h-4 w-4 fill-current animate-pulse text-orange-500" />
                <span className="hidden sm:inline">{userStats.streak_count} Days</span>
                <span className="inline sm:hidden">{userStats.streak_count}d</span>
              </div>

              {/* User XP Stats */}
              <div 
                title="Total earned XP points"
                className="flex items-center gap-1.5 text-amber-400 text-xs font-display tracking-tight font-bold bg-amber-950/15 px-2 py-1 rounded border border-amber-500/10 shadow-sm"
              >
                <Star className="h-4 w-4 fill-current text-amber-500" />
                <span>{userStats.xp}<span className="hidden sm:inline"> XP</span></span>
              </div>
            </>
          )}

          {/* AI Mentor Drawer Trigger */}
          {lesson.type !== 'CONCEPT' && (
            <button
              onClick={() => {
                setIsHintOpen(true);
                if (hintNumber === 0) handleUnlockHint(1);
              }}
              className="inline-flex h-8 items-center gap-1.5 bg-transparent border border-white/[0.05] text-white text-xs font-bold px-2 sm:px-3 hover:bg-white/[0.05] transition-all"
            >
              <Sparkles className="h-3.5 w-3.5 text-white shrink-0" />
              <span className="hidden sm:inline">Get Hint</span>
              <span className="inline sm:hidden">Hint</span>
            </button>
          )}

          {/* Settings Trigger Icon */}
          <button className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded hover:bg-[#111111] shrink-0">
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Mobile-Only Main Workspace Tab Switcher */}
      <div className="md:hidden flex border-b border-slate-900 bg-black bg-noise shrink-0">
        <button
          onClick={() => setMobileView('instructions')}
          className={`flex-1 py-3 text-center text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
            mobileView === 'instructions'
              ? 'border-emerald-500 text-[#d9f95d]'
              : 'border-transparent text-slate-500'
          }`}
        >
          Instructions
        </button>
        <button
          onClick={() => setMobileView('workspace')}
          className={`flex-1 py-3 text-center text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
            mobileView === 'workspace'
              ? 'border-emerald-500 text-[#d9f95d]'
              : 'border-transparent text-slate-500'
          }`}
        >
          Code Editor
        </button>
      </div>

      {/* Main Workspace Split-Pane Grid Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Pane - Instruction Text/Concept */}
        <div 
          className={`w-full md:w-1/2 h-full flex flex-col overflow-hidden ${
            mobileView === 'instructions' ? 'flex' : 'hidden md:flex'
          }`}
        >
          <ConceptPane
            title={lesson.title}
            contentJson={lesson.content_json}
            testCasesJson={lesson.test_cases_json}
            duration={lesson.duration_minutes}
            activeTab={activePaneTab}
            setActiveTab={setActivePaneTab}
            lessonType={lesson.type}
            previousLessonId={previousLessonId}
            nextLessonId={nextLessonId}
          />
        </div>

        {/* Right Pane - IDE, Output Console, Actions */}
        <div 
          className={`w-full md:w-1/2 h-full flex flex-col overflow-hidden bg-black bg-noise p-4 gap-4 ${
            mobileView === 'workspace' ? 'flex' : 'hidden md:flex'
          }`}
        >
          {/* Code Editor Container */}
          <div className="flex-1 min-h-[250px]">
            <CodeEditor
              language={lesson.language}
              value={code}
              onChange={(val) => setCode(val || '')}
              lessonId={lessonId}
              readOnly={isSubmitting || isRunning}
            />
          </div>

          {/* Console / Output Panel Container */}
          <div className="h-44 shrink-0">
            <OutputPanel
              output={output}
              error={error}
              isRunning={isRunning}
              testResults={testResults}
              language={lesson.language}
              code={code}
            />
          </div>

          {/* Interactive Button Bar Row */}
          <div className="shrink-0 pt-2 border-t border-slate-900">
            <SubmitButton
              onRun={handleRun}
              onSubmit={handleSubmit}
              onReset={handleReset}
              isRunning={isRunning}
              isSubmitting={isSubmitting}
              disabled={loading || lesson.type === 'CONCEPT'}
            />
          </div>
        </div>
      </div>

      {/* AI Mentor Sliding Drawer */}
      <HintDrawer
        isOpen={isHintOpen}
        onClose={() => setIsHintOpen(false)}
        hintNumber={hintNumber}
        hintText={hintText}
        hintSnippet={hintSnippet}
        language={lesson?.language}
        onUnlockNext={() => handleUnlockHint()}
        userCode={code}
        onUserCodeChange={(val) => setCode(val || '')}
      />

      {/* Immersive Celebrations success overlay modal */}
      {isSuccessOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-noise/90 p-4 animate-fade-in font-sans">
          {/* Outer Card */}
          <div className="bg-black bg-noise border-y border-[#d9f95d]/20 max-w-md w-full p-6 md:p-8 text-center space-y-6 shadow-2xl relative overflow-hidden animate-scale-up">
            {/* Glowing decorative lights */}
            <div className="absolute -top-12 -left-12 w-24 h-24 bg-[#d9f95d]/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-white/10 rounded-full blur-2xl" />

            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#d9f95d]/10 border border-[#d9f95d]/30 text-[#d9f95d]">
              <Trophy className="h-8 w-8 animate-bounce text-[#d9f95d]" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-100 tracking-tight flex items-center justify-center gap-1.5">
                <Sparkle className="h-5 w-5 text-[#d9f95d] fill-current" />
                Lesson Completed!
                <Sparkle className="h-5 w-5 text-[#d9f95d] fill-current" />
              </h2>
              <p className="text-slate-400 text-xs md:text-sm">
                Excellent coding! You solved the objective logic matching all strict test criteria.
              </p>
            </div>

            {/* Gamified Rewards */}
            <div className="grid grid-cols-2 gap-4">
              {/* Streak reward count card */}
              <div className="bg-transparent p-4 border-b border-white/[0.05] text-center flex flex-col items-center justify-center">
                <div className="flex items-center justify-center gap-1 text-orange-400 font-display tracking-tight font-bold text-lg">
                  <Flame className="h-5 w-5 fill-current text-orange-500 animate-pulse" />
                  <span>{newStreak} Days</span>
                </div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider mt-1">
                  Active Streak
                </span>
              </div>

              {/* XP reward count card */}
              <div className="bg-transparent p-4 border-b border-white/[0.05] text-center flex flex-col items-center justify-center">
                <div className="flex items-center justify-center gap-1 text-amber-400 font-display tracking-tight font-bold text-lg">
                  <Star className="h-5 w-5 fill-current text-amber-500" />
                  <span>+{earnedXp} XP</span>
                </div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider mt-1">
                  Reward Points
                </span>
              </div>
            </div>

            {/* Badges Unlocked Section */}
            {newBadges.length > 0 && (
              <div className="bg-transparent p-4 border-y border-cyan-500/10 space-y-3">
                <div className="flex items-center justify-center gap-1.5 text-white text-[10px] uppercase tracking-wider font-display tracking-tight font-bold">
                  <Award className="h-4 w-4 text-white" />
                  <span>Achievements Unlocked</span>
                </div>
                
                <div className="space-y-3.5">
                  {newBadges.map((badge, index) => (
                    <div key={index} className="flex items-center gap-3 text-left">
                      <span className="text-2xl shrink-0 p-1.5 bg-[#111111] rounded border border-white/[0.05] shadow">
                        {badge.icon_emoji}
                      </span>
                      <div>
                        <h4 className="text-xs font-display tracking-tight font-bold text-slate-100 uppercase tracking-wide">
                          {badge.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                          {badge.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Forward Actions Nav */}
            <div className="flex flex-col gap-2 pt-2">
              {nextLessonId ? (
                <button
                  onClick={() => {
                    setIsSuccessOpen(false);
                    router.push(`/learn/${nextLessonId}`);
                  }}
                  className="w-full inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-slate-950 font-black text-sm transition-all shadow-md shadow-emerald-500/10"
                >
                  <span>Go to Next Lesson</span>
                  <ArrowRight className="h-4 w-4 text-slate-950" />
                </button>
              ) : (
                <Link
                  href={`/tracks/${lesson.unit.track.slug}`}
                  className="w-full inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-slate-950 font-black text-sm transition-all shadow-md shadow-emerald-500/10"
                >
                  <span>Track Finished! Back to curriculum</span>
                  <CheckCircle2 className="h-4 w-4 text-slate-950" />
                </Link>
              )}
              
              <Link
                href="/dashboard"
                className="inline-flex h-10 items-center justify-center text-slate-400 hover:text-slate-200 text-xs font-semibold hover:bg-black bg-noise/20 rounded-md transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
