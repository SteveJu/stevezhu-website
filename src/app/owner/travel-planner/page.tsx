import OwnerPageGate from '@/components/OwnerPageGate';
import OwnerHomeLink from '@/components/OwnerHomeLink';
import SiteModeFrame from '@/components/SiteModeFrame';
import TravelPlannerWorkspace from '@/components/TravelPlannerWorkspace';
import Link from 'next/link';

const TravelPlannerPage = () => {
  return (
    <SiteModeFrame showFloatingResume={false}>
      <OwnerPageGate>
        <section className="theme-section owner-page min-h-screen px-6 py-20">
          <OwnerHomeLink />
          <div className="owner-page-shell">
            <Link href="/" className="owner-back-link">返回首页</Link>
            <TravelPlannerWorkspace />
          </div>
        </section>
      </OwnerPageGate>
    </SiteModeFrame>
  );
};

export default TravelPlannerPage;
