import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { groq } from '@/lib/groq';
import { createClient } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/ratelimit';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { code, error_output, hint_number } = await req.json();

    // 1. Authenticate the request using Supabase JWT
    const supabase = await createClient();
    let supabaseUser = null;

    // Check Authorization header first
    const authHeader = req.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (user && !error) {
        supabaseUser = user;
      }
    }

    // Fallback to cookie-based session
    if (!supabaseUser) {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user && !error) {
        supabaseUser = user;
      }
    }

    if (!supabaseUser) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    // 2. Fetch Prisma User Profile
    const dbUser = await prisma.user.findUnique({
      where: { supabase_id: supabaseUser.id },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User profile not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // 3. Rate Limit Check (Free users max 3 hints/day total)
    const rateLimit = await checkRateLimit(dbUser.id);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'You have reached your daily limit of 3 hints. Keep trying, or come back tomorrow for more guidance!', code: 'RATE_LIMIT_EXCEEDED' },
        { status: 429 }
      );
    }

    // 4. Fetch Lesson details
    const lesson = await prisma.lesson.findUnique({
      where: { id: resolvedParams.id },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Parse exercise description from content_json fields
    const contentJson = lesson.content_json as any;
    const exerciseDescription = contentJson?.instructions || contentJson?.prompt || 'Solve the code exercise';

    // 5. System and User Prompt Setup
    const systemPrompt = `You are a patient, encouraging coding mentor helping a beginner learner.
Your job is to give a hint that nudges the learner in the right direction
WITHOUT giving them the answer or writing code for them.
Hint 1: Give a conceptual nudge. Remind them of the concept they need.
Hint 2: Point to the specific part of their code that needs attention.
Hint 3: Give a very specific structural hint (but still no code).
Rules:
- Maximum 2-3 sentences. Be concise.
- Be warm, encouraging. Never say 'wrong' or 'incorrect'. Say 'almost' or 'close'.
- Do not write code. Do not show the solution. Ever.
- Address the learner as 'you', not 'the user'.`;

    const userMessage = `Lesson goal: ${lesson.title}
The learner is trying to: ${exerciseDescription}
Their current code:
\`\`\`${lesson.language}
${code || ''}
\`\`\`
The error or wrong output they got: ${error_output || 'None'}
This is hint number ${hint_number || 1} of 3. Give hint ${hint_number || 1}.`;

    // 6. Groq API Call
    let hintText = "You are so close! Re-check if your parameters match the requested structures.";

    if (process.env.GROQ_API_KEY) {
      const response = await groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        max_tokens: 200,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
      });

      hintText = response.choices[0]?.message?.content || hintText;
    }

    // 7. Save hint usage record to HintUsage table
    await prisma.hintUsage.create({
      data: {
        user_id: dbUser.id,
        lesson_id: lesson.id,
        hint_number: Number(hint_number || 1),
        response_text: hintText,
      },
    });

    // 8. Return hint details to client
    return NextResponse.json({
      hint_number: Number(hint_number || 1),
      hint_text: hintText,
    });
  } catch (err: any) {
    console.error('Error generating AI hint:', err);
    return NextResponse.json(
      { error: 'Failed to generate AI hint', code: 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    );
  }
}
