'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const ownerModeEvent = 'owner-mode-change';

export const checkOwnerStatus = async () => {
  const response = await fetch('/api/owner-status', {
    cache: 'no-store',
    credentials: 'same-origin',
  });

  if (!response.ok) return false;

  const data = (await response.json()) as { unlocked?: boolean };
  return Boolean(data.unlocked);
};

export const loginOwner = async (key: string) => {
  const response = await fetch('/api/owner-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key }),
    credentials: 'same-origin',
  });

  if (!response.ok) return false;

  window.dispatchEvent(new Event(ownerModeEvent));
  return true;
};

const OwnerAccess = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [key, setKey] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const refreshOwnerStatus = () => {
      void checkOwnerStatus().then(setIsUnlocked);
    };

    refreshOwnerStatus();
    window.addEventListener(ownerModeEvent, refreshOwnerStatus);
    window.addEventListener('focus', refreshOwnerStatus);

    return () => {
      window.removeEventListener(ownerModeEvent, refreshOwnerStatus);
      window.removeEventListener('focus', refreshOwnerStatus);
    };
  }, []);

  const submitKey = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (await loginOwner(key)) {
      setIsUnlocked(true);
      setError('');
      setKey('');
      return;
    }

    setError('密钥不对，再试一次。');
  };

  return (
    <div className="theme-owner-access">
      <button
        type="button"
        className="theme-owner-button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-label="Open owner mode"
      >
        <span className="theme-owner-dot" />
        <span>Owner</span>
      </button>

      {isOpen && (
        <div className="theme-owner-panel">
          {isUnlocked ? (
            <>
              <div>
                <p className="theme-owner-eyebrow">Owner Mode</p>
                <p className="theme-owner-title">私人工作台</p>
              </div>
              <div className="theme-owner-links">
                <Link href="/owner/stock-dashboard">Stock Dashboard</Link>
                <Link href="/owner/travel-planner">Travel Planner</Link>
                <Link href="/owner/photography">Photography Manager</Link>
              </div>
            </>
          ) : (
            <form onSubmit={submitKey} className="theme-owner-form">
              <label htmlFor="owner-key">输入密钥进入 owner 模式</label>
              <input
                id="owner-key"
                value={key}
                onChange={(event) => setKey(event.target.value)}
                type="password"
                inputMode="numeric"
                autoComplete="off"
                placeholder="Owner key"
              />
              {error && <p className="theme-owner-error">{error}</p>}
              <button type="submit">Unlock</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default OwnerAccess;
