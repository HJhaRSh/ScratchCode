import prisma from './prisma';

/**
 * Calculates user level based on cumulative XP:
 * - Level 1: 0-499 XP (XP < 500)
 * - Level 2: 500-1999 XP (500 <= XP < 2000)
 * - Level 3: 2000-4999 XP (2000 <= XP < 5000)
 * - Level 4: 5000+ XP (XP >= 5000)
 */
export function calculateLevel(xp: number): number {
  if (xp >= 5000) return 4;
  if (xp >= 2000) return 3;
  if (xp >= 500) return 2;
  return 1;
}

/**
 * Awards XP to a user, applying a first-attempt bonus if applicable,
 * updates the database user profile, and recalculates level.
 * 
 * @param userId Prisma user ID (cuid)
 * @param amount Base XP amount to reward
 * @param firstAttempt Boolean flag representing if this is the user's first complete attempt
 */
export async function awardXP(
  userId: string,
  amount: number,
  firstAttempt: boolean
): Promise<{ newXP: number; newLevel: number; leveledUp: boolean; xpEarned: number }> {
  let xpEarned = amount;
  if (firstAttempt) {
    xpEarned = Math.round((amount * 1.5) / 10) * 10;
  }

  // Fetch current user XP and level
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { xp: true, level: true },
  });

  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }

  const newXP = user.xp + xpEarned;
  const newLevel = calculateLevel(newXP);
  const leveledUp = newLevel > user.level;

  // Save the updated values to the DB
  await prisma.user.update({
    where: { id: userId },
    data: {
      xp: newXP,
      level: newLevel,
    },
  });

  return {
    newXP,
    newLevel,
    leveledUp,
    xpEarned,
  };
}
