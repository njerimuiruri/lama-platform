import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND = process.env.BACKEND_URL || 'http://localhost:3001';

/**
 * POST /api/track
 * Silent activity tracking proxy.
 * Reads the httpOnly lama_token cookie and forwards the event to the backend.
 * Never throws — tracking must never affect the user experience.
 */
export async function POST(request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('lama_token');

    // No token = user not registered, nothing to track
    if (!token?.value) {
      return NextResponse.json({ ok: false }, { status: 200 });
    }

    const body = await request.json().catch(() => ({}));

    await fetch(`${BACKEND}/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify(body),
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    // Silently swallow — tracking should never surface errors to users
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
