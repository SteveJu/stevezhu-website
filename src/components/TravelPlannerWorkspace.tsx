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
  icon: 'flight' | 'car' | 'hotel' | 'restaurant' | 'activity';
  description: string;
  fields: Array<{
    label: string;
    placeholder: string;
    type?: 'text' | 'date' | 'number' | 'textarea';
    isCost?: boolean;
  }>;
};

type TravelFormValues = Record<string, Record<string, Record<string, string>>>;

const initialTravels: TravelRecord[] = [];

const travelModules: TravelModule[] = [
  {
    id: 'flight',
    label: '机票',
    icon: 'flight',
    description: '记录航班、时间、机场、确认号和行李信息。',
    fields: [
      { label: '航空公司', placeholder: '例如 Delta / ANA / United' },
      { label: '航班号', placeholder: '例如 DL123' },
      { label: '出发时间', placeholder: '选择或填写出发时间' },
      { label: '到达时间', placeholder: '选择或填写到达时间' },
      { label: '确认号', placeholder: 'Booking reference' },
      { label: '费用', placeholder: '机票总价', type: 'number', isCost: true },
      { label: '备注', placeholder: '行李、座位、转机注意事项', type: 'textarea' },
    ],
  },
  {
    id: 'car',
    label: '租车',
    icon: 'car',
    description: '整理取车还车、保险、驾照和停车信息。',
    fields: [
      { label: '租车公司', placeholder: 'Hertz / Avis / Toyota Rent a Car' },
      { label: '取车地点', placeholder: '机场 / 门店地址' },
      { label: '还车地点', placeholder: '同地点或异地还车' },
      { label: '车型', placeholder: 'SUV / Compact / EV' },
      { label: '费用', placeholder: '租车预计费用', type: 'number', isCost: true },
      { label: '备注', placeholder: '保险、ETC、国际驾照、停车规则', type: 'textarea' },
    ],
  },
  {
    id: 'hotel',
    label: '酒店',
    icon: 'hotel',
    description: '保存住宿名称、地址、入住退房和预订信息。',
    fields: [
      { label: '酒店名称', placeholder: '酒店 / Airbnb / 民宿名称' },
      { label: '地址', placeholder: '完整地址' },
      { label: '入住日期', placeholder: 'Check-in', type: 'date' },
      { label: '退房日期', placeholder: 'Check-out', type: 'date' },
      { label: '预订平台', placeholder: 'Booking / Amex Travel / Airbnb' },
      { label: '费用', placeholder: '住宿总价', type: 'number', isCost: true },
      { label: '备注', placeholder: '早餐、停车、寄存行李、会员权益', type: 'textarea' },
    ],
  },
  {
    id: 'restaurant',
    label: '餐厅',
    icon: 'restaurant',
    description: '记录餐厅、预约、想点的菜和预计花费。',
    fields: [
      { label: '餐厅名称', placeholder: '餐厅 / 咖啡店 / 酒吧名称' },
      { label: '日期时间', placeholder: '预约或计划时间' },
      { label: '地址', placeholder: '地址或区域' },
      { label: '预约信息', placeholder: '预约号 / 人数 / 平台' },
      { label: '费用', placeholder: '预计人均或总价', type: 'number', isCost: true },
      { label: '备注', placeholder: '想点的菜、营业时间、dress code', type: 'textarea' },
    ],
  },
  {
    id: 'activity',
    label: '活动',
    icon: 'activity',
    description: '安排景点、体验、演出、拍照点和每日活动。',
    fields: [
      { label: '活动名称', placeholder: '景点 / 演出 / 展览 / 拍照点' },
      { label: '日期', placeholder: '选择日期', type: 'date' },
      { label: '时间段', placeholder: '上午 / 下午 / 晚上 / 具体时间' },
      { label: '地点', placeholder: '地址或区域' },
      { label: '费用', placeholder: '门票或预计花费', type: 'number', isCost: true },
      { label: '备注', placeholder: '预约要求、链接、路线、拍照灵感', type: 'textarea' },
    ],
  },
];

const createNewTravel = (index: number): TravelRecord => ({
  id: `new-trip-${index}`,
  title: '新的旅行计划',
  dates: '待定',
  status: '新建',
  summary: '从左侧选择机票、租车、酒店、餐厅、活动，逐项补充信息。',
});

const ModuleIcon = ({ icon }: { icon: TravelModule['icon'] }) => {
  const commonProps = {
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 1.8,
    viewBox: '0 0 24 24',
  };

  if (icon === 'flight') {
    return (
      <svg {...commonProps}>
        <path d="M3 11.5 21 4l-7.5 18-2.5-7-8-3.5Z" />
        <path d="m11 14 4-4" />
      </svg>
    );
  }

  if (icon === 'car') {
    return (
      <svg {...commonProps}>
        <path d="M5 13h14l-1.5-4.5h-11L5 13Z" />
        <path d="M4 13v4h16v-4" />
        <path d="M7 17h.1" />
        <path d="M17 17h.1" />
      </svg>
    );
  }

  if (icon === 'hotel') {
    return (
      <svg {...commonProps}>
        <path d="M5 21V4h10v17" />
        <path d="M15 9h4v12" />
        <path d="M8 8h2" />
        <path d="M8 12h2" />
        <path d="M8 16h2" />
      </svg>
    );
  }

  if (icon === 'restaurant') {
    return (
      <svg {...commonProps}>
        <path d="M7 3v8" />
        <path d="M4.5 3v4.5a2.5 2.5 0 0 0 5 0V3" />
        <path d="M7 11v10" />
        <path d="M17 3v18" />
        <path d="M17 3c2 1.5 3 3.5 3 6 0 2-1 3-3 3" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path d="M12 3l2.2 5.2L20 10.5l-5.2 2.2L12 19l-2.8-6.3L4 10.5l5.8-2.3L12 3Z" />
      <path d="M19 16l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Z" />
    </svg>
  );
};

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

  const activeBudget = useMemo(() => {
    if (!activeTravel) return 0;

    const travelValues = formValues[activeTravel.id] ?? {};

    return travelModules.reduce((total, module) => {
      const moduleValues = travelValues[module.id] ?? {};
      const moduleTotal = module.fields.reduce((fieldTotal, field) => {
        if (!field.isCost) return fieldTotal;

        const numericValue = Number.parseFloat((moduleValues[field.label] ?? '').replaceAll(',', ''));
        return Number.isFinite(numericValue) ? fieldTotal + numericValue : fieldTotal;
      }, 0);

      return total + moduleTotal;
    }, 0);
  }, [activeTravel, formValues]);

  const formattedBudget = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(activeBudget);

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
          <div className="travel-editor-actions">
            <div className="travel-budget-total" aria-label="实时预算总计">
              <span>实时预算</span>
              <strong>{formattedBudget}</strong>
            </div>
            <button type="button" className="theme-button" onClick={() => setView('list')}>
              返回列表
            </button>
          </div>
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
                <span>
                  <span className="travel-module-icon" aria-hidden="true">
                    <ModuleIcon icon={module.icon} />
                  </span>
                  {module.label}
                </span>
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
        {travels.length === 0 ? (
          <div className="theme-card travel-empty-state">
            <span>暂无旅行记录</span>
            <h2>创建你的第一条旅行计划</h2>
            <p>点击右上角加号，新建后就可以填写机票、租车、酒店、餐厅和活动信息。</p>
          </div>
        ) : (
          travels.map((travel) => (
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
          ))
        )}
      </div>
    </div>
  );
};

export default TravelPlannerWorkspace;
