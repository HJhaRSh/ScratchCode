export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { dayNumber, hintNumber } = await req.json();

    const supabase = await createClient();
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();
    if (!supabaseUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const prismaUser = await prisma.user.findUnique({ where: { supabase_id: supabaseUser.id } });
    if (!prismaUser) return NextResponse.json({ error: 'User profile not found' }, { status: 404 });

    if (typeof hintNumber !== 'number' || hintNumber < 1 || hintNumber > 3) {
      return NextResponse.json({ error: 'Invalid hint number' }, { status: 400 });
    }

    const quest = await prisma.dailyQuest.findUnique({ where: { dayNumber } });
    if (!quest) return NextResponse.json({ error: 'Quest not found' }, { status: 404 });

    const hints = quest.hints_json as string[] || [];
    const hint = hints[hintNumber - 1] || 'No hint available.';

    const attempt = await prisma.userDailyQuestAttempt.findUnique({
      where: { user_id_day_number: { user_id: prismaUser.id, day_number: dayNumber } }
    });

    if (!attempt) {
      await prisma.userDailyQuestAttempt.create({
        data: {
          user_id: prismaUser.id,
          quest_id: quest.id,
          day_number: dayNumber,
          status: 'ATTEMPTED',
          language: 'unknown',
          submitted_code: '',
        }
      });
    }

    return NextResponse.json({ hint });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
