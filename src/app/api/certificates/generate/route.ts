import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { nanoid } from 'nanoid';
import { CertificateType } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, questId, lessonId, streakCount, badgeName, language, theme } = body;

    const supabase = await createClient();
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();
    if (!supabaseUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const prismaUser = await prisma.user.findUnique({ where: { supabase_id: supabaseUser.id } });
    if (!prismaUser) return NextResponse.json({ error: 'User profile not found' }, { status: 404 });

    let title = '';
    let subtitle = '';
    let stat1_label = '';
    let stat1_value = '';
    let stat2_label = '';
    let stat2_value = '';
    let stat3_label = '';
    let stat3_value = '';

    const background_theme = theme || 'dark';

    switch (type as CertificateType) {
      case 'QUEST_SOLVED':
        if (!questId) return NextResponse.json({ error: 'questId required' }, { status: 400 });
        const quest = await prisma.dailyQuest.findUnique({ where: { id: questId } });
        if (!quest) return NextResponse.json({ error: 'Quest not found' }, { status: 404 });
        
        title = quest.title;
        subtitle = `Daily Quest · ${quest.difficulty} · ${quest.xp_reward} XP`;
        stat1_label = 'Difficulty';
        stat1_value = quest.difficulty;
        stat2_label = 'Language';
        stat2_value = language || 'Python 🐍';
        stat3_label = 'Quest Streak';
        stat3_value = `${streakCount || 1} Days 🔥`;
        break;

      case 'STREAK_MILESTONE':
        title = `${streakCount || 7} Day Streak! 🔥`;
        subtitle = `Solved ${streakCount || 7} Daily Quests in a row`;
        
        const streak = await prisma.dailyQuestStreak.findUnique({ where: { user_id: prismaUser.id } });
        stat1_label = 'Total Solved';
        stat1_value = streak?.total_solved.toString() || '0';
        stat2_label = 'Favourite Language';
        stat2_value = language || 'Python';
        stat3_label = 'Total XP Earned';
        stat3_value = prismaUser.xp.toString();
        break;

      case 'TRACK_COMPLETE':
        title = `Graduate 🎓`;
        subtitle = `Completed all units`;
        stat1_label = 'Track';
        stat1_value = language || 'Python';
        stat2_label = 'Time Taken';
        stat2_value = '14 days';
        stat3_label = 'XP Earned';
        stat3_value = prismaUser.xp.toString();
        break;

      case 'BADGE_EARNED':
        title = `Earned: ${badgeName || 'Badge'}`;
        subtitle = `Achievement Unlocked on ScratchCode`;
        stat1_label = 'Badge';
        stat1_value = `🏅 ${badgeName || 'Badge'}`;
        stat2_label = 'Date';
        stat2_value = new Date().toLocaleDateString();
        stat3_label = 'Total XP';
        stat3_value = prismaUser.xp.toString();
        break;
        
      case 'CHALLENGE_WON':
        title = 'Challenge Winner 🏆';
        subtitle = 'Crushed the competition';
        stat1_label = 'Language';
        stat1_value = language || 'Python';
        stat2_label = 'Speed';
        stat2_value = 'Fast ⚡';
        stat3_label = 'XP Earned';
        stat3_value = '100 XP';
        break;

      default:
        return NextResponse.json({ error: 'Invalid certificate type' }, { status: 400 });
    }

    const share_token = nanoid(10);

    const certificate = await prisma.certificateCard.create({
      data: {
        user_id: prismaUser.id,
        type: type as CertificateType,
        title,
        subtitle,
        stat1_label,
        stat1_value,
        stat2_label,
        stat2_value,
        stat3_label,
        stat3_value,
        background_theme,
        share_token
      }
    });

    const protocol = req.headers.get('x-forwarded-proto') || (req.nextUrl.protocol.replace(':', ''));
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || req.nextUrl.host;
    const shareUrl = `${protocol}://${host}/cert/${share_token}`;

    return NextResponse.json({
      certificateId: certificate.id,
      shareToken: share_token,
      shareUrl,
      cardData: {
        title: certificate.title,
        subtitle: certificate.subtitle,
        type: certificate.type,
        theme: certificate.background_theme,
        shareToken: certificate.share_token,
        stat1: { label: certificate.stat1_label, value: certificate.stat1_value },
        stat2: { label: certificate.stat2_label, value: certificate.stat2_value },
        stat3: { label: certificate.stat3_label, value: certificate.stat3_value },
        username: prismaUser.username,
        avatarUrl: prismaUser.avatar_url,
        date: certificate.created_at.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      }
    });
  } catch (err: any) {
    console.error('Certificate generation error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
