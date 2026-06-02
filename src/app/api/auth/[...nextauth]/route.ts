export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: 'NextAuth dynamic endpoint GET' });
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ message: 'NextAuth dynamic endpoint POST' });
}
