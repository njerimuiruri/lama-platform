'use client';

import { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import { useContentGate } from './ContentGateContext';
import FullFormModal from './FullFormModal';
import EmailVerifyModal from './EmailVerifyModal';

export default function LockedSection({ children }) {
  const { isLoading, isUnlocked, isLocked, popupMode, setPopupMode, unlock } =
    useContentGate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isLocked) {
      const t = setTimeout(() => setIsVisible(true), 200);
      return () => clearTimeout(t);
    }
  }, [isLocked]);

  if (isLoading) return null;
  if (isUnlocked) return <>{children}</>;

  return (
    <div className="w-full">

      {/* ── Clipped map preview ── */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: '55vh' }} // shows ~half the map regardless of screen size
      >
        {/* Map renders at full natural height inside, gets clipped by parent */}
        <div
          className="pointer-events-none select-none absolute top-0 left-0 w-full"
          style={{ filter: 'blur(1px)' }}
          aria-hidden="true"
        >
          {children}
        </div>

        {/* Fade out the bottom of the visible slice */}
        <div
          className="absolute bottom-0 inset-x-0 pointer-events-none"
          style={{
            height: '200px',
            background:
              'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.7) 50%, white 100%)',
          }}
        />
      </div>

      {/* ── Form flows naturally below the map preview ── */}
      <div className="w-full bg-white flex flex-col items-center px-4 pt-4 pb-20">
        <div
          className={`flex flex-col items-center gap-2 mb-6 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
        >
          <div className="bg-white rounded-full p-3 shadow-xl border border-gray-100">
            <Lock className="w-6 h-6 text-green-700" />
          </div>
          <p className="text-sm font-medium text-gray-600 text-center max-w-xs leading-relaxed bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-sm">
            Register below to unlock the full map, research data, impact stories, and more.
          </p>
        </div>

        <div
          className={`w-full max-w-lg transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
        >
          {popupMode === 'full' ? (
            <FullFormModal
              onUnlock={unlock}
              onSwitchMode={() => setPopupMode('email')}
            />
          ) : (
            <EmailVerifyModal
              onUnlock={unlock}
              onSwitchMode={() => setPopupMode('full')}
            />
          )}
        </div>
      </div>

    </div>
  );
}