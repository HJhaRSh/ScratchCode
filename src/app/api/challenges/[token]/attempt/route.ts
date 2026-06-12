import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { ChallengeAttemptStatus } from '@prisma/client';

const getJudge0LanguageId = (lang: string): number => {
  switch (lang.toLowerCase()) {
    case 'c': return 50;
    case 'cpp': case 'c++': case 'c-cpp': return 54;
    case 'java': return 62;
    case 'python': case 'py': return 71;
    case 'javascript': case 'js': return 63;
    default: return 0;
  }
};

const decode = (b64Str: string | null | undefined): string => {
  if (!b64Str) return '';
  return Buffer.from(b64Str, 'base64').toString('utf-8');
};

export async function POST(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  try {
    const resolvedParams = await params;
    const token = resolvedParams?.token;
    
    if (!token) return NextResponse.json({ error: 'Token is required' }, { status: 400 });

    const body = await req.json();
    const { challengerName, code, language, timeTakenSeconds } = body;

    const supabase = await createClient();
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();

    let prismaUser = null;
    if (supabaseUser) {
      prismaUser = await prisma.user.findUnique({ where: { supabase_id: supabaseUser.id } });
    }

    const challenge = await prisma.challengeLink.findUnique({
      where: { challenge_token: token },
      include: {
        quest: true,
        lesson: true,
        attempts: true
      }
    });

    if (!challenge) return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    if (!challenge.is_active || challenge.expires_at < new Date()) {
      return NextResponse.json({ error: 'Challenge expired' }, { status: 400 });
    }

    // Check attempts allowed if user is logged in
    if (prismaUser) {
      const userAttempts = challenge.attempts.filter(a => a.challenger_id === prismaUser.id).length;
      if (userAttempts >= challenge.attempts_allowed) {
        return NextResponse.json({ error: 'Max attempts reached' }, { status: 400 });
      }
    }

    // Create PENDING attempt
    const attempt = await prisma.challengeAttempt.create({
      data: {
        challenge_id: challenge.id,
        challenger_id: prismaUser ? prismaUser.id : null,
        challenger_name: prismaUser ? prismaUser.username : challengerName || 'Anonymous',
        status: 'PENDING',
        language,
        time_taken_seconds: timeTakenSeconds || 0,
      }
    });

    const langId = getJudge0LanguageId(language);
    if (!langId) return NextResponse.json({ error: 'Unsupported language' }, { status: 400 });

    let testCases: any[] = [];
    if (challenge.challenge_type === 'DAILY_QUEST' && challenge.quest) {
      testCases = (challenge.quest.test_cases_json as any[]) || [];
    } else if (challenge.challenge_type === 'LESSON' && challenge.lesson) {
      testCases = (challenge.lesson.test_cases_json as any[]) || [];
    }

    let passedTests = 0;
    let sumTime = 0;
    const testResults: any[] = [];

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      const payload = {
        source_code: Buffer.from(code).toString('base64'),
        language_id: langId,
        stdin: Buffer.from(tc.input || '').toString('base64'),
      };

      const j0Res = await fetch('https://ce.judge0.com/submissions?base64_encoded=true', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (!j0Res.ok) throw new Error('Judge0 submission failed');
      
      const { token: jToken } = await j0Res.json();

      let j0Data;
      for (let poll = 0; poll < 10; poll++) {
        await new Promise(r => setTimeout(r, 500));
        const res = await fetch(`https://ce.judge0.com/submissions/${jToken}?base64_encoded=true`);
        j0Data = await res.json();
        if (j0Data.status.id >= 3) break;
      }

      if (j0Data?.time) {
        sumTime += parseFloat(j0Data.time);
      }

      const actual = decode(j0Data?.stdout).trim();
      let err = decode(j0Data?.stderr).trim() || decode(j0Data?.compile_output).trim();
      if (!err && j0Data?.status?.id !== 3) {
        err = j0Data?.status?.description;
      }
      
      const expected = String(tc.expected_output || '').trim();
      const normalizeOutput = (str: string) => str.replace(/\s+/g, '');
      const passed = j0Data?.status?.id === 3 && normalizeOutput(actual) === normalizeOutput(expected);
      
      if (passed) passedTests++;
      
      testResults.push({
        passed,
        input: tc.input || 'None',
        expected,
        actual: actual || 'Empty stdout',
        error: passed ? undefined : err
      });
    }

    const totalTests = testCases.length;
    let finalStatus: ChallengeAttemptStatus = 'FAILED';
    if (passedTests === totalTests && totalTests > 0) finalStatus = 'SOLVED';

    const actualTimeTaken = timeTakenSeconds ? timeTakenSeconds : Math.round(sumTime);
    let xpEarned = 0;

    if (finalStatus === 'SOLVED' && prismaUser) {
      xpEarned = challenge.quest ? challenge.quest.xp_reward : (challenge.lesson ? challenge.lesson.xp_reward : 50);
      
      // Bonus XP for challenge
      xpEarned += 20;

      const newXP = prismaUser.xp + xpEarned;
      const newLevel = newXP >= 5000 ? 4 : newXP >= 2000 ? 3 : newXP >= 500 ? 2 : 1;

      await prisma.user.update({
        where: { id: prismaUser.id },
        data: { 
          xp: newXP,
          level: newLevel
        }
      });

      // Sync with Daily Quest Leaderboard
      if (challenge.challenge_type === 'DAILY_QUEST' && challenge.quest) {
        const existingAttempt = await prisma.userDailyQuestAttempt.findUnique({
          where: { user_id_day_number: { user_id: prismaUser.id, day_number: challenge.quest.dayNumber } }
        });
        
        if (!existingAttempt) {
          await prisma.userDailyQuestAttempt.create({
            data: {
              user_id: prismaUser.id,
              quest_id: challenge.quest.id,
              day_number: challenge.quest.dayNumber,
              status: 'SOLVED',
              language,
              submitted_code: code,
              passed_tests: passedTests,
              total_tests: totalTests,
              xp_earned: xpEarned,
              attempts_count: 1,
              first_solved_at: new Date()
            }
          });
        } else if (existingAttempt.status !== 'SOLVED') {
          await prisma.userDailyQuestAttempt.update({
            where: { id: existingAttempt.id },
            data: {
              status: 'SOLVED',
              submitted_code: code,
              passed_tests: totalTests,
              xp_earned: existingAttempt.xp_earned + xpEarned,
              attempts_count: existingAttempt.attempts_count + 1,
              first_solved_at: new Date()
            }
          });
        }
      }
    }

    const updatedAttempt = await prisma.challengeAttempt.update({
      where: { id: attempt.id },
      data: {
        status: finalStatus,
        time_taken_seconds: actualTimeTaken,
        xp_earned: xpEarned,
        completed_at: new Date()
      }
    });

    // Calculate rank
    const allAttempts = await prisma.challengeAttempt.findMany({
      where: { challenge_id: challenge.id, status: 'SOLVED' },
      orderBy: { time_taken_seconds: 'asc' }
    });

    let rank = null;
    if (finalStatus === 'SOLVED') {
      const idx = allAttempts.findIndex(a => a.id === updatedAttempt.id);
      rank = idx >= 0 ? idx + 1 : allAttempts.length + 1;
    }
    
    // Calculate total attempts for this user now
    let attemptCount = 1;
    if (prismaUser) {
       attemptCount = await prisma.challengeAttempt.count({
          where: { challenge_id: challenge.id, challenger_id: prismaUser.id }
       });
    }

    return NextResponse.json({
      status: finalStatus,
      timeTaken: actualTimeTaken,
      passedTests,
      totalTests,
      testResults,
      attemptCount,
      rank,
      xpEarned
    });

  } catch (err: any) {
    console.error('Challenge attempt error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
