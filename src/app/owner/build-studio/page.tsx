import Link from 'next/link';
import BuildStudioManager from '@/components/BuildStudioManager';
import OwnerHomeLink from '@/components/OwnerHomeLink';
import OwnerPageGate from '@/components/OwnerPageGate';
import SiteModeFrame from '@/components/SiteModeFrame';

const BuildStudioManagerPage = () => {
  return (
    <SiteModeFrame showFloatingResume={false}>
      <OwnerPageGate>
        <section className="theme-section owner-page min-h-screen px-6 py-20">
          <OwnerHomeLink />
          <div className="owner-page-shell">
            <Link href="/" className="owner-back-link">返回首页</Link>
            <div className="travel-workspace-header">
              <div>
                <p className="theme-kicker mb-5">Owner Workspace</p>
                <h1 className="theme-heading">Build Studio</h1>
                <p className="theme-copy mt-6 text-lg leading-8">
                  管理 Build Studio 的 inquiry pipeline。主页负责展示和收集需求，这里负责估值和跟进。
                </p>
              </div>
            </div>
            <BuildStudioManager />
          </div>
        </section>
      </OwnerPageGate>
    </SiteModeFrame>
  );
};

export default BuildStudioManagerPage;
