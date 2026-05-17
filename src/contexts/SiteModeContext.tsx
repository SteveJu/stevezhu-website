'use client';

import { createContext, useContext } from 'react';
import type { SiteMode } from '@/lib/siteMode';

interface SiteModeContextValue {
  mode: SiteMode;
  isManual: boolean;
  toggleMode: () => void;
}

export const SiteModeContext = createContext<SiteModeContextValue | undefined>(undefined);

export const useSiteMode = () => {
  const context = useContext(SiteModeContext);
  if (!context) {
    throw new Error('useSiteMode must be used within SiteModeContext');
  }
  return context;
};
