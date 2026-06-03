import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { code, language, error } = await req.json();

    if (!code || !error) {
      return NextResponse.json({ error: 'Missing code or error' }, { status: 400 });
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return NextResponse.json({ error: 'Groq API key not configured' }, { status: 500 });
    }

    const systemPrompt = `You are an expert ${language} programming tutor. A student encountered an error while running their code. Your job is to:
1. Briefly explain what caused the error in plain English (2-3 sentences max)
2. Provide the corrected, complete version of the code

IMPORTANT formatting rules:
- Return ONLY valid JSON matching this exact shape: { "explanation": "...", "fixedCode": "..." }
- The explanation must be plain text (no markdown, no code blocks inside it)
- The fixedCode must be the complete corrected code as a plain string
- Do NOT wrap your response in markdown code fences`;

    const userPrompt = `Language: ${language}

Code:
\`\`\`${language}
${code}
\`\`\`

Error message:
${error}

Return JSON only.`;

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 1024,
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error('Groq API error:', errText);
      return NextResponse.json({ error: 'AI service error' }, { status: 502 });
    }

    const groqData = await groqRes.json();
    const content = groqData.choices?.[0]?.message?.content ?? '';

    // Strip potential markdown fences before parsing
    const cleaned = content.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

    let parsed: { explanation: string; fixedCode: string };
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      // Fallback: return raw content as explanation if JSON parse fails
      return NextResponse.json({
        explanation: content,
        fixedCode: code,
      });
    }

    return NextResponse.json({
      explanation: parsed.explanation ?? 'No explanation available.',
      fixedCode: parsed.fixedCode ?? code,
    });
  } catch (err: any) {
    console.error('fix-suggestion route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
