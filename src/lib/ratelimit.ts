import { Redis } from '@upstash/redis';
import prisma from '@/lib/prisma';

let redis: Redis | null = null;

// Initialize Upstash Redis client if credentials are provided
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

/**
 * Check if a user has exceeded their daily limit of 3 hints.
 * Returns true if allowed (under limit), false if rate-limited.
 */
export async function checkRateLimit(userId: string): Promise<{
  allowed: boolean;
  currentCount: number;
  limit: number;
}> {
  const limit = 50;
  const todayStr = new Date().toISOString().split('T')[0];
  const redisKey = `hints:${userId}:${todayStr}`;

  if (redis) {
    try {
      // Increment the count in Upstash Redis
      const currentCount = await redis.incr(redisKey);
      
      // If it's a brand new key, set a 24-hour expiration time (86400 seconds)
      if (currentCount === 1) {
        await redis.expire(redisKey, 86400);
      }

      if (currentCount > limit) {
        return { allowed: false, currentCount: currentCount - 1, limit };
      }

      return { allowed: true, currentCount, limit };
    } catch (error) {
      console.warn('Upstash Redis error, falling back to database check:', error);
    }
  }

  // Fallback to PostgreSQL database counting
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  const dbCount = await prisma.hintUsage.count({
    where: {
      user_id: userId,
      requested_at: {
        gte: todayStart,
      },
    },
  });

  if (dbCount >= limit) {
    return { allowed: false, currentCount: dbCount, limit };
  }

  return { allowed: true, currentCount: dbCount + 1, limit };
}
