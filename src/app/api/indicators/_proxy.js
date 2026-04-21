import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

const BACKEND = process.env.BACKEND_URL || 'http://localhost:3001';

export async function proxyIndicator(endpoint, fallbackFile) {
  try {
    const all = [];
    let page = 1;
    const limit = 500;

    while (true) {
      const res = await fetch(
        `${BACKEND}/public/indicators/${endpoint}?page=${page}&limit=${limit}`,
        { cache: 'no-store' },
      );

      if (!res.ok) break;

      const json = await res.json();
      if (!json.data || json.data.length === 0) break;

      all.push(...json.data);
      if (page >= json.pagination.pages) break;
      page++;
    }

    if (all.length > 0) return NextResponse.json(all);

    // Backend unavailable or empty — fall back to local file
    console.warn(`[/api/indicators/${endpoint}] falling back to ${fallbackFile}`);
    const raw = readFileSync(join(process.cwd(), 'public', 'documents', fallbackFile), 'utf-8');
    return NextResponse.json(JSON.parse(raw));
  } catch (err) {
    console.warn(`[/api/indicators/${endpoint}] backend error, using local file:`, err.message);
    try {
      const raw = readFileSync(join(process.cwd(), 'public', 'documents', fallbackFile), 'utf-8');
      return NextResponse.json(JSON.parse(raw));
    } catch (fileErr) {
      console.error(`[/api/indicators/${endpoint}] local fallback failed:`, fileErr.message);
      return NextResponse.json({ message: 'Data unavailable.' }, { status: 500 });
    }
  }
}
