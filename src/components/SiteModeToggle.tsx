'use client';

import { useSiteMode } from '@/contexts/SiteModeContext';

const SiteModeToggle = ({ className = '' }: { className?: string }) => {
  const { mode, isManual, toggleMode } = useSiteMode();
  const nextMode = mode === 'cyber' ? 'sketch' : 'cyber';

  return (
    <button
      type="button"
      onClick={toggleMode}
      className={`theme-mode-toggle ${className}`}
      aria-label={`Switch to ${nextMode} mode`}
      title={`Switch to ${nextMode} mode`}
    >
      <span className="theme-mode-toggle-dot" />
      <span>{mode}</span>
      {isManual && <span className="theme-mode-toggle-mark">manual</span>}
    </button>
  );
};

export default SiteModeToggle;
