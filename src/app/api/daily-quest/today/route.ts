export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { getTodayDayNumber, getTimeRemaining } from '@/lib/dailyQuest';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();

    if (!supabaseUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const prismaUser = await prisma.user.findUnique({ where: { supabase_id: supabaseUser.id } });
    if (!prismaUser) return NextResponse.json({ error: 'User profile not found' }, { status: 404 });

    const dayNumber = getTodayDayNumber();

    const quest = await prisma.dailyQuest.findUnique({
      where: { dayNumber },
    });

    if (!quest) return NextResponse.json({ error: 'No quest found for today' }, { status: 404 });

    let attempt = await prisma.userDailyQuestAttempt.findUnique({
      where: { user_id_day_number: { user_id: prismaUser.id, day_number: dayNumber } }
    });

    if (!attempt) {
      attempt = await prisma.userDailyQuestAttempt.create({
        data: {
          user_id: prismaUser.id,
          quest_id: quest.id,
          day_number: dayNumber,
          status: 'ATTEMPTED',
          language: 'python',
          submitted_code: '',
          passed_tests: 0,
          total_tests: 0,
          xp_earned: 0,
        }
      });
    }

    const alreadySolved = attempt?.status === 'SOLVED';

    // Hide solutions if not solved
    const { solution_approaches_json, optimal_approach, ...questWithoutSolutions } = quest as any;
    const returnQuest = alreadySolved ? quest : questWithoutSolutions;

    return NextResponse.json({
      quest: returnQuest,
      attempt,
      timeRemaining: getTimeRemaining(),
      dayNumber,
      alreadySolved
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
