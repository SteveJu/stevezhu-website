'use client';

import { useState, useSyncExternalStore } from 'react';

const calendarFeedPath = '/api/world-cup-calendar';
const subscribeToOrigin = () => () => {};
const getClientOrigin = () => window.location.origin;
const getServerOrigin = () => '';

const copyText = async (text: string) => {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fall through to the textarea copy path for browsers without clipboard permission.
    }
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.append(textarea);
  textarea.select();

  const copied = document.execCommand('copy');
  textarea.remove();

  if (!copied) {
    throw new Error('Could not copy calendar URL.');
  }
};

const CalendarSubscriptionPanel = () => {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const origin = useSyncExternalStore(subscribeToOrigin, getClientOrigin, getServerOrigin);
  const feedUrl = origin ? new URL(calendarFeedPath, origin).toString() : calendarFeedPath;
  const webcalUrl = feedUrl.startsWith('http') ? feedUrl.replace(/^https?:/, 'webcal:') : '';

  const copyFeedUrl = async () => {
    try {
      await copyText(feedUrl);
      setCopyState('copied');
    } catch {
      setCopyState('failed');
    }

    window.setTimeout(() => setCopyState('idle'), 1800);
  };

  return (
    <div className="theme-card calendar-subscription-card">
      <div>
        <p className="theme-kicker mb-4">Live ICS Feed</p>
        <h2 className="theme-card-title">Subscription URL</h2>
      </div>

      <code className="calendar-feed-url">{feedUrl}</code>

      <div className="calendar-actions">
        <button type="button" className="theme-button" onClick={copyFeedUrl}>
          {copyState === 'copied' ? 'Copied' : copyState === 'failed' ? 'Copy Failed' : 'Copy URL'}
        </button>
        <a href={calendarFeedPath} className="theme-button">
          Download ICS
        </a>
        {webcalUrl && (
          <a href={webcalUrl} className="theme-button">
            Open Webcal
          </a>
        )}
      </div>
    </div>
  );
};

export default CalendarSubscriptionPanel;
