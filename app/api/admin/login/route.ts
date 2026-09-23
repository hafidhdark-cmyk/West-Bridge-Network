import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminCredentials, generateAdminSessionToken, ADMIN_COOKIE_NAME } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body || {};

    if (!verifyAdminCredentials(email, password)) {
      return NextResponse.json(
        { success: false, error: 'Invalid editorial email or passkey.' },
        { status: 401 }
      );
    }

    const token = generateAdminSessionToken();
    const response = NextResponse.json({ success: true });

    // Set secure cookie for 7 days
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Authentication error.' },
      { status: 500 }
    );
  }
}
