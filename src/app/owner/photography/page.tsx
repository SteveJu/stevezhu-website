import Link from 'next/link';
import OwnerHomeLink from '@/components/OwnerHomeLink';
import OwnerPageGate from '@/components/OwnerPageGate';
import PhotographyManager from '@/components/PhotographyManager';
import SiteModeFrame from '@/components/SiteModeFrame';

const PhotographyManagerPage = () => {
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
                <h1 className="theme-heading">摄影作品管理</h1>
                <p className="theme-copy mt-6 text-lg leading-8">
                  管理主页 Photography section 的 albums 和照片。照片文件存 R2，数据库只保存展示信息。
                </p>
              </div>
            </div>
            <PhotographyManager />
          </div>
        </section>
      </OwnerPageGate>
    </SiteModeFrame>
  );
};

export default PhotographyManagerPage;
