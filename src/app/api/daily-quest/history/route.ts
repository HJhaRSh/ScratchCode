export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();
    if (!supabaseUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const prismaUser = await prisma.user.findUnique({ where: { supabase_id: supabaseUser.id } });
    if (!prismaUser) return NextResponse.json({ error: 'User profile not found' }, { status: 404 });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const history = await prisma.userDailyQuestAttempt.findMany({
      where: {
        user_id: prismaUser.id,
        created_at: { gte: thirtyDaysAgo }
      },
      include: {
        quest: {
          select: { title: true }
        }
      },
      orderBy: { day_number: 'desc' }
    });

    const streak = await prisma.dailyQuestStreak.findUnique({
      where: { user_id: prismaUser.id }
    });

    return NextResponse.json({
      history: history.map((h: any) => ({
        day_number: h.day_number,
        title: h.quest.title,
        status: h.status,
        xp_earned: h.xp_earned,
        language: h.language,
        created_at: h.created_at,
      })),
      streak
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
