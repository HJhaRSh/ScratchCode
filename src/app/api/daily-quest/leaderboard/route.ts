export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { getTodayDayNumber } from '@/lib/dailyQuest';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();
    if (!supabaseUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const dayNumber = getTodayDayNumber();

    const topSolvers = await prisma.userDailyQuestAttempt.findMany({
      where: {
        day_number: dayNumber,
        status: 'SOLVED'
      },
      include: {
        user: {
          select: { username: true, avatar_url: true }
        }
      },
      orderBy: [
        { first_solved_at: 'asc' }
      ],
      take: 10
    });

    return NextResponse.json({
      leaderboard: topSolvers.map((s: any) => ({
        username: s.user.username,
        avatar: s.user.avatar_url,
        xp_earned: s.xp_earned,
        language: s.language,
        time_taken: s.first_solved_at ? s.first_solved_at.getTime() - s.created_at.getTime() : 0
      }))
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
