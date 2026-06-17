'use client';

import { useEffect, useState } from 'react';
import type { WorldCupCalendarUsageStats } from '@/lib/worldCupCalendarUsage';

type UsageState =
  | { status: 'loading'; stats?: never; error?: never }
  | { status: 'ready'; stats: WorldCupCalendarUsageStats; error?: never }
  | { status: 'error'; stats?: never; error: string };

const CalendarUsageStats = () => {
  const [usageState, setUsageState] = useState<UsageState>({ status: 'loading' });

  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      try {
        const response = await fetch('/api/world-cup-calendar/usage', {
          cache: 'no-store',
          credentials: 'same-origin',
        });
        const data = (await response.json().catch(() => null)) as {
          stats?: WorldCupCalendarUsageStats;
          error?: string;
        } | null;

        if (!isMounted) return;

        if (!response.ok || !data?.stats) {
          setUsageState({
            status: 'error',
            error: data?.error ?? 'Usage stats are unavailable.',
          });
          return;
        }

        setUsageState({ status: 'ready', stats: data.stats });
      } catch (error) {
        if (!isMounted) return;

        setUsageState({
          status: 'error',
          error: error instanceof Error ? error.message : 'Usage stats are unavailable.',
        });
      }
    };

    void loadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="theme-card calendar-usage-card">
      <div>
        <p className="theme-kicker mb-4">Usage Estimate</p>
        <h2 className="theme-card-title">Subscribers</h2>
      </div>

      {usageState.status === 'loading' && <p className="calendar-usage-message">Loading usage...</p>}

      {usageState.status === 'error' && (
        <p className="calendar-usage-message">
          Usage tracking needs the Supabase calendar usage migration before stats appear.
        </p>
      )}

      {usageState.status === 'ready' && (
        <>
          <div className="calendar-usage-grid">
            <div>
              <span>24h</span>
              <strong>{usageState.stats.active24h}</strong>
            </div>
            <div>
              <span>7d</span>
              <strong>{usageState.stats.active7d}</strong>
            </div>
            <div>
              <span>30d</span>
              <strong>{usageState.stats.active30d}</strong>
            </div>
            <div>
              <span>Total Seen</span>
              <strong>{usageState.stats.estimatedSubscribers}</strong>
            </div>
          </div>
          <p className="calendar-usage-message">
            {usageState.stats.totalRequests} calendar refreshes recorded.
          </p>
        </>
      )}
    </div>
  );
};

export default CalendarUsageStats;
