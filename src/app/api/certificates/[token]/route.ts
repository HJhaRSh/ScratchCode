import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  try {
    const resolvedParams = await params;
    const token = resolvedParams?.token;
    
    if (!token) return NextResponse.json({ error: 'Token is required' }, { status: 400 });

    const certificate = await prisma.certificateCard.findUnique({
      where: { share_token: token },
      include: { user: true }
    });

    if (!certificate) return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });

    // Increment share count
    const updatedCert = await prisma.certificateCard.update({
      where: { share_token: token },
      data: { share_count: { increment: 1 } }
    });

    return NextResponse.json({
      title: updatedCert.title,
      subtitle: updatedCert.subtitle,
      type: updatedCert.type,
      theme: updatedCert.background_theme,
      shareToken: updatedCert.share_token,
      stat1: { label: updatedCert.stat1_label, value: updatedCert.stat1_value },
      stat2: { label: updatedCert.stat2_label, value: updatedCert.stat2_value },
      stat3: { label: updatedCert.stat3_label, value: updatedCert.stat3_value },
      username: certificate.user.username,
      avatarUrl: certificate.user.avatar_url,
      date: updatedCert.created_at.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });
  } catch (err: any) {
    console.error('Fetch certificate error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
