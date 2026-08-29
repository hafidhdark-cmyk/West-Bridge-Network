import { NextResponse } from 'next/server';

export async function GET() {
  const adsTxtContent = `google.com, pub-2566916860240984, DIRECT, f08c47fec0942fa0\n`;
  return new NextResponse(adsTxtContent, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
