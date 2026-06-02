import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
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

    // Fetch all earned badges
    const earnedBadgesRecords = await prisma.userBadge.findMany({
      where: { user_id: prismaUser.id },
      orderBy: { earned_at: 'desc' },
      include: {
        badge: true,
      }
    });

    const earnedBadges = earnedBadgesRecords.map((ub) => ({
      id: ub.badge.id,
      slug: ub.badge.slug,
      title: ub.badge.title,
      description: ub.badge.description,
      icon_emoji: ub.badge.icon_emoji,
      earned_at: ub.earned_at,
    }));

    // Optionally fetch all badges to show unearned ones (we will just return all for now)
    const allBadgesRecords = await prisma.badge.findMany();
    
    const unearnedBadges = allBadgesRecords
      .filter((b) => !earnedBadges.some((eb) => eb.id === b.id))
      .map((b) => ({
        id: b.id,
        slug: b.slug,
        title: b.title,
        description: b.description,
        icon_emoji: b.icon_emoji,
        earned_at: null,
      }));

    return NextResponse.json({
      earned: earnedBadges,
      unearned: unearnedBadges,
    });
  } catch (err: any) {
    console.error('Error fetching badges data:', err);
    return NextResponse.json(
      { error: 'Failed to fetch badges data', code: 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    );
  }
}
