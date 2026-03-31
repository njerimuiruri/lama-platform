import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * GET /api/gate/check
 * Server-side check — reads the httpOnly lama_token cookie.
 * Returns { valid: true } if the cookie exists, { valid: false } otherwise.
 * The actual JWT validation happens on the backend when data is fetched.
 */
export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get('lama_token');

  if (!token?.value) {
    return NextResponse.json({ valid: false });
  }

  return NextResponse.json({ valid: true });
}
