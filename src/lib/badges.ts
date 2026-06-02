import prisma from './prisma';
import { Badge } from '@prisma/client';

/**
 * Capitalizes or structures programming language/track labels nicely.
 */
function capitalizeLanguage(lang: string): string {
  switch (lang.toLowerCase()) {
    case 'python':
      return 'Python';
    case 'javascript':
      return 'JavaScript';
    case 'html-css':
      return 'HTML & CSS';
    case 'html':
      return 'HTML';
    case 'css':
      return 'CSS';
    default:
      return lang.charAt(0).toUpperCase() + lang.slice(1);
  }
}

interface BadgeEvent {
  lessonId?: string;
}

/**
 * Checks all badge award rules for a user based on their current achievements,
 * inserts any newly unlocked badges in the database, and returns them.
 * 
 * Badge Rules:
 * - first_lesson_complete -> "First Code" badge (🚀)
 * - lessons_complete >= 5 -> "Getting Started" badge (🌱)
 * - project_complete >= 5 -> "Project Builder" badge (🛠️)
 * - streak_count >= 7 -> "On Fire" badge (🔥)
 * - streak_count >= 30 -> "Month Warrior" badge (👑)
 * - track_complete -> "{Language} Graduate" badge (🎓)
 * 
 * @param userId Prisma user ID (cuid)
 * @param event Event payload containing optional lessonId context
 * @returns Array of newly earned Badge records
 */
export async function checkAndAwardBadges(
  userId: string,
  event?: BadgeEvent
): Promise<Badge[]> {
  // 1. Gather all progress metrics from the database
  const lessonsCount = await prisma.userLessonProgress.count({
    where: { user_id: userId, status: 'COMPLETED' },
  });

  const projectsCount = await prisma.userLessonProgress.count({
    where: {
      user_id: userId,
      status: 'COMPLETED',
      lesson: { type: 'PROJECT' },
    },
  });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { streak_count: true },
  });
  const streakCount = user?.streak_count || 0;

  // Check track completion if a lessonId is provided in the event context
  const completedTracks: { slug: string; languageName: string }[] = [];
  if (event?.lessonId) {
    const currentLesson = await prisma.lesson.findUnique({
      where: { id: event.lessonId },
      include: {
        unit: {
          include: {
            track: {
              include: {
                units: {
                  where: { is_published: true },
                  include: {
                    lessons: {
                      where: { is_published: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (currentLesson && currentLesson.unit?.track) {
      const track = currentLesson.unit.track;
      const totalTrackLessons = track.units.reduce(
        (sum, unit) => sum + unit.lessons.length,
        0
      );

      const completedTrackLessons = await prisma.userLessonProgress.count({
        where: {
          user_id: userId,
          status: 'COMPLETED',
          lesson: {
            unit: {
              track_id: track.id,
            },
          },
        },
      });

      if (totalTrackLessons > 0 && completedTrackLessons === totalTrackLessons) {
        completedTracks.push({
          slug: track.slug,
          languageName: capitalizeLanguage(track.slug),
        });
      }
    }
  }

  // 2. Fetch existing user badges to prevent duplicates
  const existingUserBadges = await prisma.userBadge.findMany({
    where: { user_id: userId },
    include: { badge: true },
  });
  const existingSlugs = new Set(existingUserBadges.map((ub) => ub.badge.slug));

  // 3. Define the rules list with target slugs and info
  const ruleCandidates: {
    slug: string;
    title: string;
    description: string;
    icon_emoji: string;
    condition: boolean;
  }[] = [
    {
      slug: 'first-code',
      title: 'First Code',
      description: 'Completed your very first coding lesson!',
      icon_emoji: '🚀',
      condition: lessonsCount >= 1,
    },
    {
      slug: 'getting-started',
      title: 'Getting Started',
      description: 'Completed 5 lessons!',
      icon_emoji: '🌱',
      condition: lessonsCount >= 5,
    },
    {
      slug: 'project-builder',
      title: 'Project Builder',
      description: 'Completed 5 project lessons!',
      icon_emoji: '🛠️',
      condition: projectsCount >= 5,
    },
    {
      slug: 'on-fire',
      title: 'On Fire',
      description: 'Earned a 7-day learning streak!',
      icon_emoji: '🔥',
      condition: streakCount >= 7,
    },
    {
      slug: 'month-warrior',
      title: 'Month Warrior',
      description: 'Earned a 30-day learning streak!',
      icon_emoji: '👑',
      condition: streakCount >= 30,
    },
  ];

  // Append dynamic track completion badges
  for (const track of completedTracks) {
    ruleCandidates.push({
      slug: `${track.slug}-graduate`,
      title: `${track.languageName} Graduate`,
      description: `Graduated from the ${track.languageName} track!`,
      icon_emoji: '🎓',
      condition: true,
    });
  }

  // 4. Award unlocked badges that the user doesn't already have
  const newlyAwardedBadges: Badge[] = [];

  for (const candidate of ruleCandidates) {
    if (candidate.condition && !existingSlugs.has(candidate.slug)) {
      // Upsert the general Badge definition in DB
      const badge = await prisma.badge.upsert({
        where: { slug: candidate.slug },
        create: {
          slug: candidate.slug,
          title: candidate.title,
          description: candidate.description,
          icon_emoji: candidate.icon_emoji,
        },
        update: {},
      });

      // Insert UserBadge association
      await prisma.userBadge.create({
        data: {
          user_id: userId,
          badge_id: badge.id,
        },
      });

      newlyAwardedBadges.push(badge);
    }
  }

  return newlyAwardedBadges;
}
