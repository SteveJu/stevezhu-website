'use client';

import { useMemo, useState } from 'react';

type PlannerView = 'list' | 'editor';

type TravelRecord = {
  id: string;
  title: string;
  dates: string;
  status: string;
  summary: string;
};

type TravelModule = {
  id: string;
  label: string;
  description: string;
  fields: Array<{
    label: string;
    placeholder: string;
    type?: 'text' | 'date' | 'number' | 'textarea';
  }>;
};

type TravelFormValues = Record<string, Record<string, Record<string, string>>>;

const initialTravels: TravelRecord[] = [
  {
    id: 'tokyo-2026',
    title: '东京春季旅行',
    dates: '2026.04.03 - 2026.04.12',
    status: '规划中',
    summary: '机票待确认，酒店优先看银座/涩谷，想安排两天自由拍照。',
  },
  {
    id: 'iceland-2025',
    title: '冰岛自驾',
    dates: '2025.11.18 - 2025.11.27',
    status: '草稿',
    summary: '需要补充租车保险、极光地点、每日路程时间。',
  },
  {
    id: 'paris-2024',
    title: '巴黎短途',
    dates: '2024.09.05 - 2024.09.10',
    status: '已归档',
    summary: '保留餐厅和照片点记录，未来可以复用。',
  },
];

const travelModules: TravelModule[] = [
  {
    id: 'flight',
    label: '机票',
    description: '记录航班、时间、机场、确认号和行李信息。',
    fields: [
      { label: '航空公司', placeholder: '例如 Delta / ANA / United' },
      { label: '航班号', placeholder: '例如 DL123' },
      { label: '出发时间', placeholder: '选择或填写出发时间' },
      { label: '到达时间', placeholder: '选择或填写到达时间' },
      { label: '确认号', placeholder: 'Booking reference' },
      { label: '备注', placeholder: '行李、座位、转机注意事项', type: 'textarea' },
    ],
  },
  {
    id: 'hotel',
    label: '酒店',
    description: '保存住宿名称、地址、入住退房和预订信息。',
    fields: [
      { label: '酒店名称', placeholder: '酒店 / Airbnb / 民宿名称' },
      { label: '地址', placeholder: '完整地址' },
      { label: '入住日期', placeholder: 'Check-in', type: 'date' },
      { label: '退房日期', placeholder: 'Check-out', type: 'date' },
      { label: '预订平台', placeholder: 'Booking / Amex Travel / Airbnb' },
      { label: '备注', placeholder: '早餐、停车、寄存行李、会员权益', type: 'textarea' },
    ],
  },
  {
    id: 'place',
    label: '地点',
    description: '收藏景点、餐厅、拍照点和想去的区域。',
    fields: [
      { label: '地点名称', placeholder: '例如 明治神宫 / teamLab / 某家餐厅' },
      { label: '类别', placeholder: '景点 / 餐厅 / 咖啡 / 拍照点' },
      { label: '城市区域', placeholder: '例如 Shibuya / Ginza' },
      { label: '优先级', placeholder: '必去 / 想去 / 有空再去' },
      { label: '链接', placeholder: 'Google Maps / 官网 / 小红书链接' },
      { label: '备注', placeholder: '营业时间、预约要求、拍照灵感', type: 'textarea' },
    ],
  },
  {
    id: 'car',
    label: '租车',
    description: '整理取车还车、保险、驾照和停车信息。',
    fields: [
      { label: '租车公司', placeholder: 'Hertz / Avis / Toyota Rent a Car' },
      { label: '取车地点', placeholder: '机场 / 门店地址' },
      { label: '还车地点', placeholder: '同地点或异地还车' },
      { label: '车型', placeholder: 'SUV / Compact / EV' },
      { label: '预计费用', placeholder: '金额', type: 'number' },
      { label: '备注', placeholder: '保险、ETC、国际驾照、停车规则', type: 'textarea' },
    ],
  },
  {
    id: 'schedule',
    label: '每日行程',
    description: '把一天拆成上午、下午、晚上，先粗排节奏。',
    fields: [
      { label: '日期', placeholder: '选择日期', type: 'date' },
      { label: '上午', placeholder: '上午安排', type: 'textarea' },
      { label: '下午', placeholder: '下午安排', type: 'textarea' },
      { label: '晚上', placeholder: '晚上安排', type: 'textarea' },
      { label: '当天重点', placeholder: '这一天最重要的一件事' },
    ],
  },
  {
    id: 'budget',
    label: '预算',
    description: '按类别记录预算和实际花费，之后可以做统计。',
    fields: [
      { label: '类别', placeholder: '机票 / 酒店 / 吃饭 / 交通 / 购物' },
      { label: '预计金额', placeholder: '预算', type: 'number' },
      { label: '实际金额', placeholder: '实际花费', type: 'number' },
      { label: '币种', placeholder: 'USD / JPY / EUR' },
      { label: '备注', placeholder: '付款方式、是否报销、退款状态', type: 'textarea' },
    ],
  },
];

const createNewTravel = (index: number): TravelRecord => ({
  id: `new-trip-${index}`,
  title: '新的旅行计划',
  dates: '待定',
  status: '新建',
  summary: '从左侧选择机票、酒店、地点、租车等模块，逐项补充信息。',
});

const TravelPlannerWorkspace = () => {
  const [view, setView] = useState<PlannerView>('list');
  const [travels, setTravels] = useState(initialTravels);
  const [activeTravelId, setActiveTravelId] = useState(initialTravels[0]?.id ?? '');
  const [activeModuleId, setActiveModuleId] = useState(travelModules[0].id);
  const [formValues, setFormValues] = useState<TravelFormValues>({});

  const activeTravel = useMemo(() => {
    return travels.find((travel) => travel.id === activeTravelId) ?? travels[0];
  }, [activeTravelId, travels]);

  const activeModule = useMemo(() => {
    return travelModules.find((module) => module.id === activeModuleId) ?? travelModules[0];
  }, [activeModuleId]);

  const openEditor = (travelId: string) => {
    setActiveTravelId(travelId);
    setView('editor');
  };

  const addTravel = () => {
    const nextTravel = createNewTravel(travels.length + 1);
    setTravels((currentTravels) => [nextTravel, ...currentTravels]);
    setActiveTravelId(nextTravel.id);
    setActiveModuleId(travelModules[0].id);
    setView('editor');
  };

  const getFieldValue = (fieldLabel: string) => {
    return formValues[activeTravel?.id ?? '']?.[activeModule.id]?.[fieldLabel] ?? '';
  };

  const updateFieldValue = (fieldLabel: string, value: string) => {
    if (!activeTravel) return;

    setFormValues((currentValues) => ({
      ...currentValues,
      [activeTravel.id]: {
        ...currentValues[activeTravel.id],
        [activeModule.id]: {
          ...currentValues[activeTravel.id]?.[activeModule.id],
          [fieldLabel]: value,
        },
      },
    }));
  };

  if (view === 'editor') {
    return (
      <div className="travel-workspace">
        <div className="travel-workspace-header">
          <div>
            <p className="theme-kicker mb-4">Travel Editor</p>
            <h1 className="theme-heading">{activeTravel?.title ?? '旅行计划'}</h1>
            <p className="theme-copy mt-4 text-base leading-7">
              {activeTravel?.summary}
            </p>
          </div>
          <button type="button" className="theme-button" onClick={() => setView('list')}>
            返回列表
          </button>
        </div>

        <div className="travel-editor-grid">
          <aside className="theme-card travel-module-menu">
            <p className="travel-panel-label">信息模块</p>
            {travelModules.map((module) => (
              <button
                key={module.id}
                type="button"
                className={activeModule.id === module.id ? 'is-active' : ''}
                onClick={() => setActiveModuleId(module.id)}
              >
                <span>{module.label}</span>
                <small>{module.description}</small>
              </button>
            ))}
          </aside>

          <section className="theme-card travel-entry-panel">
            <div className="travel-entry-heading">
              <div>
                <p className="travel-panel-label">当前填写</p>
                <h2>{activeModule.label}</h2>
              </div>
              <span>{activeTravel?.status}</span>
            </div>

            <div className="travel-form-grid">
              {activeModule.fields.map((field) => (
                <label
                  key={`${activeModule.id}-${field.label}`}
                  className={field.type === 'textarea' ? 'is-wide' : ''}
                >
                  <span>{field.label}</span>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={getFieldValue(field.label)}
                      onChange={(event) => updateFieldValue(field.label, event.target.value)}
                      placeholder={field.placeholder}
                      rows={4}
                    />
                  ) : (
                    <input
                      value={getFieldValue(field.label)}
                      onChange={(event) => updateFieldValue(field.label, event.target.value)}
                      type={field.type ?? 'text'}
                      placeholder={field.placeholder}
                    />
                  )}
                </label>
              ))}
            </div>

            <div className="travel-entry-actions">
              <button type="button" className="theme-button">保存草稿</button>
              <button type="button" className="travel-secondary-button">添加另一个 {activeModule.label}</button>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="travel-workspace">
      <div className="travel-workspace-header">
        <div>
          <p className="theme-kicker mb-4">Owner Workspace</p>
          <h1 className="theme-heading">旅行计划</h1>
          <p className="theme-copy mt-4 text-base leading-7">
            每次打开这里先看到历史旅行记录；点加号新建，点任意记录继续修改。
          </p>
        </div>
        <button type="button" className="travel-add-button" onClick={addTravel} aria-label="新增旅行计划">
          +
        </button>
      </div>

      <div className="travel-history-list">
        {travels.map((travel) => (
          <button
            key={travel.id}
            type="button"
            className="theme-card travel-history-card"
            onClick={() => openEditor(travel.id)}
          >
            <div>
              <span>{travel.status}</span>
              <h2>{travel.title}</h2>
              <p>{travel.summary}</p>
            </div>
            <strong>{travel.dates}</strong>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TravelPlannerWorkspace;
