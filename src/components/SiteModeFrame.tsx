'use client';

import { SiteModeContext } from '@/contexts/SiteModeContext';
import { getSiteMode, getSiteModeLabel, type SiteMode } from '@/lib/siteMode';
import { useEffect, useState } from 'react';

const storageKey = 'stevezhu-site-mode';

const SiteModeFrame = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<SiteMode>(() => getSiteMode());
  const [isManual, setIsManual] = useState(false);

  useEffect(() => {
    const getPreviewMode = () => {
      const modeParam = new URLSearchParams(window.location.search).get('mode');
      return modeParam === 'cyber' || modeParam === 'sketch' ? modeParam : null;
    };

    const getStoredMode = () => {
      const storedMode = window.localStorage.getItem(storageKey);
      return storedMode === 'cyber' || storedMode === 'sketch' ? storedMode : null;
    };

    const refreshMode = () => {
      const previewMode = getPreviewMode();
      const storedMode = getStoredMode();

      setIsManual(Boolean(previewMode ?? storedMode));
      setMode(previewMode ?? storedMode ?? getSiteMode());
    };

    const interval = window.setInterval(refreshMode, 60 * 60 * 1000);
    refreshMode();
    return () => window.clearInterval(interval);
  }, []);

  const toggleMode = () => {
    setMode((currentMode) => {
      const nextMode = currentMode === 'cyber' ? 'sketch' : 'cyber';
      window.localStorage.setItem(storageKey, nextMode);
      return nextMode;
    });
    setIsManual(true);
  };

  return (
    <SiteModeContext.Provider value={{ mode, isManual, toggleMode }}>
      <main
        data-scroll-container
        data-site-mode={mode}
        data-mode-label={getSiteModeLabel(mode)}
        className="site-frame snap-y snap-mandatory overflow-y-scroll h-screen"
      >
        {children}
        <div className="theme-mode-badge" aria-label={`Current visual mode: ${getSiteModeLabel(mode)}`}>
          {isManual ? 'Manual' : 'Auto'} / {getSiteModeLabel(mode)}
        </div>
      </main>
    </SiteModeContext.Provider>
  );
};

export default SiteModeFrame;
