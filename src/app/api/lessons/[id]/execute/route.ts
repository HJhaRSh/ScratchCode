export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Map language identifiers to Judge0 CE IDs
const getJudge0LanguageId = (lang: string): number => {
  switch (lang.toLowerCase()) {
    case 'c':
      return 50; // GCC 9.2.0
    case 'cpp':
    case 'c++':
    case 'c-cpp':
      return 54; // GCC 9.2.0
    case 'java':
      return 62; // OpenJDK 13.0.1
    default:
      return 0;
  }
};

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { code, language, stdin } = await req.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Code is required', code: 'BAD_REQUEST' },
        { status: 400 }
      );
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: resolvedParams.id },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const languageId = getJudge0LanguageId(language || lesson.language);
    if (languageId === 0) {
      return NextResponse.json(
        { error: `Language '${language || lesson.language}' is not supported for remote compilation via Judge0`, code: 'BAD_REQUEST' },
        { status: 400 }
      );
    }

    // Prepare inputs encoded in base64 to prevent payload corruption
    const sourceCodeB64 = Buffer.from(code).toString('base64');
    const stdinB64 = stdin ? Buffer.from(stdin).toString('base64') : '';

    const payload = {
      source_code: sourceCodeB64,
      language_id: languageId,
      stdin: stdinB64,
    };

    const response = await fetch('https://ce.judge0.com/submissions?base64_encoded=true&wait=true', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Judge0 API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    // Decode base64 outputs from Judge0
    const decode = (b64Str: string | null | undefined): string => {
      if (!b64Str) return '';
      return Buffer.from(b64Str, 'base64').toString('utf-8');
    };

    const stdout = decode(data.stdout);
    const stderr = decode(data.stderr);
    const compileOutput = decode(data.compile_output);

    return NextResponse.json({
      stdout,
      stderr,
      compile_output: compileOutput,
      status: data.status,
    });
  } catch (err: any) {
    console.error('Judge0 Execution Error:', err);
    return NextResponse.json(
      { error: 'Remote code execution failed. Ensure correct syntax and try again.', code: 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    );
  }
}
