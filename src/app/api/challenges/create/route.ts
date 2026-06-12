import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { nanoid } from 'nanoid';
import { ChallengeType } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { challengeType, questId, lessonId, message, timeLimitSeconds, attemptsAllowed, expiresInHours } = body;

    const supabase = await createClient();
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();
    if (!supabaseUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const prismaUser = await prisma.user.findUnique({ where: { supabase_id: supabaseUser.id } });
    if (!prismaUser) return NextResponse.json({ error: 'User profile not found' }, { status: 404 });

    let title = 'Coding Challenge';

    if (challengeType === 'DAILY_QUEST') {
      if (!questId) return NextResponse.json({ error: 'questId is required' }, { status: 400 });
      const quest = await prisma.dailyQuest.findUnique({ where: { id: questId } });
      if (!quest) return NextResponse.json({ error: 'Quest not found' }, { status: 404 });
      title = quest.title;
    } else if (challengeType === 'LESSON') {
      if (!lessonId) return NextResponse.json({ error: 'lessonId is required' }, { status: 400 });
      const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
      if (!lesson) return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
      title = lesson.title;
    }

    const challenge_token = nanoid(8);
    const expires_at = new Date();
    expires_at.setHours(expires_at.getHours() + (expiresInHours || 24));

    const challenge = await prisma.challengeLink.create({
      data: {
        created_by_id: prismaUser.id,
        challenge_type: challengeType as ChallengeType,
        quest_id: questId || null,
        lesson_id: lessonId || null,
        challenge_token,
        message: message ? message.substring(0, 120) : null,
        time_limit_seconds: timeLimitSeconds || null,
        attempts_allowed: attemptsAllowed || 3,
        expires_at
      }
    });

    const protocol = req.headers.get('x-forwarded-proto') || (req.nextUrl.protocol.replace(':', ''));
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || req.nextUrl.host;
    const challengeUrl = `${protocol}://${host}/challenge/${challenge_token}`;

    const defaultMsg = message || '';
    
    return NextResponse.json({
      challengeId: challenge.id,
      challengeToken: challenge_token,
      challengeUrl,
      shareText: {
        twitter: `I just solved '${title}' on ScratchCode! 🔥\nBet you can't beat my time.\n${challengeUrl} #coding #challenge`,
        linkedin: `Just crushed '${title}' on ScratchCode!\nThink you can solve it? Try here: ${challengeUrl}`,
        whatsapp: `Bet you can't solve this in under ${Math.floor((timeLimitSeconds || 120)/60)} minutes 😏\n${defaultMsg} → ${challengeUrl}`
      }
    });
  } catch (err: any) {
    console.error('Create challenge error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
