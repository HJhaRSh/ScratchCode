export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import Groq from 'groq-sdk';
import { checkAndAwardBadges } from '@/lib/badges';

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

export async function POST(req: NextRequest) {
  try {
    const { dayNumber, code, language } = await req.json();

    const supabase = await createClient();
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();
    if (!supabaseUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const prismaUser = await prisma.user.findUnique({ where: { supabase_id: supabaseUser.id } });
    if (!prismaUser) return NextResponse.json({ error: 'User profile not found' }, { status: 404 });

    const quest = await prisma.dailyQuest.findUnique({ where: { dayNumber } });
    if (!quest) return NextResponse.json({ error: 'Quest not found' }, { status: 404 });

    let attempt = await prisma.userDailyQuestAttempt.findUnique({
      where: { user_id_day_number: { user_id: prismaUser.id, day_number: dayNumber } }
    });

    if (attempt?.status === 'SOLVED') {
      return NextResponse.json({ error: 'Already solved' }, { status: 400 });
    }

    const langId = getJudge0LanguageId(language);
    if (!langId) return NextResponse.json({ error: 'Unsupported language' }, { status: 400 });

    const testCases: any[] = (quest.test_cases_json as any[]) || [];
    let passedTests = 0;
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
      
      if (!j0Res.ok) {
        throw new Error('Judge0 submission failed');
      }
      
      const { token } = await j0Res.json();

      let j0Data;
      for (let poll = 0; poll < 10; poll++) {
        await new Promise(r => setTimeout(r, 500));
        const res = await fetch(`https://ce.judge0.com/submissions/${token}?base64_encoded=true`);
        j0Data = await res.json();
        if (j0Data.status.id >= 3) break;
      }

      const actual = decode(j0Data?.stdout).trim();
      let err = decode(j0Data?.stderr).trim() || decode(j0Data?.compile_output).trim();
      
      if (!err && j0Data?.status?.id !== 3) {
        err = j0Data?.status?.description;
      }

      const expected = String(tc.expected_output || '').trim();

      // Strict matching but ignoring whitespaces to prevent formatting issues (e.g. spaces in arrays)
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
    let status: 'SOLVED' | 'ATTEMPTED' | 'FAILED' = 'FAILED';
    if (passedTests === totalTests && totalTests > 0) status = 'SOLVED';
    else if (passedTests >= 5) status = 'ATTEMPTED';

    let xpEarned = 0;
    let bonusEarned = null;
    let aiFeedback = null;

    if (status === 'SOLVED') {
      xpEarned = quest.xp_reward;
      let currentStreak = 1;
      
      const streak = await prisma.dailyQuestStreak.findUnique({ where: { user_id: prismaUser.id } });
      const now = new Date();
      if (streak) {
        if (streak.last_solved_date) {
          const lastDate = new Date(streak.last_solved_date);
          const diffDays = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
          if (diffDays === 1) {
            currentStreak = streak.current_streak + 1;
          } else if (diffDays > 1) {
            currentStreak = 1;
          } else {
            currentStreak = streak.current_streak;
          }
        }
        
        await prisma.dailyQuestStreak.update({
          where: { user_id: prismaUser.id },
          data: {
            current_streak: currentStreak,
            longest_streak: Math.max(streak.longest_streak, currentStreak),
            last_solved_date: now,
            total_solved: streak.total_solved + 1,
          }
        });
      } else {
        await prisma.dailyQuestStreak.create({
          data: {
            user_id: prismaUser.id,
            current_streak: 1,
            longest_streak: 1,
            last_solved_date: now,
            total_solved: 1,
          }
        });
      }

      if (currentStreak > 1) {
        const bonus = Math.min(currentStreak * 5, 50);
        bonusEarned = { type: 'streak', value: bonus, description: `Streak bonus x${currentStreak}` };
        xpEarned += bonus;
      }
      
      const newXP = prismaUser.xp + xpEarned;
      const newLevel = newXP >= 5000 ? 4 : newXP >= 2000 ? 3 : newXP >= 500 ? 2 : 1;

      await prisma.user.update({
        where: { id: prismaUser.id },
        data: { 
          xp: newXP,
          level: newLevel
        }
      });

      if (process.env.GROQ_API_KEY) {
        try {
          const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
          const aiResponse = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            max_tokens: 1000,
            response_format: { type: 'json_object' },
            messages: [
              {
                role: "system",
                content: "You are an expert competitive programmer and coding mentor.\nAnalyze the submitted solution and provide structured feedback."
              },
              {
                role: "user",
                content: `Problem: ${quest.title}\nLanguage: ${language}\nUser's Solution:\n${code}\n\nThe solution passed all test cases.\n\nProvide a JSON response with this exact structure:\n{\n  "codeQuality": {\n    "score": number,\n    "strengths": ["..."],\n    "improvements": ["..."]\n  },\n  "complexity": {\n    "userTimeComplexity": "O(...)",\n    "userSpaceComplexity": "O(...)",\n    "isOptimal": boolean\n  },\n  "betterApproach": {\n    "exists": boolean,\n    "name": "...",\n    "whyBetter": "...",\n    "timeComplexity": "O(...)"\n  },\n  "tips": ["..."],\n  "verdict": "optimal" | "good" | "can_improve"\n}\nReturn ONLY the JSON, no markdown.`
              }
            ]
          });
          if (aiResponse.choices[0]?.message?.content) {
            aiFeedback = JSON.parse(aiResponse.choices[0].message.content);
          }
        } catch(e) {
          console.error('Groq Error', e);
        }
      }

      await checkAndAwardBadges(prismaUser.id, { lessonId: "daily_quest" } as any);
    }

    if (!attempt) {
      attempt = await prisma.userDailyQuestAttempt.create({
        data: {
          user_id: prismaUser.id,
          quest_id: quest.id,
          day_number: dayNumber,
          status,
          language,
          submitted_code: code,
          passed_tests: passedTests,
          total_tests: totalTests,
          xp_earned: xpEarned,
          bonus_earned_json: bonusEarned ? (bonusEarned as any) : null,
          ai_feedback_json: aiFeedback ? (aiFeedback as any) : null,
          attempts_count: 1,
          first_solved_at: status === 'SOLVED' ? new Date() : null,
        }
      });
    } else {
      attempt = await prisma.userDailyQuestAttempt.update({
        where: { id: attempt.id },
        data: {
          status,
          language,
          submitted_code: code,
          passed_tests: Math.max(attempt.passed_tests, passedTests),
          total_tests: totalTests,
          xp_earned: attempt.xp_earned + xpEarned,
          bonus_earned_json: bonusEarned ? (bonusEarned as any) : attempt.bonus_earned_json,
          ai_feedback_json: aiFeedback ? (aiFeedback as any) : attempt.ai_feedback_json,
          attempts_count: attempt.attempts_count + 1,
          first_solved_at: status === 'SOLVED' && !attempt.first_solved_at ? new Date() : attempt.first_solved_at,
        }
      });
    }

    return NextResponse.json({
      status,
      passedTests,
      totalTests,
      testResults,
      xpEarned,
      bonusEarned,
      aiFeedback,
      solutionApproaches: status === 'SOLVED' ? quest.solution_approaches_json : null
    });

  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
