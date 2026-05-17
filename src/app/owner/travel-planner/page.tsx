import OwnerPageGate from '@/components/OwnerPageGate';
import OwnerHomeLink from '@/components/OwnerHomeLink';
import SiteModeFrame from '@/components/SiteModeFrame';
import Link from 'next/link';

const TravelPlannerPage = () => {
  const upcomingModules = [
    '目的地与日期规划',
    '航班、酒店、预算记录',
    '每日行程时间线',
    '餐厅、景点、拍照点收藏',
  ];

  return (
    <SiteModeFrame>
      <OwnerPageGate>
        <section className="theme-section owner-page min-h-screen flex items-center px-6 py-20">
          <OwnerHomeLink />
          <div className="owner-page-shell">
            <Link href="/" className="owner-back-link">返回首页</Link>
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] items-start">
              <div>
                <p className="theme-kicker mb-5">Owner Workspace</p>
                <h1 className="theme-heading">旅行计划</h1>
                <p className="theme-copy mt-6 text-lg leading-8">
                  这里会变成你的旅行规划工作台：从想去哪里、什么时候出发，到每天怎么安排、预算怎么控制，都可以集中在这个页面里。
                </p>
              </div>

              <div className="theme-card owner-travel-card">
                <div className="owner-travel-header">
                  <span>下一步功能</span>
                  <strong>Travel Planner v0</strong>
                </div>
                <div className="owner-travel-list">
                  {upcomingModules.map((item) => (
                    <div key={item}>
                      <span />
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
                <div className="owner-travel-note">
                  之后可以继续加：城市卡片、地图链接、AI 生成行程、共享清单、签证/证件提醒。
                </div>
              </div>
            </div>
          </div>
        </section>
      </OwnerPageGate>
    </SiteModeFrame>
  );
};

export default TravelPlannerPage;
