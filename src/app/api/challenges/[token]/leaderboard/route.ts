import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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
            id: true,
            username: true,
            avatar_url: true
          }
        }
      }
    });

    if (!challenge) return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });

    const attempts = await prisma.challengeAttempt.findMany({
      where: { challenge_id: challenge.id },
      include: {
        challenger: {
          select: {
            username: true,
            avatar_url: true
          }
        }
      }
    });

    // Check if creator has a challenge attempt
    const creatorHasAttempt = attempts.some(a => a.challenger_id === challenge.created_by.id);

    if (!creatorHasAttempt) {
      if (challenge.challenge_type === 'DAILY_QUEST' && challenge.quest_id) {
        const quest = await prisma.dailyQuest.findUnique({ where: { id: challenge.quest_id } });
        if (quest) {
          const nativeAttempt = await prisma.userDailyQuestAttempt.findUnique({
            where: { user_id_day_number: { user_id: challenge.created_by.id, day_number: quest.dayNumber } }
          });
          if (nativeAttempt && nativeAttempt.status === 'SOLVED') {
            attempts.push({
              id: 'native-' + nativeAttempt.id,
              challenge_id: challenge.id,
              challenger_id: challenge.created_by.id,
              challenger_name: challenge.created_by.username,
              challenger: challenge.created_by,
              status: 'SOLVED',
              time_taken_seconds: null,
              language: nativeAttempt.language,
              xp_earned: nativeAttempt.xp_earned,
              completed_at: nativeAttempt.first_solved_at || nativeAttempt.created_at,
              created_at: nativeAttempt.created_at
            } as any);
          }
        }
      } else if (challenge.challenge_type === 'LESSON' && challenge.lesson_id) {
        const progress = await prisma.userLessonProgress.findUnique({
          where: { user_id_lesson_id: { user_id: challenge.created_by.id, lesson_id: challenge.lesson_id } }
        });
        if (progress && progress.status === 'COMPLETED') {
          attempts.push({
            id: 'native-' + progress.id,
            challenge_id: challenge.id,
            challenger_id: challenge.created_by.id,
            challenger_name: challenge.created_by.username,
            challenger: challenge.created_by,
            status: 'SOLVED',
            time_taken_seconds: null,
            language: 'unknown',
            xp_earned: progress.xp_earned,
            completed_at: progress.completed_at || null,
            created_at: progress.completed_at || new Date()
          } as any);
        }
      }
    }

    // Sort in memory to guarantee SOLVED first, then time_taken_seconds ascending
    attempts.sort((a, b) => {
      if (a.status === 'SOLVED' && b.status !== 'SOLVED') return -1;
      if (a.status !== 'SOLVED' && b.status === 'SOLVED') return 1;
      
      if (a.status === 'SOLVED' && b.status === 'SOLVED') {
        const timeA = a.time_taken_seconds || Infinity;
        const timeB = b.time_taken_seconds || Infinity;
        return timeA - timeB;
      }
      
      return 0; // maintain original order for others
    });

    // Map attempts to match UI expectation for row.username
    const formattedLeaderboard = attempts.map(a => ({
      ...a,
      username: (a as any).challenger?.username || a.challenger_name || 'Anonymous'
    }));

    return NextResponse.json({ leaderboard: formattedLeaderboard });
  } catch (err: any) {
    console.error('Fetch leaderboard error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
