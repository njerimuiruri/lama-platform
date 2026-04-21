'use client';

import { useContentGate } from './ContentGateContext';
import { Lock, BarChart2, Table2, Download } from 'lucide-react';

const VARIANT_CONFIG = {
  table: {
    icon: Table2,
    label: 'Full Dataset',
    description: 'Register for free to explore the complete indicator database with filters, search, and export.',
  },
  chart: {
    icon: BarChart2,
    label: 'Interactive Charts',
    description: 'Register for free to access the full interactive charts and drill-down analytics.',
  },
  download: {
    icon: Download,
    label: 'Download Data',
    description: 'Register for free to download this dataset in CSV format.',
  },
};

/**
 * Intercepts copy/print shortcuts on unlocked data content.
 * Only active when user is unlocked (we protect real data, not the blur preview).
 */
function handleDataKeyDown(e) {
  const blocked = (
    (e.ctrlKey && ['c', 'a', 's', 'p'].includes(e.key.toLowerCase())) ||
    (e.metaKey && ['c', 'a', 's', 'p'].includes(e.key.toLowerCase()))
  );
  if (blocked) {
    e.preventDefault();
    e.stopPropagation();
  }
}

/**
 * DataGate — wraps any data-heavy content.
 *
 * When locked  → blurred preview + unlock prompt.
 * When unlocked → renders children with copy/print protection applied.
 *
 * Props:
 *   variant:     'table' | 'chart' | 'download'  (default: 'table')
 *   label:       string — override prompt heading
 *   description: string — override prompt description
 */
export default function DataGate({ children, variant = 'table', label, description }) {
  const { isLocked, isLoading, setPopupMode } = useContentGate();

  if (isLoading) return null;

  // ── UNLOCKED: render with copy/print protection ──────────────────────────
  if (!isLocked) {
    return (
      <div
        onContextMenu={(e) => e.preventDefault()}
        onKeyDown={handleDataKeyDown}
        className="lama-protected-data"
      >
        {children}
      </div>
    );
  }

  // ── LOCKED: blurred preview + overlay ────────────────────────────────────
  const config = VARIANT_CONFIG[variant] ?? VARIANT_CONFIG.table;
  const Icon = config.icon;
  const heading = label ?? config.label;
  const body = description ?? config.description;

  const handleUnlock = () => {
    setPopupMode('full');
    window.dispatchEvent(new CustomEvent('lama:open-gate'));
  };

  return (
    <div className="relative rounded-xl overflow-hidden">
      {/* Blurred preview */}
      <div
        className="select-none pointer-events-none"
        aria-hidden="true"
        style={{ filter: 'blur(4px)', maxHeight: '220px', overflow: 'hidden' }}
      >
        {children}
      </div>

      {/* Gradient fade */}
      <div
        className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.97))' }}
      />

      {/* Unlock prompt */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg px-6 py-5 max-w-sm w-full text-center">
          <div className="flex items-center justify-center w-10 h-10 bg-green-50 rounded-full mx-auto mb-3">
            <Lock className="w-5 h-5 text-green-700" />
          </div>
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Icon className="w-4 h-4 text-green-700" />
            <span className="text-sm font-semibold text-gray-800">{heading}</span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed mb-4">{body}</p>
          <button
            onClick={handleUnlock}
            className="w-full bg-green-700 hover:bg-green-800 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
          >
            Get Free Access
          </button>
          <p className="text-xs text-gray-400 mt-2">No subscription. No payment. Just who you are.</p>
        </div>
      </div>
    </div>
  );
}
