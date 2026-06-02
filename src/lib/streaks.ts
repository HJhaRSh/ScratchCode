import prisma from './prisma';

/**
 * Truncates a Date object to the start of the day in UTC coordinates.
 */
export function truncateToDayUTC(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

/**
 * Evaluates and updates the active coding streak of a user in UTC.
 * 
 * Logic:
 * - If streak_last_date is null or > 1 day ago: reset streak to 1
 * - If streak_last_date is yesterday: increment streak by 1
 * - If streak_last_date is today: no change (already logged today)
 * 
 * @param userId Prisma user ID (cuid)
 * @returns { streakCount, streakUpdated, isNewRecord }
 */
export async function updateStreak(
  userId: string
): Promise<{ streakCount: number; streakUpdated: boolean; isNewRecord: boolean }> {
  // Fetch user streak data from DB
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { streak_count: true, streak_last_date: true },
  });

  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }

  const oldStreakCount = user.streak_count;
  let streakCount = oldStreakCount;
  let streakUpdated = false;

  const todayUTC = truncateToDayUTC(new Date());

  if (!user.streak_last_date) {
    // No prior streak, initialize to 1
    streakCount = 1;
    streakUpdated = true;
  } else {
    const lastDateUTC = truncateToDayUTC(new Date(user.streak_last_date));
    
    // Difference in milliseconds
    const diffTime = todayUTC.getTime() - lastDateUTC.getTime();
    // Convert to full UTC days
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays > 1) {
      // Streak broken (stale by > 1 day), reset to 1
      streakCount = 1;
      streakUpdated = true;
    } else if (diffDays === 1) {
      // Yesterday was the last activity, increment streak count
      streakCount = oldStreakCount + 1;
      streakUpdated = true;
    } else {
      // Already completed a lesson today, no change
      streakUpdated = false;
    }
  }

  // Update the user record if a change occurred
  if (streakUpdated) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        streak_count: streakCount,
        streak_last_date: new Date(), // Save current timestamp
      },
    });
  }

  const isNewRecord = streakCount > oldStreakCount;

  return {
    streakCount,
    streakUpdated,
    isNewRecord,
  };
}
