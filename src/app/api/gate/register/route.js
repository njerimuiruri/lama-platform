import { NextResponse } from 'next/server';

const BACKEND = process.env.BACKEND_URL || 'http://localhost:3001';

/**
 * POST /api/gate/register
 * Proxies to the LAMA backend → POST /users/register
 * Body: { firstName, lastName, email, country, organization, purpose }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, country, organization, purpose } = body;

    if (!firstName || !lastName || !email || !country || !purpose) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }

    const res = await fetch(`${BACKEND}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, country, organization, purpose }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json(
        { message: data.message || 'Registration failed.' },
        { status: res.status }
      );
    }

    const response = NextResponse.json({ success: true }, { status: 200 });

    if (data.access_token) {
      response.cookies.set('lama_token', data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 8, // 8 hours
      });
    }

    return response;
  } catch (err) {
    console.error('[ContentGate] Registration error:', err);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}
