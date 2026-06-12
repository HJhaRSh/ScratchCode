import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  try {
    const resolvedParams = await params;
    const token = resolvedParams?.token;
    
    if (!token) return NextResponse.json({ error: 'Token is required' }, { status: 400 });

    const challenge = await prisma.challengeLink.findUnique({
      where: { challenge_token: token }
    });

    if (!challenge) return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });

    const attempts = await prisma.challengeAttempt.findMany({
      where: { challenge_id: challenge.id },
      include: {
        challenger: {
          select: {
            username: true,
            avatar_url: true
          }
        }
      },
      orderBy: [
        { status: 'asc' }, // PENDING, SOLVED, FAILED... wait, 'asc' on string enum might order alphabetically: FAILED, PENDING, SOLVED. Better to sort in JS or use specific order
      ]
    });

    // Sort in memory to guarantee SOLVED first, then time_taken_seconds ascending
    attempts.sort((a, b) => {
      if (a.status === 'SOLVED' && b.status !== 'SOLVED') return -1;
      if (a.status !== 'SOLVED' && b.status === 'SOLVED') return 1;
      
      if (a.status === 'SOLVED' && b.status === 'SOLVED') {
        const timeA = a.time_taken_seconds || Infinity;
        const timeB = b.time_taken_seconds || Infinity;
        return timeA - timeB;
      }
      
      return 0; // maintain original order for others
    });

    return NextResponse.json({ leaderboard: attempts });
  } catch (err: any) {
    console.error('Fetch leaderboard error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
