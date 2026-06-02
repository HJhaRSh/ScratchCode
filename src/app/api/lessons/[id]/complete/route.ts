export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { awardXP } from '@/lib/xp';
import { updateStreak } from '@/lib/streaks';
import { checkAndAwardBadges } from '@/lib/badges';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
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

    // Check existing progress
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

    // Upsert completion state
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
        code_snapshot: '',
        completed_at: new Date(),
        xp_earned: lesson.xp_reward,
      },
      update: {
        status: 'COMPLETED',
        attempts: { increment: 1 },
        completed_at: new Date(),
        xp_earned: lesson.xp_reward,
      },
    });

    let xpResult = null;
    let streakResult = null;
    let newBadgesList: any[] = [];

    // Gamification
    if (!alreadyCompleted) {
      xpResult = await awardXP(prismaUser.id, lesson.xp_reward, firstAttempt);
      streakResult = await updateStreak(prismaUser.id);
      newBadgesList = await checkAndAwardBadges(prismaUser.id, { lessonId: lesson.id });
    }

    return NextResponse.json({
      success: true,
      already_completed: alreadyCompleted,
      xp: xpResult,
      streak: streakResult,
      new_badges: newBadgesList,
    });
  } catch (err: any) {
    console.error('Error completing lesson:', err);
    return NextResponse.json(
      { error: 'Failed to complete lesson', code: 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    );
  }
}
