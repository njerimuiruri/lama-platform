import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND = process.env.BACKEND_URL || 'http://localhost:3001';

/** POST /api/contributions — authenticated platform user submits data */
export async function POST(request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('lama_token');

    if (!token?.value) {
      return NextResponse.json({ message: 'You must be registered to submit data.' }, { status: 401 });
    }

    const body = await request.json();

    const res = await fetch(`${BACKEND}/contributions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('[Contributions] POST error:', err);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}

/** GET /api/contributions — returns the current user's own submissions */
export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('lama_token');

    if (!token?.value) {
      return NextResponse.json([], { status: 200 });
    }

    const res = await fetch(`${BACKEND}/contributions/mine`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });

    const data = await res.json().catch(() => []);
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('[Contributions] GET error:', err);
    return NextResponse.json([], { status: 500 });
  }
}
