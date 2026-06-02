export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { awardXP } from '@/lib/xp';
import { updateStreak } from '@/lib/streaks';
import { checkAndAwardBadges } from '@/lib/badges';

interface TestCase {
  input?: string;
  expected_output: string;
}

// Map language identifiers to Judge0 CE IDs
const getJudge0LanguageId = (lang: string): number => {
  switch (lang.toLowerCase()) {
    case 'c':
      return 50;
    case 'cpp':
    case 'c++':
    case 'c-cpp':
      return 54;
    case 'java':
      return 62;
    case 'python':
    case 'py':
      return 71;
    case 'javascript':
    case 'js':
      return 63;
    default:
      return 0;
  }
};

// Safe base64 decoding helper
const decode = (b64Str: string | null | undefined): string => {
  if (!b64Str) return '';
  return Buffer.from(b64Str, 'base64').toString('utf-8');
};

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Code is required', code: 'BAD_REQUEST' },
        { status: 400 }
      );
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: resolvedParams.id },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Authenticate the user
    const supabase = await createClient();
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();

    if (!supabaseUser) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const prismaUser = await prisma.user.findUnique({
      where: { supabase_id: supabaseUser.id },
    });

    if (!prismaUser) {
      return NextResponse.json(
        { error: 'User profile not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Parse test cases
    let testCases: TestCase[] = [];
    if (lesson.test_cases_json) {
      const parsed = typeof lesson.test_cases_json === 'string'
        ? JSON.parse(lesson.test_cases_json)
        : lesson.test_cases_json;

      if (Array.isArray(parsed)) {
        testCases = parsed.map((tc) => ({
          input: tc.input || '',
          expected_output: String(tc.expected_output),
        }));
      } else if (parsed && typeof parsed === 'object') {
        if (parsed.expected_output) {
          testCases = [
            {
              input: parsed.input || '',
              expected_output: String(parsed.expected_output),
            },
          ];
        } else if (parsed.test_cases && Array.isArray(parsed.test_cases)) {
          testCases = parsed.test_cases.map((tc: any) => ({
            input: tc.input || '',
            expected_output: String(tc.expected_output),
          }));
        }
      }
    }

    // Default test case if none seeded
    if (testCases.length === 0) {
      testCases = [{ input: '', expected_output: lesson.solution_code || '' }];
    }

    const results: {
      passed: boolean;
      input?: string;
      expected?: string;
      actual?: string;
      error?: string;
    }[] = [];

    const isHTMLCSS = ['html', 'css', 'html-css'].includes(lesson.language.toLowerCase());
    let allPassed = true;

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      const trimmedExpected = tc.expected_output.trim();

      if (isHTMLCSS) {
        // String contains checking for HTML/CSS visual layouts
        const normalizedCode = code.replace(/\s+/g, ' ').trim();
        const normalizedExpected = tc.expected_output.replace(/\s+/g, ' ').trim();
        const passed = normalizedCode.toLowerCase().includes(normalizedExpected.toLowerCase());

        if (!passed) allPassed = false;
        results.push({
          passed,
          input: 'Code tags scan',
          expected: tc.expected_output,
          actual: passed ? tc.expected_output : 'Missing requested tag structures or styling elements.',
        });
      } else {
        // Use remote execution via Judge0
        const langId = getJudge0LanguageId(lesson.language);
        let passed = false;
        let actual = '';
        let errDetails = '';

        try {
          if (langId > 0) {
            const payload = {
              source_code: Buffer.from(code).toString('base64'),
              language_id: langId,
              stdin: Buffer.from(tc.input || '').toString('base64'),
            };

            const j0Res = await fetch('https://ce.judge0.com/submissions?base64_encoded=true&wait=true', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });

            if (j0Res.ok) {
              const j0Data = await j0Res.json();
              actual = decode(j0Data.stdout).trim();
              const err = decode(j0Data.stderr).trim();
              const compileErr = decode(j0Data.compile_output).trim();

              if (j0Data.status.id === 3) {
                // Check exact or subset match (contains expected output, case-insensitive)
                passed = actual.toLowerCase().includes(trimmedExpected.toLowerCase()) || 
                         trimmedExpected.toLowerCase().includes(actual.toLowerCase());
                if (!passed) {
                  errDetails = `Outputs do not match.`;
                }
              } else {
                passed = false;
                errDetails = compileErr || err || j0Data.status.description || 'Execution failed';
              }
            } else {
              throw new Error('Judge0 returned failure HTTP status');
            }
          } else {
            throw new Error(`Unsupported compiler language: ${lesson.language}`);
          }
        } catch (j0Err) {
          // Robust Fallback: String matching or simple simulation if offline or unsupported
          console.warn('Judge0 submission run failed, using local simulation fallback:', j0Err);
          // Let's check if user's code prints or executes solution
          const userCodeNormalized = code.replace(/\s+/g, '').toLowerCase();
          const expectedNormalized = trimmedExpected.replace(/\s+/g, '').toLowerCase();
          
          passed = userCodeNormalized.includes(expectedNormalized) || 
                   (lesson.solution_code && userCodeNormalized.includes(lesson.solution_code.replace(/\s+/g, '').toLowerCase())) ||
                   false;
          actual = passed ? tc.expected_output : 'Simulation output mismatch';
          errDetails = passed ? '' : 'Could not compile code remotely. Ensure correct syntax and variables.';
        }

        if (!passed) allPassed = false;
        results.push({
          passed,
          input: tc.input || 'None',
          expected: tc.expected_output,
          actual: actual || 'Empty stdout',
          error: errDetails || undefined,
        });
      }
    }

    const totalPassed = results.filter((r) => r.passed).length;

    // Gamification Updates only if ALL test cases passed
    let xpResult = null;
    let streakResult = null;
    let newBadgesList: any[] = [];

    if (allPassed) {
      // 1. Mark lesson progress as COMPLETED
      const existingProgress = await prisma.userLessonProgress.findUnique({
        where: {
          user_id_lesson_id: {
            user_id: prismaUser.id,
            lesson_id: lesson.id,
          },
        },
      });

      const alreadyCompleted = existingProgress?.status === 'COMPLETED';
      const firstAttempt = !existingProgress || existingProgress.attempts === 0;

      await prisma.userLessonProgress.upsert({
        where: {
          user_id_lesson_id: {
            user_id: prismaUser.id,
            lesson_id: lesson.id,
          },
        },
        create: {
          user_id: prismaUser.id,
          lesson_id: lesson.id,
          status: 'COMPLETED',
          attempts: 1,
          code_snapshot: code,
          completed_at: new Date(),
          xp_earned: lesson.xp_reward,
        },
        update: {
          status: 'COMPLETED',
          attempts: { increment: 1 },
          code_snapshot: code,
          completed_at: new Date(),
          xp_earned: lesson.xp_reward,
        },
      });

      // Award XP, Update Streak, and Check Badges only if this is the first time completing this lesson
      if (!alreadyCompleted) {
        xpResult = await awardXP(prismaUser.id, lesson.xp_reward, firstAttempt);
        streakResult = await updateStreak(prismaUser.id);
        newBadgesList = await checkAndAwardBadges(prismaUser.id, { lessonId: lesson.id });
      }
    } else {
      // If failed, still increment attempts and save code snapshot in database
      await prisma.userLessonProgress.upsert({
        where: {
          user_id_lesson_id: {
            user_id: prismaUser.id,
            lesson_id: lesson.id,
          },
        },
        create: {
          user_id: prismaUser.id,
          lesson_id: lesson.id,
          status: 'IN_PROGRESS',
          attempts: 1,
          code_snapshot: code,
        },
        update: {
          attempts: { increment: 1 },
          code_snapshot: code,
        },
      });
    }

    return NextResponse.json({
      passed: totalPassed,
      total: testCases.length,
      results,
      // Modern Gamification details
      xp: xpResult,
      streak: streakResult,
      newBadges: newBadgesList,
      // Backward compatibility details
      xp_earned: xpResult ? xpResult.xpEarned : 0,
      leveled_up: xpResult ? xpResult.leveledUp : false,
      new_level: xpResult ? xpResult.newLevel : prismaUser.level,
      new_xp: xpResult ? xpResult.newXP : prismaUser.xp,
      streak_count: streakResult ? streakResult.streakCount : prismaUser.streak_count,
      new_badges: newBadgesList,
    });
  } catch (err: any) {
    console.error('Submission processing failed:', err);
    return NextResponse.json(
      { error: 'Failed to submit and evaluate code', code: 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    );
  }
}
