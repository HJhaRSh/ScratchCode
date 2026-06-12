import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  try {
    const resolvedParams = await params;
    const token = resolvedParams?.token;
    
    if (!token) return NextResponse.json({ error: 'Token is required' }, { status: 400 });

    const challenge = await prisma.challengeLink.findUnique({
      where: { challenge_token: token },
      include: {
        created_by: {
          select: {
            username: true,
            avatar_url: true,
          }
        },
        quest: {
          select: {
            title: true,
            difficulty: true,
            xp_reward: true,
            description: true,
            examples_json: true,
            constraints_json: true
          }
        },
        lesson: {
          select: {
            title: true,
            type: true,
            xp_reward: true,
            content_json: true
          }
        },
        attempts: {
          select: {
            status: true
          }
        }
      }
    });

    if (!challenge) return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });

    const now = new Date();
    if (!challenge.is_active || challenge.expires_at < now) {
      return NextResponse.json({ 
        challenge, 
        error: 'Challenge has expired or is inactive',
        expired: true
      });
    }

    const totalAttempts = challenge.attempts.length;
    const solvedCount = challenge.attempts.filter(a => a.status === 'SOLVED').length;

    // Check if the current user has already solved this natively or via challenge
    let hasSolvedNatively = false;
    let attemptsUsed = 0;

    const supabase = await createClient();
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();

    if (supabaseUser) {
      const prismaUser = await prisma.user.findUnique({ where: { supabase_id: supabaseUser.id } });
      if (prismaUser) {
        // Check challenge attempts
        const userChallengeAttempts = await prisma.challengeAttempt.findMany({
          where: { challenge_id: challenge.id, challenger_id: prismaUser.id }
        });
        attemptsUsed = userChallengeAttempts.length;
        if (userChallengeAttempts.some(a => a.status === 'SOLVED')) {
          hasSolvedNatively = true;
        }

        // Check native quest/lesson attempts
        if (!hasSolvedNatively && challenge.challenge_type === 'DAILY_QUEST' && challenge.quest_id) {
          const quest = await prisma.dailyQuest.findUnique({ where: { id: challenge.quest_id } });
          if (quest) {
            const nativeQuestAttempt = await prisma.userDailyQuestAttempt.findUnique({
              where: { user_id_day_number: { user_id: prismaUser.id, day_number: quest.dayNumber } }
            });
            if (nativeQuestAttempt?.status === 'SOLVED') {
              hasSolvedNatively = true;
            }
          }
        }
      }
    }

    return NextResponse.json({
      challenge: {
        ...challenge,
        stats: {
          totalAttempts,
          solvedCount
        },
        userState: {
          hasSolvedNatively,
          attemptsUsed
        }
      }
    });
  } catch (err: any) {
    console.error('Fetch challenge error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
