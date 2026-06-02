import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!sessionError) {
      // Get the authenticated user details
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (user && !userError) {
        try {
          // Check if Prisma user profile already exists
          const existingProfile = await prisma.user.findUnique({
            where: { supabase_id: user.id },
          });

          if (!existingProfile) {
            // Generate a unique, sanitized username from the email prefix
            let baseUsername = user.email ? user.email.split('@')[0] : 'user';
            
            // Retain only alphanumeric characters and underscores
            baseUsername = baseUsername.replace(/[^a-zA-Z0-9_]/g, '');
            
            // Adjust length constraints
            if (baseUsername.length < 3) {
              baseUsername = `user_${baseUsername}`;
            }
            baseUsername = baseUsername.substring(0, 15);

            // Handle uniqueness conflict check
            let username = baseUsername;
            let counter = 1;
            while (true) {
              const duplicateUsername = await prisma.user.findUnique({
                where: { username },
              });
              if (!duplicateUsername) {
                break;
              }
              username = `${baseUsername.substring(0, 15 - String(counter).length - 1)}_${counter}`;
              counter++;
            }

            // Create profile
            await prisma.user.create({
              data: {
                supabase_id: user.id,
                username,
                email: user.email!,
                avatar_url: user.user_metadata?.avatar_url || null,
                xp: 0,
                level: 1,
                streak_count: 0,
                streak_freeze_count: 1,
              },
            });
            console.log(`Automatically synchronized Prisma profile for OAuth user: ${username}`);
          }
        } catch (dbError) {
          console.error('Failed to auto-sync profile in OAuth callback:', dbError);
          // Proceed with redirection even if profile creation fails,
          // the app can handle missing profiles in dashboard.
        }
      }
      
      return NextResponse.redirect(`${origin}${next}`);
    }
    
    console.error('Session exchange error:', sessionError);
  }

  // Redirect to login with error details if something fails
  return NextResponse.redirect(`${origin}/login?error=Authentication failed. Please try again.`);
}
