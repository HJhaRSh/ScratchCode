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
Your job is to give a hint that nudges the learner in the right direction, spot mistakes in their code, and provide structural corrections.

You MUST respond in strict JSON format with exactly two keys:
{
  "hint_text": "Your conversational response. Be concise (2-3 sentences max). Spot their mistake clearly. Be warm and encouraging.",
  "snippet": "A small code snippet showing the correction, the exact syntax needed, or a structural outline. Leave as an empty string if no code snippet is needed."
}

Rules:
- Address the learner as 'you'.
- Spot the specific syntax or logic error if present in their code.
- Provide a useful structural snippet in the "snippet" field.`;

    const userMessage = `Lesson goal: ${lesson.title}
The learner is trying to: ${exerciseDescription}
Their current code:
\`\`\`${lesson.language}
${code || ''}
\`\`\`
The error or wrong output they got: ${error_output || 'None'}
This is hint number ${hint_number || 1} of 3. Give hint ${hint_number || 1} in JSON format.`;

    // 6. Groq API Call
    let hintText = "You are so close! Re-check if your parameters match the requested structures.";
    let hintSnippet = "";

    if (process.env.GROQ_API_KEY) {
      const response = await groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        max_tokens: 400,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
      });

      const responseContent = response.choices[0]?.message?.content;
      if (responseContent) {
        try {
          const parsed = JSON.parse(responseContent);
          hintText = parsed.hint_text || hintText;
          hintSnippet = parsed.snippet || "";
        } catch (e) {
          console.error("Failed to parse JSON hint response", e);
          hintText = responseContent;
        }
      }
    }

    // 7. Save hint usage record to HintUsage table
    await prisma.hintUsage.create({
      data: {
        user_id: dbUser.id,
        lesson_id: lesson.id,
        hint_number: Number(hint_number || 1),
        response_text: JSON.stringify({ hint_text: hintText, snippet: hintSnippet }),
      },
    });

    // 8. Return hint details to client
    return NextResponse.json({
      hint_number: Number(hint_number || 1),
      hint_text: hintText,
      snippet: hintSnippet,
    });
  } catch (err: any) {
    console.error('Error generating AI hint:', err);
    return NextResponse.json(
      { error: 'Failed to generate AI hint', code: 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    );
  }
}
