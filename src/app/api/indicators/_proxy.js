import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

const BACKEND = process.env.BACKEND_URL || 'http://localhost:3001';

async function fetchCommunityRows(dataset) {
  try {
    const res = await fetch(`${BACKEND}/public/contributions/${dataset}`, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

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

    let lamaRows = all;

    if (lamaRows.length === 0) {
      console.warn(`[/api/indicators/${endpoint}] falling back to ${fallbackFile}`);
      const raw = readFileSync(join(process.cwd(), 'public', 'documents', fallbackFile), 'utf-8');
      lamaRows = JSON.parse(raw);
    }

    // Tag LAMA rows and merge with approved community contributions
    const tagged = lamaRows.map((r) => ({ ...r, _source: 'lama' }));
    const community = await fetchCommunityRows(endpoint);

    return NextResponse.json([...tagged, ...community]);
  } catch (err) {
    console.warn(`[/api/indicators/${endpoint}] backend error, using local file:`, err.message);
    try {
      const raw = readFileSync(join(process.cwd(), 'public', 'documents', fallbackFile), 'utf-8');
      const lamaRows = JSON.parse(raw).map((r) => ({ ...r, _source: 'lama' }));
      return NextResponse.json(lamaRows);
    } catch (fileErr) {
      console.error(`[/api/indicators/${endpoint}] local fallback failed:`, fileErr.message);
      return NextResponse.json({ message: 'Data unavailable.' }, { status: 500 });
    }
  }
}
