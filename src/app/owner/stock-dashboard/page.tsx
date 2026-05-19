import OwnerPageGate from '@/components/OwnerPageGate';
import OwnerHomeLink from '@/components/OwnerHomeLink';
import SiteModeFrame from '@/components/SiteModeFrame';
import Link from 'next/link';

const StockDashboardPage = () => {
  return (
    <SiteModeFrame showFloatingResume={false}>
      <OwnerPageGate>
        <section className="theme-section owner-page min-h-screen flex items-center px-6 py-20">
          <OwnerHomeLink />
          <div className="owner-page-shell">
            <Link href="/" className="owner-back-link">Back home</Link>
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] items-stretch">
              <div>
                <p className="theme-kicker mb-5">Owner Workspace</p>
                <h1 className="theme-heading">Stock Dashboard</h1>
                <p className="theme-copy mt-6 text-lg leading-8">
                  Placeholder for the future market dashboard. This page is ready for watchlists,
                  positions, alerts, and AI-assisted investment notes when you want to build it out.
                </p>
              </div>

              <div className="theme-card owner-placeholder-card">
                <div className="owner-placeholder-grid">
                  <div>
                    <span>Watchlist</span>
                    <strong>Coming Soon</strong>
                  </div>
                  <div>
                    <span>Signals</span>
                    <strong>--</strong>
                  </div>
                  <div>
                    <span>Portfolio</span>
                    <strong>--</strong>
                  </div>
                  <div>
                    <span>Alerts</span>
                    <strong>0</strong>
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

export default StockDashboardPage;
