'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { checkOwnerStatus, loginOwner } from './OwnerAccess';
import OwnerHomeLink from './OwnerHomeLink';

const OwnerPageGate = ({ children }: { children: React.ReactNode }) => {
  const [isReady, setIsReady] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [key, setKey] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    void checkOwnerStatus().then((unlocked) => {
      setIsUnlocked(unlocked);
      setIsReady(true);
    });
  }, []);

  const submitKey = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (await loginOwner(key)) {
      setIsUnlocked(true);
      setError('');
      setKey('');
      return;
    }

    setError('密钥不对。');
  };

  if (!isReady || !isUnlocked) {
    return (
      <section className="theme-section owner-page min-h-screen flex items-center px-6 py-20">
        <OwnerHomeLink />
        <div className="owner-page-shell">
          <Link href="/" className="owner-back-link">Back home</Link>
          <div className="theme-card owner-gate-card">
            <p className="theme-kicker mb-4">Owner Mode</p>
            <h1 className="theme-heading">Private Area</h1>
            <form onSubmit={submitKey} className="owner-gate-form">
              <label htmlFor="owner-page-key">输入密钥进入</label>
              <input
                id="owner-page-key"
                value={key}
                onChange={(event) => setKey(event.target.value)}
                type="password"
                inputMode="numeric"
                autoComplete="off"
                placeholder="Owner key"
              />
              {error && <p>{error}</p>}
              <button type="submit" className="theme-button">Unlock</button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  return <>{children}</>;
};

export default OwnerPageGate;
