import Link from 'next/link';
import CalendarSubscriptionPanel from '@/components/CalendarSubscriptionPanel';
import CalendarUsageStats from '@/components/CalendarUsageStats';
import OwnerHomeLink from '@/components/OwnerHomeLink';
import OwnerPageGate from '@/components/OwnerPageGate';
import SiteModeFrame from '@/components/SiteModeFrame';

const CalendarOwnerPage = () => {
  return (
    <SiteModeFrame showFloatingResume={false}>
      <OwnerPageGate>
        <section className="theme-section owner-page min-h-screen px-6 py-20">
          <OwnerHomeLink />
          <div className="owner-page-shell">
            <Link href="/" className="owner-back-link">Back home</Link>
            <div className="travel-workspace-header">
              <div>
                <p className="theme-kicker mb-5">Owner Workspace</p>
                <h1 className="theme-heading">Calendar</h1>
              </div>
            </div>

            <div className="calendar-owner-grid">
              <CalendarSubscriptionPanel />
              <CalendarUsageStats />
            </div>
          </div>
        </section>
      </OwnerPageGate>
    </SiteModeFrame>
  );
};

export default CalendarOwnerPage;
