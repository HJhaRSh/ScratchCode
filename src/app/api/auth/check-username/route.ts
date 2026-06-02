import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { available: false, error: 'Username parameter is required', code: 'BAD_REQUEST' },
        { status: 400 }
      );
    }

    const trimmedUsername = username.trim();

    // Validation: username 3–20 chars, alphanumeric + underscore only
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(trimmedUsername)) {
      return NextResponse.json(
        {
          available: false,
          error: 'Username must be 3-20 characters long and contain only letters, numbers, or underscores',
          code: 'BAD_REQUEST'
        },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { username: trimmedUsername },
    });

    if (existingUser) {
      return NextResponse.json(
        { available: false, error: 'Username is already taken', code: 'USERNAME_TAKEN' },
        { status: 400 }
      );
    }

    return NextResponse.json({ available: true });
  } catch (error: any) {
    console.error('Error checking username:', error);
    return NextResponse.json(
      { available: false, error: 'Internal server error', code: 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    );
  }
}
