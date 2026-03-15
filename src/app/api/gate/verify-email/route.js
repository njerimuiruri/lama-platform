import { NextResponse } from 'next/server';

const BACKEND = process.env.BACKEND_URL || 'http://localhost:3001';

/**
 * POST /api/gate/verify-email
 * Proxies to the LAMA backend → POST /users/verify-email
 * Body: { email }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ message: 'Email is required.' }, { status: 400 });
    }

    const res = await fetch(`${BACKEND}/users/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json({ found: false }, { status: 404 });
    }

    if (data.found) {
      return NextResponse.json({ found: true }, { status: 200 });
    }

    return NextResponse.json({ found: false }, { status: 404 });
  } catch (err) {
    console.error('[ContentGate] Email verification error:', err);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}
