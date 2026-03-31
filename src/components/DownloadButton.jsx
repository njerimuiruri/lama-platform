'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { useTrack } from '@/hooks/useTrack';

/**
 * DownloadButton — triggers a watermarked CSV download for a given dataset.
 *
 * Props:
 *   dataset: 'ndc' | 'naps' | 'nccap' | 'cidps' | 'ccap' | 'lla'
 *   label:   button label (default: 'Download CSV')
 *   className: extra Tailwind classes
 */
export default function DownloadButton({ dataset, label = 'Download CSV', className = '' }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const track = useTrack();

  const handleDownload = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/download/${dataset}`);

      if (res.status === 401) {
        setError('Please register or sign in to download.');
        return;
      }

      if (!res.ok) {
        setError('Download failed. Please try again.');
        return;
      }

      // Trigger browser file save
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lama_${dataset}_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Silent download tracking
      track('download', { detail: `Downloaded ${dataset}.csv` });
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        onClick={handleDownload}
        disabled={loading}
        className={`inline-flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-800 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        {loading ? 'Preparing...' : label}
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
