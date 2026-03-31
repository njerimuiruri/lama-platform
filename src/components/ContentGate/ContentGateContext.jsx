'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import FullFormModal from './FullFormModal';
import EmailVerifyModal from './EmailVerifyModal';

const ContentGateContext = createContext(null);

export function ContentGateProvider({ children }) {
  const [status, setStatus] = useState('loading'); // 'loading' | 'unlocked' | 'locked'
  const [popupMode, setPopupMode] = useState('full'); // 'full' | 'email'
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check server-side httpOnly cookie — localStorage no longer used
    fetch('/api/gate/check')
      .then((r) => r.json())
      .then(({ valid }) => {
        // Just set status — never auto-show the modal on page load
        setStatus(valid ? 'unlocked' : 'locked');
      })
      .catch(() => {
        setStatus('locked');
      });
  }, []);

  // Modal opens ONLY when a DataGate fires the custom event (user clicks "Get Free Access")
  useEffect(() => {
    const handler = () => {
      if (status === 'locked') setIsVisible(true);
    };
    window.addEventListener('lama:open-gate', handler);
    return () => window.removeEventListener('lama:open-gate', handler);
  }, [status]);

  // Silent page-visit tracking — fires on every route change for unlocked users
  useEffect(() => {
    if (status !== 'unlocked') return;
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'page_visit', page: pathname }),
    }).catch(() => {});
  }, [pathname, status]);

  const unlock = () => {
    setIsVisible(false);
    // Reload the page so all data fetches re-run with the new cookie
    setTimeout(() => window.location.reload(), 300);
  };

  const isLocked = status === 'locked';
  const isLoading = status === 'loading';

  return (
    <ContentGateContext.Provider
      value={{
        isLoading,
        isUnlocked: !isLocked && !isLoading,
        isLocked,
        popupMode,
        setPopupMode,
        unlock,
      }}
    >
      {children}

      {/* Modal only renders when a DataGate triggered it — never auto on page load */}
      {isVisible && !isLoading && isLocked && (
        <div
          className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300 opacity-100"
        >
          <div className="w-full max-w-lg transition-all duration-300 translate-y-0 opacity-100">
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
      )}
    </ContentGateContext.Provider>
  );
}

export function useContentGate() {
  const ctx = useContext(ContentGateContext);
  if (!ctx) throw new Error('useContentGate must be used inside ContentGateProvider');
  return ctx;
}
