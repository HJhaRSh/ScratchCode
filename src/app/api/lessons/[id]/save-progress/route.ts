export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/lessons/[id]/save-progress
 * Called via navigator.sendBeacon when the user navigates away from a lesson
 * without completing it. Saves the current code and marks the lesson as IN_PROGRESS
 * so the dashboard "Resume Mission" button returns them to this exact lesson.
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const lessonId = resolvedParams.id;

    // Parse code from body (sendBeacon sends a Blob)
    let code = '';
    try {
      const body = await req.json();
      code = body.code || '';
    } catch {
      // Body may be empty or malformed — still mark as IN_PROGRESS
    }

    // Authenticate user via cookies
    const supabase = await createClient();
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();

    if (!supabaseUser) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }

    const prismaUser = await prisma.user.findUnique({
      where: { supabase_id: supabaseUser.id },
      select: { id: true },
    });

    if (!prismaUser) {
      return NextResponse.json({ ok: false }, { status: 404 });
    }

    // Verify lesson exists
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { id: true },
    });

    if (!lesson) {
      return NextResponse.json({ ok: false }, { status: 404 });
    }

    // Check if already COMPLETED — never downgrade a completed lesson
    const existingProgress = await prisma.userLessonProgress.findUnique({
      where: {
        user_id_lesson_id: {
          user_id: prismaUser.id,
          lesson_id: lessonId,
        },
      },
      select: { status: true },
    });

    if (existingProgress?.status === 'COMPLETED') {
      // Already completed — don't touch it
      return NextResponse.json({ ok: true, skipped: true });
    }

    // Upsert as IN_PROGRESS with the latest code snapshot
    await prisma.userLessonProgress.upsert({
      where: {
        user_id_lesson_id: {
          user_id: prismaUser.id,
          lesson_id: lessonId,
        },
      },
      create: {
        user_id: prismaUser.id,
        lesson_id: lessonId,
        status: 'IN_PROGRESS',
        attempts: 0,
        code_snapshot: code,
      },
      update: {
        status: 'IN_PROGRESS',
        code_snapshot: code,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('Error saving lesson progress:', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
