import { NextResponse } from 'next/server';

const BACKEND = process.env.BACKEND_URL || 'http://localhost:3001';

/**
 * GET /api/public/stats
 * Public — no auth required.
 * Returns aggregated dataset counts for the About section.
 */
export async function GET() {
  try {
    const res = await fetch(`${BACKEND}/public/indicators/stats`, {
      next: { revalidate: 3600 }, // cache for 1 hour
    });

    if (!res.ok) {
      return NextResponse.json({ ndc: 0, naps: 0, nccap: 0, cidps: 0, ccap: 0, lla: 0, gga: 0, global: 0 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ ndc: 0, naps: 0, nccap: 0, cidps: 0, ccap: 0, lla: 0, gga: 0, global: 0 });
  }
}
