import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Verify Supabase session (check Authorization header first, fallback to cookies)
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    let user = null;
    let authError = null;

    if (token) {
      const { data, error } = await supabase.auth.getUser(token);
      user = data.user;
      authError = error;
    } else {
      const { data, error } = await supabase.auth.getUser();
      user = data.user;
      authError = error;
    }

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid session', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }


    // Read payload
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON request body', code: 'BAD_REQUEST' },
        { status: 400 }
      );
    }

    const { username } = body;

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required', code: 'BAD_REQUEST' },
        { status: 400 }
      );
    }

    const trimmedUsername = username.trim();

    // Validation: username 3–20 chars, alphanumeric + underscore only
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(trimmedUsername)) {
      return NextResponse.json(
        { error: 'Username must be 3-20 characters long and contain only letters, numbers, or underscores', code: 'BAD_REQUEST' },
        { status: 400 }
      );
    }

    // Check if user profile already exists for this Supabase ID
    const existingProfileById = await prisma.user.findUnique({
      where: { supabase_id: user.id },
    });

    if (existingProfileById) {
      return NextResponse.json(
        { error: 'Profile already exists for this user', code: 'CONFLICT', profile: existingProfileById },
        { status: 409 }
      );
    }

    // Check if username is already taken
    const existingProfileByUsername = await prisma.user.findUnique({
      where: { username: trimmedUsername },
    });

    if (existingProfileByUsername) {
      return NextResponse.json(
        { error: 'Username is already taken', code: 'USERNAME_TAKEN' },
        { status: 400 }
      );
    }

    // Create User profile in Prisma
    const newProfile = await prisma.user.create({
      data: {
        supabase_id: user.id,
        username: trimmedUsername,
        email: user.email!,
        avatar_url: user.user_metadata?.avatar_url || null,
        xp: 0,
        level: 1,
        streak_count: 0,
        streak_freeze_count: 1,
      },
    });

    return NextResponse.json({ success: true, profile: newProfile }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating profile:', error);
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    );
  }
}
