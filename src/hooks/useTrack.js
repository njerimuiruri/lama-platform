'use client';

/**
 * useTrack — silent activity tracker.
 *
 * Usage:
 *   const track = useTrack();
 *   track('table_view', { detail: 'Opened NDC table' });
 *   track('download', { detail: 'Downloaded naps.csv' });
 */
export function useTrack() {
  const track = (event, extras = {}) => {
    const payload = {
      event,
      page: typeof window !== 'undefined' ? window.location.pathname : null,
      ...extras,
    };

    // Fire and forget — no await, no error surfaced
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {});
  };

  return track;
}
