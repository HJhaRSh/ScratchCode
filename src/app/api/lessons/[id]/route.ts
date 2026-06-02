import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const lesson = await prisma.lesson.findUnique({
      where: { id: resolvedParams.id },
      include: {
        unit: {
          include: {
            track: true,
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Authenticate and get user session
    const supabase = await createClient();
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();

    let userProgress = null;
    let userStats = null;

    if (supabaseUser) {
      const prismaUser = await prisma.user.findUnique({
        where: { supabase_id: supabaseUser.id },
        select: {
          id: true,
          xp: true,
          level: true,
          streak_count: true,
        },
      });

      if (prismaUser) {
        userStats = prismaUser;
        
        userProgress = await prisma.userLessonProgress.findUnique({
          where: {
            user_id_lesson_id: {
              user_id: prismaUser.id,
              lesson_id: lesson.id,
            },
          },
        });
      }
    }

    // Find previous and next lessons inside the same track
    const trackUnits = await prisma.unit.findMany({
      where: { track_id: lesson.unit.track_id },
      orderBy: { unit_number: 'asc' },
      include: {
        lessons: {
          orderBy: { lesson_number: 'asc' },
        },
      },
    });

    const flatLessons = trackUnits.flatMap((u) => u.lessons);
    const currentIndex = flatLessons.findIndex((l) => l.id === lesson.id);

    const previousLessonId = currentIndex > 0 ? flatLessons[currentIndex - 1].id : null;
    const nextLessonId = currentIndex < flatLessons.length - 1 ? flatLessons[currentIndex + 1].id : null;

    return NextResponse.json({
      lesson,
      userProgress,
      user: userStats,
      previousLessonId,
      nextLessonId,
    });
  } catch (err: any) {
    console.error('Error fetching complete lesson details:', err);
    return NextResponse.json(
      { error: 'Failed to fetch lesson details', code: 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    );
  }
}
