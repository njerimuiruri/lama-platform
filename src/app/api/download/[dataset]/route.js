import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND = process.env.BACKEND_URL || 'http://localhost:3001';

/**
 * GET /api/download/[dataset]
 * Reads lama_token cookie, calls backend GET /download/:dataset,
 * streams the watermarked CSV back to the browser as a file download.
 */
export async function GET(request, { params }) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('lama_token');

    if (!token?.value) {
      return NextResponse.json({ message: 'Not authenticated.' }, { status: 401 });
    }

    const { dataset } = params;
    if (!dataset) {
      return NextResponse.json({ message: 'Dataset required.' }, { status: 400 });
    }

    const res = await fetch(`${BACKEND}/download/${dataset}`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });

    if (!res.ok) {
      return NextResponse.json({ message: 'Download failed.' }, { status: res.status });
    }

    const csv = await res.text();
    const filename = `lama_${dataset}_${new Date().toISOString().slice(0, 10)}.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch {
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}
