'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import FullFormModal from './FullFormModal';
import EmailVerifyModal from './EmailVerifyModal';

const STORAGE_KEY = 'lama_access_granted';

const ContentGateContext = createContext(null);

export function ContentGateProvider({ children }) {
  const [status, setStatus] = useState('loading'); // 'loading' | 'unlocked' | 'locked'
  const [popupMode, setPopupMode] = useState('full'); // 'full' | 'email'
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  useEffect(() => {
    try {
      const granted = localStorage.getItem(STORAGE_KEY);
      const resolved = granted === 'true' ? 'unlocked' : 'locked';
      setStatus(resolved);
      // Animate in after a short delay
      if (resolved === 'locked') {
        setTimeout(() => setIsVisible(true), 100);
      }
    } catch {
      setStatus('locked');
      setTimeout(() => setIsVisible(true), 100);
    }
  }, []);

  const unlock = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {}
    setIsVisible(false);
    setTimeout(() => setStatus('unlocked'), 300);
  };

  const isLocked = status === 'locked';
  const isLoading = status === 'loading';

  // Show global overlay on every page EXCEPT the homepage.
  // On the homepage, LockedSection handles its own gate.
  const showGlobalGate = !isHomePage && !isLoading && isLocked;

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

      {showGlobalGate && (
        <div
          className={`fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className={`w-full max-w-lg transition-all duration-300 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
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
      )}
    </ContentGateContext.Provider>
  );
}

export function useContentGate() {
  const ctx = useContext(ContentGateContext);
  if (!ctx) throw new Error('useContentGate must be used inside ContentGateProvider');
  return ctx;
}
