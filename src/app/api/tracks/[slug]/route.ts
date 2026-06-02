import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const { slug } = resolvedParams;

    // Fetch the track with all its units and lessons
    const track = await prisma.track.findUnique({
      where: { slug, is_published: true },
      include: {
        units: {
          where: { is_published: true },
          orderBy: { unit_number: 'asc' },
          include: {
            lessons: {
              where: { is_published: true },
              orderBy: { lesson_number: 'asc' },
              select: {
                id: true,
                lesson_number: true,
                title: true,
                type: true,
                duration_minutes: true,
                xp_reward: true,
                language: true,
                is_published: true,
              }
            }
          }
        }
      }
    });

    if (!track) {
      return NextResponse.json(
        { error: 'Track not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Try to get authenticated user progress
    const supabase = await createClient();
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();

    let userProgressMap: Record<string, string> = {};

    if (supabaseUser) {
      const prismaUser = await prisma.user.findUnique({
        where: { supabase_id: supabaseUser.id },
      });

      if (prismaUser) {
        // Find progress for all lessons in this track
        const progressRecords = await prisma.userLessonProgress.findMany({
          where: {
            user_id: prismaUser.id,
            lesson: {
              unit: {
                track_id: track.id,
              }
            }
          },
          select: {
            lesson_id: true,
            status: true,
          }
        });

        progressRecords.forEach((record) => {
          userProgressMap[record.lesson_id] = record.status;
        });
      }
    }

    // Map status into each lesson and count total stats
    let totalMinutes = 0;
    let completedLessonsCount = 0;

    const unitsWithProgress = track.units.map((unit) => {
      const lessonsWithProgress = unit.lessons.map((lesson) => {
        const status = userProgressMap[lesson.id] || 'NOT_STARTED';
        totalMinutes += lesson.duration_minutes;
        if (status === 'COMPLETED') {
          completedLessonsCount += 1;
        }

        return {
          ...lesson,
          status,
        };
      });

      return {
        ...unit,
        lessons: lessonsWithProgress,
      };
    });

    // Compute estimated hours (minimum 1 hour)
    const estimatedHours = Math.max(1, Math.round(totalMinutes / 60));

    return NextResponse.json({
      track: {
        ...track,
        estimated_hours: estimatedHours,
        completed_lessons: completedLessonsCount,
        units: unitsWithProgress,
      }
    });
  } catch (err: any) {
    console.error('Error fetching track details:', err);
    return NextResponse.json(
      { error: 'Failed to fetch track details', code: 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    );
  }
}
