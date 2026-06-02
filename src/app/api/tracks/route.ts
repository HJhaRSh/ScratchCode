export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();

    let prismaUser = null;
    if (supabaseUser) {
      prismaUser = await prisma.user.findUnique({
        where: { supabase_id: supabaseUser.id },
      });
    }

    const tracks = await prisma.track.findMany({
      where: { is_published: true },
      orderBy: { title: 'asc' },
    });

    if (prismaUser) {
      // Fetch the user's progress for all lessons
      const progressRecords = await prisma.userLessonProgress.findMany({
        where: {
          user_id: prismaUser.id,
        },
        include: {
          lesson: {
            select: {
              id: true,
              unit: {
                select: {
                  track_id: true,
                }
              }
            }
          }
        }
      });

      const tracksWithProgress = tracks.map((track) => {
        const trackProgress = progressRecords.filter(
          (p) => p.lesson.unit.track_id === track.id
        );
        const completedLessons = trackProgress.filter(
          (p) => p.status === 'COMPLETED'
        ).length;
        const totalInteracted = trackProgress.length;

        // Progress % is completed lessons divided by track total_lessons
        const progressPercentage = track.total_lessons > 0
          ? Math.min(100, Math.round((completedLessons / track.total_lessons) * 100))
          : 0;

        return {
          ...track,
          completed_lessons: completedLessons,
          started: totalInteracted > 0,
          progress_percentage: progressPercentage,
        };
      });

      return NextResponse.json({ tracks: tracksWithProgress });
    }

    // Return tracks with zero progress for unauthenticated users
    const tracksWithProgress = tracks.map((track) => ({
      ...track,
      completed_lessons: 0,
      started: false,
      progress_percentage: 0,
    }));

    return NextResponse.json({ tracks: tracksWithProgress });
  } catch (err: any) {
    console.error('Error fetching tracks:', err);
    return NextResponse.json(
      { error: 'Failed to fetch tracks curriculum', code: 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    );
  }
}


