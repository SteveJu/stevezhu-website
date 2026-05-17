import Link from 'next/link';
import SiteModeFrame from '@/components/SiteModeFrame';
import TravelPlannerWorkspace from '@/components/TravelPlannerWorkspace';

const SharedTravelPage = async ({ params }: { params: Promise<{ shareCode: string }> }) => {
  const { shareCode } = await params;

  return (
    <SiteModeFrame>
      <section className="theme-section owner-page min-h-screen px-6 py-20">
        <div className="owner-page-shell">
          <Link href="/" className="owner-back-link">返回首页</Link>
          <TravelPlannerWorkspace shareCode={shareCode} />
        </div>
      </section>
    </SiteModeFrame>
  );
};

export default SharedTravelPage;
