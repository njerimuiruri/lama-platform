import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND = process.env.BACKEND_URL || 'http://localhost:3001';

/**
 * GET /api/indicators/[dataset]
 * Server-side proxy — reads lama_token cookie, fetches all pages from
 * the backend and returns the full dataset to the component.
 * Requires the user to be registered (cookie must be present).
 */
export async function GET(request, { params }) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('lama_token');

    // No token — return empty array so components render without crashing.
    // DataGate handles the visual blur/lock overlay on the frontend.
    if (!token?.value) {
      return NextResponse.json([]);
    }

    const { dataset } = params;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.value}`,
    };

    // Fetch all pages from the backend
    let allData = [];
    let page = 1;
    const limit = 100;

    while (true) {
      const res = await fetch(
        `${BACKEND}/indicators/${dataset}?page=${page}&limit=${limit}`,
        { headers },
      );

      // Token expired or invalid — return empty array, DataGate will prompt re-auth
      if (!res.ok) {
        return NextResponse.json([]);
      }

      const json = await res.json();
      allData = allData.concat(json.data || []);

      if (page >= (json.pagination?.pages || 1)) break;
      page++;
    }

    return NextResponse.json(allData);
  } catch {
    return NextResponse.json([]);
  }
}
