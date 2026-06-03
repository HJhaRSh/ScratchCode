import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  return NextResponse.json(
    { 
      error: "Server-side python execution is disabled for safety. Please use the client-side Skulpt visualizer." 
    },
    { status: 400 }
  );
}
