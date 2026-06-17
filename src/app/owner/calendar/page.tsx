import Link from 'next/link';
import CalendarSubscriptionPanel from '@/components/CalendarSubscriptionPanel';
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
                <p className="theme-copy mt-6 text-lg leading-8">
                  FIFA World Cup 2026 subscription calendar generated from ESPN scoreboard data.
                  The feed stays public so calendar apps can refresh it after deployment.
                </p>
              </div>
            </div>

            <div className="calendar-owner-grid">
              <CalendarSubscriptionPanel />

              <div className="theme-card calendar-info-card">
                <p className="theme-kicker mb-4">Feed Details</p>
                <div className="calendar-detail-list">
                  <div>
                    <span>Coverage</span>
                    <strong>104 matches</strong>
                  </div>
                  <div>
                    <span>Date range</span>
                    <strong>Jun 11 - Jul 19, 2026</strong>
                  </div>
                  <div>
                    <span>Refresh</span>
                    <strong>On calendar app sync</strong>
                  </div>
                  <div>
                    <span>Source</span>
                    <strong>ESPN scoreboard</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </OwnerPageGate>
    </SiteModeFrame>
  );
};

export default CalendarOwnerPage;
