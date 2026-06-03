export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    // 1. Authenticate user
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

    // 2. Fetch tracks and track progress
    const tracks = await prisma.track.findMany({
      where: { is_published: true },
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
                title: true,
              }
            }
          }
        }
      }
    });

    const progressRecords = await prisma.userLessonProgress.findMany({
      where: { user_id: prismaUser.id },
      select: {
        lesson_id: true,
        status: true,
      }
    });

    const progressMap = new Map(progressRecords.map(r => [r.lesson_id, r.status]));

    const tracksProgress = tracks.map((track) => {
      // Flatten all lessons in order
      const trackLessons = track.units.flatMap((unit) =>
        unit.lessons.map((lesson) => ({
          ...lesson,
          unit_title: unit.title,
        }))
      );

      const totalLessons = trackLessons.length;
      const completedLessons = trackLessons.filter(
        (lesson) => progressMap.get(lesson.id) === 'COMPLETED'
      ).length;
      const started = trackLessons.some((lesson) => progressMap.has(lesson.id));

      const progressPercentage = totalLessons > 0
        ? Math.min(100, Math.round((completedLessons / totalLessons) * 100))
        : 0;

      // Prefer IN_PROGRESS lessons first (exact resume point), then first NOT_STARTED
      const inProgressLesson = trackLessons.find(
        (lesson) => progressMap.get(lesson.id) === 'IN_PROGRESS'
      );
      const nextLesson = inProgressLesson ||
        trackLessons.find((lesson) => progressMap.get(lesson.id) !== 'COMPLETED');

      return {
        track_slug: track.slug,
        track_title: track.title,
        track_icon: track.icon,
        track_color: track.color_hex,
        completed_lessons: completedLessons,
        total_lessons: totalLessons,
        progress_percentage: progressPercentage,
        started,
        next_lesson: nextLesson
          ? {
              id: nextLesson.id,
              title: nextLesson.title,
              unit_title: nextLesson.unit_title,
              in_progress: progressMap.get(nextLesson.id) === 'IN_PROGRESS',
            }
          : undefined,
      };
    }).filter((t) => t.started);

    // 3. Fetch recent badges (last 3 earned)
    const recentBadgesRecords = await prisma.userBadge.findMany({
      where: { user_id: prismaUser.id },
      orderBy: { earned_at: 'desc' },
      take: 3,
      include: {
        badge: true,
      }
    });

    const recentBadges = recentBadgesRecords.map((ub) => ({
      id: ub.badge.id,
      slug: ub.badge.slug,
      title: ub.badge.title,
      description: ub.badge.description,
      icon_emoji: ub.badge.icon_emoji,
      earned_at: ub.earned_at,
    }));

    // 4. Activity this week (last 7 days of XP)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const recentProgress = await prisma.userLessonProgress.findMany({
      where: {
        user_id: prismaUser.id,
        status: 'COMPLETED',
        completed_at: {
          gte: sevenDaysAgo,
        },
      },
      select: {
        completed_at: true,
        xp_earned: true,
      },
    });

    // Generate timezone-resilient date keys (YYYY-MM-DD) based on local time
    const getLocalDateKey = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const dateVal = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${dateVal}`;
    };

    const dailyXPMap = new Map<string, number>();
    recentProgress.forEach((record) => {
      if (record.completed_at) {
        const dateKey = getLocalDateKey(record.completed_at);
        const existing = dailyXPMap.get(dateKey) || 0;
        dailyXPMap.set(dateKey, existing + record.xp_earned);
      }
    });

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyXP = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = getLocalDateKey(d);
      const dayLabel = daysOfWeek[d.getDay()];
      weeklyXP.push({
        day: dayLabel,
        xp: dailyXPMap.get(dateKey) || 0,
      });
    }

    // 5. Leaderboard (top 5 users by XP this week - last 7 days)
    const weeklyProgressAllUsers = await prisma.userLessonProgress.findMany({
      where: {
        status: 'COMPLETED',
        completed_at: {
          gte: sevenDaysAgo,
        },
      },
      select: {
        user_id: true,
        xp_earned: true,
      },
    });

    const userXPMap = new Map<string, number>();
    weeklyProgressAllUsers.forEach((p) => {
      const current = userXPMap.get(p.user_id) || 0;
      userXPMap.set(p.user_id, current + p.xp_earned);
    });

    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        avatar_url: true,
        xp: true,
      },
    });

    const leaderboard = allUsers
      .map((user) => ({
        username: user.username,
        avatar_url: user.avatar_url,
        xp_this_week: userXPMap.get(user.id) || 0,
        total_xp: user.xp,
      }))
      // Sort: weekly XP desc, then total XP desc
      .sort((a, b) => b.xp_this_week - a.xp_this_week || b.total_xp - a.total_xp)
      .slice(0, 5)
      .map((user, index) => ({
        rank: index + 1,
        username: user.username,
        avatar_url: user.avatar_url,
        xp_this_week: user.xp_this_week,
      }));

    // Assemble payload matching DashboardResponse structure
    const dashboardData = {
      user: {
        xp: prismaUser.xp,
        level: prismaUser.level,
        streak_count: prismaUser.streak_count,
        streak_last_date: prismaUser.streak_last_date,
        username: prismaUser.username,
        avatar_url: prismaUser.avatar_url,
      },
      tracks_progress: tracksProgress,
      recent_badges: recentBadges,
      weekly_xp: weeklyXP,
      leaderboard: leaderboard,
    };

    return NextResponse.json(dashboardData);
  } catch (err: any) {
    console.error('Error fetching dashboard data:', err);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data', code: 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    );
  }
}
