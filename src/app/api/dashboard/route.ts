export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const { getTodayDayNumber } = await import('@/lib/dailyQuest');
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

    // 4. Activity this week (last 7 days of XP) — for the bar chart
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const recentLessonProgress = await prisma.userLessonProgress.findMany({
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

    const recentQuestProgress = await prisma.userDailyQuestAttempt.findMany({
      where: {
        user_id: prismaUser.id,
        status: 'SOLVED',
        first_solved_at: {
          gte: sevenDaysAgo,
        },
      },
      select: {
        first_solved_at: true,
        xp_earned: true,
      },
    });

    const recentProgress = [
      ...recentLessonProgress,
      ...recentQuestProgress.map((q) => ({
        completed_at: q.first_solved_at,
        xp_earned: q.xp_earned || 0,
      }))
    ];

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

    // 5. Full Activity Log — ALL completed lessons with rich details
    const activityLogRaw = await prisma.userLessonProgress.findMany({
      where: {
        user_id: prismaUser.id,
        status: 'COMPLETED',
      },
      orderBy: { completed_at: 'desc' },
      take: 50,
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            type: true,
            language: true,
            duration_minutes: true,
            xp_reward: true,
            unit: {
              select: {
                title: true,
                unit_number: true,
                track: {
                  select: {
                    title: true,
                    slug: true,
                    icon: true,
                    color_hex: true,
                  }
                }
              }
            }
          }
        }
      }
    });

    const activityLog = activityLogRaw.map((record) => ({
      lesson_id: record.lesson_id,
      lesson_title: record.lesson.title,
      lesson_type: record.lesson.type,
      language: record.lesson.language,
      duration_minutes: record.lesson.duration_minutes,
      xp_reward: record.lesson.xp_reward,
      xp_earned: record.xp_earned,
      attempts: record.attempts,
      completed_at: record.completed_at,
      track_title: record.lesson.unit.track.title,
      track_slug: record.lesson.unit.track.slug,
      track_icon: record.lesson.unit.track.icon,
      track_color: record.lesson.unit.track.color_hex,
      unit_title: record.lesson.unit.title,
    }));

    // 6. Overall progress stats
    const totalLessonCompleted = await prisma.userLessonProgress.count({
      where: { user_id: prismaUser.id, status: 'COMPLETED' },
    });
    const totalQuestCompleted = await prisma.userDailyQuestAttempt.count({
      where: { user_id: prismaUser.id, status: 'SOLVED' },
    });
    const totalCompleted = totalLessonCompleted + totalQuestCompleted;

    const totalInProgress = await prisma.userLessonProgress.count({
      where: { user_id: prismaUser.id, status: 'IN_PROGRESS' },
    });
    
    const totalLessonEstimatedMinutes = activityLogRaw.reduce(
      (sum, r) => sum + r.lesson.duration_minutes,
      0
    );
    const totalEstimatedMinutes = totalLessonEstimatedMinutes + (totalQuestCompleted * 20);

    const totalLessonAttempts = activityLogRaw.reduce((sum, r) => sum + r.attempts, 0);
    const questAttempts = await prisma.userDailyQuestAttempt.findMany({
      where: { user_id: prismaUser.id },
      select: { attempts_count: true }
    });
    const totalQuestAttempts = questAttempts.reduce((sum, r) => sum + r.attempts_count, 0);
    const totalAttempts = totalLessonAttempts + totalQuestAttempts;

    // 7. Leaderboard (top 5 users by XP this week)
    const weeklyProgressAllUsers = await prisma.userLessonProgress.findMany({
      where: {
        status: 'COMPLETED',
        completed_at: { gte: sevenDaysAgo },
      },
      select: { user_id: true, xp_earned: true },
    });

    const userXPMap = new Map<string, number>();
    weeklyProgressAllUsers.forEach((p) => {
      const current = userXPMap.get(p.user_id) || 0;
      userXPMap.set(p.user_id, current + p.xp_earned);
    });

    const allUsers = await prisma.user.findMany({
      select: { id: true, username: true, avatar_url: true, xp: true },
    });

    const leaderboard = allUsers
      .map((user) => ({
        username: user.username,
        avatar_url: user.avatar_url,
        xp_this_week: userXPMap.get(user.id) || 0,
        total_xp: user.xp,
      }))
      .sort((a, b) => b.xp_this_week - a.xp_this_week || b.total_xp - a.total_xp)
      .slice(0, 5)
      .map((user, index) => ({
        rank: index + 1,
        username: user.username,
        avatar_url: user.avatar_url,
        xp_this_week: user.xp_this_week,
      }));

    // 8. Daily Quest integration
    const todayDayNumber = getTodayDayNumber();
    const todayQuest = await prisma.dailyQuest.findUnique({
      where: { dayNumber: todayDayNumber },
      select: { title: true, difficulty: true, tags: true, xp_reward: true }
    });

    const questStreak = await prisma.dailyQuestStreak.findUnique({
      where: { user_id: prismaUser.id }
    });

    const todayAttempt = await prisma.userDailyQuestAttempt.findUnique({
      where: {
        user_id_day_number: {
          user_id: prismaUser.id,
          day_number: todayDayNumber
        }
      }
    });

    const solversCount = await prisma.userDailyQuestAttempt.count({
      where: {
        day_number: todayDayNumber,
        status: 'SOLVED'
      }
    });

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
      activity_log: activityLog,
      stats: {
        total_completed: totalCompleted,
        total_in_progress: totalInProgress,
        total_estimated_minutes: totalEstimatedMinutes,
        total_attempts: totalAttempts,
      },
      daily_quest: {
        todayQuest: todayQuest ? {
          title: todayQuest.title,
          difficulty: todayQuest.difficulty,
          tags: todayQuest.tags,
          xpReward: todayQuest.xp_reward,
          isSolved: todayAttempt?.status === 'SOLVED',
        } : null,
        questStreak: {
          current: questStreak?.current_streak || 0,
          longest: questStreak?.longest_streak || 0,
        },
        questSolvedToday: todayAttempt?.status === 'SOLVED',
        dayNumber: todayDayNumber,
        solversCount: solversCount,
      }
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
