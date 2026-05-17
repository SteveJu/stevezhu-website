'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type PlannerView = 'list' | 'editor';

type TravelRecord = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  status: string;
  summary: string;
  companions: string[];
};

type TravelField = {
  label: string;
  placeholder: string;
  type?: 'text' | 'date' | 'number' | 'textarea' | 'time' | 'select' | 'checkbox';
  datalistId?: string;
  disabledWhen?: {
    label: string;
    value: string;
  };
  isCost?: boolean;
};

type TravelModule = {
  id: 'flight' | 'car' | 'hotel' | 'restaurant' | 'activity';
  label: string;
  icon: 'flight' | 'car' | 'hotel' | 'restaurant' | 'activity';
  fields: TravelField[];
};

type JellyCard = {
  id: string;
  moduleId: TravelModule['id'];
};

type TravelFormValues = Record<string, Record<string, Record<string, string>>>;

type PlannerPayload = {
  travels: TravelRecord[];
  timelineCards: Record<string, JellyCard[]>;
  formValues: TravelFormValues;
  knownCompanions: string[];
};

const initialTravels: TravelRecord[] = [];
const companionStorageKey = 'stevezhu_travel_companions';

const travelModules: TravelModule[] = [
  {
    id: 'flight',
    label: '机票',
    icon: 'flight',
    fields: [
      { label: '出发日期', placeholder: '选择出发日期', type: 'date' },
      { label: '出发时间', placeholder: '选择出发时间', type: 'time' },
      { label: '到达日期', placeholder: '选择到达日期', type: 'date' },
      { label: '到达时间', placeholder: '选择到达时间', type: 'time' },
      { label: '出发机场', placeholder: 'EWR / LGA / JFK', datalistId: 'travel-airport-options' },
      { label: '到达机场', placeholder: '输入机场代码', datalistId: 'travel-airport-options' },
      { label: '航班号', placeholder: '例如 UA123 / DL456' },
      { label: '费用', placeholder: '机票总价', type: 'number', isCost: true },
      { label: '备注', placeholder: '行李、座位、转机注意事项', type: 'textarea' },
    ],
  },
  {
    id: 'car',
    label: '租车',
    icon: 'car',
    fields: [
      { label: '提车日期', placeholder: '选择提车日期', type: 'date' },
      { label: '提车时间', placeholder: '选择提车时间', type: 'time' },
      { label: '还车日期', placeholder: '选择还车日期', type: 'date' },
      { label: '还车时间', placeholder: '选择还车时间', type: 'time' },
      { label: '提车地点', placeholder: '机场 / 门店地址' },
      { label: '还车地点同提车地点', placeholder: '', type: 'checkbox' },
      {
        label: '还车地点',
        placeholder: '异地还车地点',
        disabledWhen: { label: '还车地点同提车地点', value: 'true' },
      },
      { label: '租车公司', placeholder: 'Hertz / Avis / Budget / Sixt / Enterprise', datalistId: 'travel-rental-company-options' },
      { label: '价格', placeholder: '租车价格', type: 'number', isCost: true },
      { label: '备注', placeholder: '保险、ETC、国际驾照、停车规则', type: 'textarea' },
    ],
  },
  {
    id: 'hotel',
    label: '酒店',
    icon: 'hotel',
    fields: [
      { label: '住宿类型', placeholder: '选择类型', type: 'select' },
      { label: '名字', placeholder: '酒店 / Airbnb 名字' },
      { label: '入住日期', placeholder: '选择入住日期', type: 'date' },
      { label: '入住时间', placeholder: '选择入住时间', type: 'time' },
      { label: '退房日期', placeholder: '选择退房日期', type: 'date' },
      { label: '退房时间', placeholder: '选择退房时间', type: 'time' },
      { label: '地点', placeholder: '完整地址或区域' },
      {
        label: 'Brand',
        placeholder: 'Marriott / Hyatt / Hilton',
        datalistId: 'travel-hotel-brand-options',
        disabledWhen: { label: '住宿类型', value: 'Airbnb' },
      },
      { label: '费用', placeholder: '住宿总价', type: 'number', isCost: true },
      { label: '备注', placeholder: '早餐、停车、寄存行李、会员权益', type: 'textarea' },
    ],
  },
  {
    id: 'restaurant',
    label: '餐厅',
    icon: 'restaurant',
    fields: [
      { label: '名字', placeholder: '餐厅 / 咖啡店 / 酒吧名称' },
      { label: '地点', placeholder: '地址或区域' },
      { label: '开始日期', placeholder: '选择开始日期', type: 'date' },
      { label: '开始时间', placeholder: '选择开始时间', type: 'time' },
      { label: 'Period', placeholder: '默认 1 小时，可改', type: 'number' },
      { label: '是否已经订位', placeholder: '', type: 'checkbox' },
      { label: '备注', placeholder: '预约号、想点的菜、营业时间、dress code', type: 'textarea' },
    ],
  },
  {
    id: 'activity',
    label: '活动',
    icon: 'activity',
    fields: [
      { label: '活动名称', placeholder: '景点 / 演出 / 展览 / 拍照点' },
      { label: '日期', placeholder: '选择日期', type: 'date' },
      { label: '时间', placeholder: '选择时间', type: 'time' },
      { label: '地点', placeholder: '地址或区域' },
      { label: '是否需要门票', placeholder: '', type: 'checkbox' },
      { label: '是否已经订票', placeholder: '', type: 'checkbox' },
      { label: '价格', placeholder: '门票或预计花费', type: 'number', isCost: true },
      { label: '备注', placeholder: '预约要求、链接、路线、拍照灵感', type: 'textarea' },
    ],
  },
];

const travelFieldOptions: Record<string, string[]> = {
  住宿类型: ['酒店', 'Airbnb'],
};

const travelDefaultValues: Record<TravelModule['id'], Record<string, string>> = {
  flight: {
    出发机场: 'EWR',
  },
  car: {
    还车地点同提车地点: 'true',
    租车公司: 'Hertz',
  },
  hotel: {
    住宿类型: '酒店',
    Brand: 'Marriott',
  },
  restaurant: {
    Period: '1',
  },
  activity: {
    是否需要门票: 'false',
    是否已经订票: 'false',
  },
};

const travelDateFields: Record<TravelModule['id'], string> = {
  flight: '出发日期',
  car: '提车日期',
  hotel: '入住日期',
  restaurant: '开始日期',
  activity: '日期',
};

const travelTimeFields: Record<TravelModule['id'], string> = {
  flight: '出发时间',
  car: '提车时间',
  hotel: '入住时间',
  restaurant: '开始时间',
  activity: '时间',
};

const airportOptions = ['EWR', 'LGA', 'JFK', 'SFO', 'LAX', 'ORD', 'ATL', 'DFW', 'SEA', 'BOS'];
const rentalCompanyOptions = ['Hertz', 'Avis', 'Budget', 'Sixt', 'Enterprise', 'National', 'Alamo'];
const hotelBrandOptions = ['Marriott', 'Hyatt', 'Hilton', 'IHG', 'Accor', 'Four Seasons', 'Aman'];

const timeOptions = Array.from({ length: 48 }, (_, index) => {
  const hour = Math.floor(index / 2).toString().padStart(2, '0');
  const minute = index % 2 === 0 ? '00' : '30';
  return `${hour}:${minute}`;
});

const datalistOptions: Record<string, string[]> = {
  'travel-airport-options': airportOptions,
  'travel-rental-company-options': rentalCompanyOptions,
  'travel-hotel-brand-options': hotelBrandOptions,
};

const travelDatalists = [
  { id: 'travel-time-options', options: timeOptions },
  ...Object.entries(datalistOptions).map(([id, options]) => ({ id, options })),
];

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

const getModule = (moduleId: TravelModule['id']) => {
  return travelModules.find((travelModule) => travelModule.id === moduleId) ?? travelModules[0];
};

const getNumericValue = (value: string) => {
  const numericValue = Number.parseFloat(value.replaceAll(',', ''));
  return Number.isFinite(numericValue) ? numericValue : 0;
};

const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

const blockManualDateInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
  event.preventDefault();
};

const blockManualDatePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
  event.preventDefault();
};

const formatDate = (date: string) => {
  if (!date) return '未定日期';
  const [, month, day] = date.split('-');
  return `${month}/${day}`;
};

const DatePickerField = ({
  value,
  onChange,
  placeholder,
  disabled = false,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const openPicker = () => {
    if (disabled) return;

    const input = inputRef.current;
    if (!input) return;

    input.focus();
    input.showPicker?.();
  };

  return (
    <div
      className={`travel-date-picker ${disabled ? 'is-disabled' : ''}`}
      onClick={openPicker}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openPicker();
        }
      }}
      role="button"
      tabIndex={disabled ? -1 : 0}
    >
      <div
        className={`travel-date-trigger ${value ? '' : 'is-empty'}`}
      >
        <span>{value ? formatDate(value) : placeholder}</span>
      </div>
      <input
        ref={inputRef}
        className="travel-native-date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type="date"
        aria-label={placeholder}
        onKeyDown={blockManualDateInput}
        onPaste={blockManualDatePaste}
        disabled={disabled}
        tabIndex={-1}
      />
    </div>
  );
};

const getDateRange = (startDate: string, endDate: string) => {
  if (!startDate || !endDate || endDate < startDate) return startDate ? [startDate] : [];

  const dates: string[] = [];
  const currentDate = new Date(`${startDate}T00:00:00`);
  const finalDate = new Date(`${endDate}T00:00:00`);

  while (currentDate <= finalDate) {
    dates.push(currentDate.toISOString().slice(0, 10));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

const getJellyDateValue = (card: JellyCard, values: TravelFormValues[string] = {}) => {
  return values[card.id]?.[travelDateFields[card.moduleId]] ?? '';
};

const getJellyTimeValue = (card: JellyCard, values: TravelFormValues[string] = {}) => {
  return values[card.id]?.[travelTimeFields[card.moduleId]] ?? '';
};

const sortJellies = (cards: JellyCard[], values: TravelFormValues[string] = {}) => {
  return [...cards].sort((a, b) => {
    const aKey = `${getJellyDateValue(a, values) || '9999-99-99'}T${getJellyTimeValue(a, values) || '99:99'}`;
    const bKey = `${getJellyDateValue(b, values) || '9999-99-99'}T${getJellyTimeValue(b, values) || '99:99'}`;
    return aKey.localeCompare(bKey);
  });
};

const isPlannerPayload = (payload: unknown): payload is PlannerPayload => {
  if (!payload || typeof payload !== 'object') return false;

  const candidate = payload as Partial<PlannerPayload>;
  return (
    Array.isArray(candidate.travels) &&
    candidate.timelineCards !== null &&
    typeof candidate.timelineCards === 'object' &&
    candidate.formValues !== null &&
    typeof candidate.formValues === 'object' &&
    Array.isArray(candidate.knownCompanions)
  );
};

const getMaxNumericId = (ids: string[], prefix: string) => {
  return ids.reduce((maxId, id) => {
    if (!id.startsWith(prefix)) return maxId;

    const numericId = Number.parseInt(id.slice(prefix.length), 10);
    return Number.isFinite(numericId) ? Math.max(maxId, numericId) : maxId;
  }, 0);
};

const normalizeName = (name: string) => name.trim();

const dedupeNames = (names: string[]) => {
  const seenNames = new Set<string>();

  return names.reduce<string[]>((dedupedNames, name) => {
    const normalizedName = normalizeName(name);
    const nameKey = normalizedName.toLowerCase();

    if (!normalizedName || seenNames.has(nameKey)) {
      return dedupedNames;
    }

    seenNames.add(nameKey);
    return [...dedupedNames, normalizedName];
  }, []);
};

const TravelPlannerWorkspace = () => {
  const [view, setView] = useState<PlannerView>('list');
  const [travels, setTravels] = useState(initialTravels);
  const [activeTravelId, setActiveTravelId] = useState(initialTravels[0]?.id ?? '');
  const [timelineCards, setTimelineCards] = useState<Record<string, JellyCard[]>>({});
  const [draftJelly, setDraftJelly] = useState<JellyCard | null>(null);
  const [editingJellyId, setEditingJellyId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<TravelFormValues>({});
  const [isCreatingTravel, setIsCreatingTravel] = useState(false);
  const [newTravel, setNewTravel] = useState({ title: '', startDate: '', endDate: '' });
  const [selectedTravelDate, setSelectedTravelDate] = useState('');
  const [knownCompanions, setKnownCompanions] = useState<string[]>([]);
  const [newCompanionName, setNewCompanionName] = useState('');
  const [isPlannerLoaded, setIsPlannerLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'loading' | 'saved' | 'saving' | 'error' | 'local'>('loading');
  const jellyIdCounter = useRef(0);
  const travelIdCounter = useRef(0);
  const hasLoadedCompanions = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const storedCompanions = window.localStorage.getItem(companionStorageKey);
      if (!storedCompanions) {
        hasLoadedCompanions.current = true;
        return;
      }

      const parsedCompanions = JSON.parse(storedCompanions);
      if (Array.isArray(parsedCompanions)) {
        setKnownCompanions(parsedCompanions.filter((name) => typeof name === 'string'));
      }
    } catch {
      setKnownCompanions([]);
    } finally {
      hasLoadedCompanions.current = true;
    }
  }, []);

  useEffect(() => {
    if (!hasLoadedCompanions.current) return;
    window.localStorage.setItem(companionStorageKey, JSON.stringify(knownCompanions));
  }, [knownCompanions]);

  useEffect(() => {
    let isMounted = true;

    const loadPlannerState = async () => {
      try {
        const response = await fetch('/api/travel-planner', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Planner backend is not ready.');
        }

        const result = (await response.json()) as { payload?: unknown };

        if (isMounted && isPlannerPayload(result.payload)) {
          const loadedTravels = result.payload.travels.map((travel) => ({
            ...travel,
            companions: dedupeNames(Array.isArray(travel.companions) ? travel.companions : []),
          }));

          setTravels(loadedTravels);
          setTimelineCards(result.payload.timelineCards);
          setFormValues(result.payload.formValues);
          setKnownCompanions(dedupeNames(result.payload.knownCompanions).sort((a, b) => a.localeCompare(b)));
          setActiveTravelId(loadedTravels[0]?.id ?? '');
          setSelectedTravelDate(loadedTravels[0]?.startDate ?? '');
          travelIdCounter.current = getMaxNumericId(loadedTravels.map((travel) => travel.id), 'trip-');
          jellyIdCounter.current = getMaxNumericId(
            Object.values(result.payload.timelineCards).flat().map((card) => card.id),
            'jelly-',
          );
        }

        if (isMounted) {
          setSaveStatus('saved');
        }
      } catch {
        if (isMounted) {
          setSaveStatus('local');
        }
      } finally {
        if (isMounted) {
          setIsPlannerLoaded(true);
        }
      }
    };

    void loadPlannerState();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isPlannerLoaded) return;

    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
    }

    saveTimer.current = setTimeout(() => {
      const payload: PlannerPayload = {
        travels,
        timelineCards,
        formValues,
        knownCompanions,
      };

      setSaveStatus('saving');
      void fetch('/api/travel-planner', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ payload }),
      }).then((response) => {
        setSaveStatus(response.ok ? 'saved' : 'error');
      }).catch(() => {
        setSaveStatus('error');
      });
    }, 650);

    return () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
      }
    };
  }, [formValues, isPlannerLoaded, knownCompanions, timelineCards, travels]);

  const activeTravel = useMemo(() => {
    return travels.find((travel) => travel.id === activeTravelId) ?? travels[0];
  }, [activeTravelId, travels]);

  const activeCards = useMemo(() => {
    if (!activeTravel) return [];
    return sortJellies(timelineCards[activeTravel.id] ?? [], formValues[activeTravel.id]);
  }, [activeTravel, formValues, timelineCards]);

  const travelDates = useMemo(() => {
    return activeTravel ? getDateRange(activeTravel.startDate, activeTravel.endDate) : [];
  }, [activeTravel]);

  const activeSelectedDate = travelDates.includes(selectedTravelDate)
    ? selectedTravelDate
    : travelDates[0] ?? '';

  const activeBudget = useMemo(() => {
    if (!activeTravel) return 0;

    return activeCards.reduce((total, card) => {
      const travelModule = getModule(card.moduleId);
      const cardValues = formValues[activeTravel.id]?.[card.id] ?? {};
      const cardTotal = travelModule.fields.reduce((fieldTotal, field) => {
        return field.isCost ? fieldTotal + getNumericValue(cardValues[field.label] ?? '') : fieldTotal;
      }, 0);

      return total + cardTotal;
    }, 0);
  }, [activeCards, activeTravel, formValues]);

  const saveStatusText = {
    loading: '正在连接后端',
    saved: '已保存到 Supabase',
    saving: '正在保存',
    error: '保存失败',
    local: '本地模式',
  }[saveStatus];

  const openEditor = (travelId: string) => {
    const nextTravel = travels.find((travel) => travel.id === travelId);
    setActiveTravelId(travelId);
    setSelectedTravelDate(nextTravel?.startDate ?? '');
    setDraftJelly(null);
    setEditingJellyId(null);
    setView('editor');
  };

  const createTravel = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newTravel.title || !newTravel.startDate || !newTravel.endDate) return;

    travelIdCounter.current += 1;

    const nextTravel: TravelRecord = {
      id: `trip-${travelIdCounter.current}`,
      title: newTravel.title,
      startDate: newTravel.startDate,
      endDate: newTravel.endDate,
      status: '新建',
      summary: `${formatDate(newTravel.startDate)} - ${formatDate(newTravel.endDate)}`,
      companions: [],
    };

    setTravels((currentTravels) => [nextTravel, ...currentTravels]);
    setActiveTravelId(nextTravel.id);
    setSelectedTravelDate(nextTravel.startDate);
    setNewTravel({ title: '', startDate: '', endDate: '' });
    setIsCreatingTravel(false);
    setView('editor');
  };

  const addCompanionToPool = (name: string) => {
    const normalizedName = normalizeName(name);
    if (!normalizedName) return '';

    setKnownCompanions((currentCompanions) => {
      if (currentCompanions.some((companion) => companion.toLowerCase() === normalizedName.toLowerCase())) {
        return currentCompanions;
      }

      return [...currentCompanions, normalizedName].sort((a, b) => a.localeCompare(b));
    });

    return normalizedName;
  };

  const toggleTravelCompanion = (travelId: string, companionName: string) => {
    setTravels((currentTravels) =>
      currentTravels.map((travel) => {
        if (travel.id !== travelId) return travel;

        const hasCompanion = travel.companions.includes(companionName);
        return {
          ...travel,
          companions: hasCompanion
            ? travel.companions.filter((name) => name !== companionName)
            : dedupeNames([...travel.companions, companionName]),
        };
      }),
    );
  };

  const addCompanionToActiveTravel = () => {
    if (!activeTravel) return;

    const normalizedName = addCompanionToPool(newCompanionName);
    if (!normalizedName) return;

    toggleTravelCompanion(activeTravel.id, normalizedName);
    setNewCompanionName('');
  };

  const startDraftJelly = (moduleId: TravelModule['id']) => {
    if (!activeTravel) return;

    jellyIdCounter.current += 1;
    const nextDraft: JellyCard = {
      id: `jelly-${jellyIdCounter.current}`,
      moduleId,
    };

    setDraftJelly(nextDraft);
    setFormValues((currentValues) => ({
      ...currentValues,
      [activeTravel.id]: {
        ...currentValues[activeTravel.id],
        [nextDraft.id]: {
          [travelDateFields[moduleId]]: activeSelectedDate || activeTravel.startDate,
          [travelTimeFields[moduleId]]: '09:00',
          ...travelDefaultValues[moduleId],
        },
      },
    }));
  };

  const saveDraftJelly = () => {
    if (!activeTravel || !draftJelly) return;

    setTimelineCards((currentCards) => ({
      ...currentCards,
      [activeTravel.id]: sortJellies(
        [...(currentCards[activeTravel.id] ?? []), draftJelly],
        formValues[activeTravel.id],
      ),
    }));
    setDraftJelly(null);
    setEditingJellyId(null);
  };

  const deleteJelly = (jellyId: string) => {
    if (!activeTravel) return;

    if (draftJelly?.id === jellyId) {
      setDraftJelly(null);
      return;
    }

    if (editingJellyId === jellyId) {
      setEditingJellyId(null);
    }

    setTimelineCards((currentCards) => ({
      ...currentCards,
      [activeTravel.id]: (currentCards[activeTravel.id] ?? []).filter((card) => card.id !== jellyId),
    }));
  };

  const finishEditingJelly = (jellyId: string) => {
    if (!activeTravel) return;

    setTimelineCards((currentCards) => ({
      ...currentCards,
      [activeTravel.id]: sortJellies(currentCards[activeTravel.id] ?? [], formValues[activeTravel.id]),
    }));
    setEditingJellyId((currentId) => (currentId === jellyId ? null : currentId));
  };

  const getFieldValue = (jellyId: string, fieldLabel: string) => {
    return formValues[activeTravel?.id ?? '']?.[jellyId]?.[fieldLabel] ?? '';
  };

  const updateFieldValue = (jellyId: string, fieldLabel: string, value: string) => {
    if (!activeTravel) return;

    setFormValues((currentValues) => ({
      ...currentValues,
      [activeTravel.id]: {
        ...currentValues[activeTravel.id],
        [jellyId]: {
          ...currentValues[activeTravel.id]?.[jellyId],
          [fieldLabel]: value,
        },
      },
    }));
  };

  const jumpToDate = (date: string) => {
    setSelectedTravelDate(date);
    document.getElementById(`travel-date-${date}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const renderJelly = (card: JellyCard, index: number, isDraft = false) => {
    const travelModule = getModule(card.moduleId);
    const jellyValues = formValues[activeTravel?.id ?? '']?.[card.id] ?? {};
    const fields = travelModule.fields;
    const isEditing = isDraft || editingJellyId === card.id;
    const title =
      jellyValues['活动名称'] ||
      jellyValues['名字'] ||
      jellyValues['航班号'] ||
      jellyValues['租车公司'] ||
      travelModule.label;
    const location =
      jellyValues['地点'] ||
      jellyValues['出发机场'] ||
      jellyValues['提车地点'] ||
      jellyValues['到达机场'];
    const cardDate = getJellyDateValue(card, formValues[activeTravel?.id ?? '']);
    const cardTime = getJellyTimeValue(card, formValues[activeTravel?.id ?? '']);
    const cost = fields.reduce((total, field) => {
      return field.isCost ? total + getNumericValue(jellyValues[field.label] ?? '') : total;
    }, 0);

    return (
      <article key={card.id} className={`travel-timeline-card ${isDraft ? 'is-draft' : ''} ${isEditing ? 'is-editing' : 'is-saved'}`}>
        <div className="travel-timeline-marker">{isDraft ? '+' : index + 1}</div>
        <div className="travel-timeline-content">
          <div className="travel-card-heading">
            <span className="travel-module-icon" aria-hidden="true">
              <ModuleIcon icon={travelModule.icon} />
            </span>
            <div>
              <span>{isDraft ? '未保存旅行果冻' : `${formatDate(cardDate)} ${cardTime}`}</span>
              <h3>{travelModule.label}</h3>
            </div>
            <div className="travel-jelly-actions">
              {!isDraft && (
                <button type="button" onClick={() => setEditingJellyId(card.id)}>
                  Edit
                </button>
              )}
              <button type="button" onClick={() => deleteJelly(card.id)}>
                Delete
              </button>
            </div>
          </div>

          {isEditing ? (
            <>
              <div className="travel-form-grid">
                {fields.map((field) => {
                  const fieldValue = getFieldValue(card.id, field.label);
                  const isDisabled =
                    field.disabledWhen &&
                    getFieldValue(card.id, field.disabledWhen.label) === field.disabledWhen.value;
                  const fieldClassName = `${field.type === 'textarea' ? 'is-wide' : ''} ${isDisabled ? 'is-disabled' : ''}`.trim();

                  return (
                    <label
                      key={`${card.id}-${field.label}`}
                      className={fieldClassName}
                    >
                      {field.type === 'checkbox' ? (
                        <span className="travel-checkbox-field">
                          <input
                            checked={fieldValue === 'true'}
                            onChange={(event) => updateFieldValue(card.id, field.label, String(event.target.checked))}
                            type="checkbox"
                          />
                          <span>{field.label}</span>
                        </span>
                      ) : (
                        <>
                          <span>{field.label}</span>
                          {field.type === 'textarea' ? (
                            <textarea
                              value={fieldValue}
                              onChange={(event) => updateFieldValue(card.id, field.label, event.target.value)}
                              placeholder={field.placeholder}
                              rows={4}
                              disabled={isDisabled}
                            />
                          ) : field.type === 'date' ? (
                            <DatePickerField
                              value={fieldValue}
                              onChange={(value) => updateFieldValue(card.id, field.label, value)}
                              placeholder={field.placeholder}
                              disabled={Boolean(isDisabled)}
                            />
                          ) : field.type === 'select' ? (
                            <select
                              value={fieldValue}
                              onChange={(event) => updateFieldValue(card.id, field.label, event.target.value)}
                              disabled={isDisabled}
                            >
                              {(travelFieldOptions[field.label] ?? []).map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              value={fieldValue}
                              onChange={(event) => updateFieldValue(card.id, field.label, event.target.value)}
                              type={field.type === 'time' ? 'text' : field.type ?? 'text'}
                              list={field.type === 'time' ? 'travel-time-options' : field.datalistId}
                              placeholder={field.placeholder}
                              disabled={isDisabled}
                            />
                          )}
                        </>
                      )}
                    </label>
                  );
                })}
              </div>
              <div className="travel-entry-actions">
                <button
                  type="button"
                  className="theme-button"
                  onClick={isDraft ? saveDraftJelly : () => finishEditingJelly(card.id)}
                >
                  {isDraft ? '保存果冻' : '保存修改'}
                </button>
              </div>
            </>
          ) : (
            <div className="travel-jelly-summary">
              <strong>{title}</strong>
              <div>
                <span>{cardTime || '未定时间'}</span>
                {location && <span>{location}</span>}
                {cost > 0 && <span>{formatMoney(cost)}</span>}
              </div>
              {jellyValues['备注'] && <p>{jellyValues['备注']}</p>}
            </div>
          )}
        </div>
      </article>
    );
  };

  if (view === 'editor') {
    return (
      <div className="travel-workspace">
        {travelDatalists.map((datalist) => (
          <datalist key={datalist.id} id={datalist.id}>
            {datalist.options.map((option) => (
              <option key={option} value={option} />
            ))}
          </datalist>
        ))}

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
            <p className="travel-panel-label">添加果冻</p>
            {activeSelectedDate && (
              <div className="travel-selected-date">
                <span>当前日期</span>
                <strong>{formatDate(activeSelectedDate)}</strong>
              </div>
            )}
            {travelModules.map((travelModule) => (
              <button
                key={travelModule.id}
                type="button"
                onClick={() => startDraftJelly(travelModule.id)}
              >
                <span>
                  <span className="travel-module-icon" aria-hidden="true">
                    <ModuleIcon icon={travelModule.icon} />
                  </span>
                  {travelModule.label}
                </span>
              </button>
            ))}
          </aside>

          <section className="theme-card travel-timeline-panel">
            <div className="travel-entry-heading">
              <div>
                <p className="travel-panel-label">旅行果冻</p>
                <h2>Calendar Timeline</h2>
              </div>
              <span>{activeCards.length} saved</span>
            </div>

            <div className="travel-timeline-list">
              {travelDates.length === 0 && !draftJelly && (
                <div className="travel-timeline-empty">
                  <span>缺少日期</span>
                  <p>先在列表新建行程时选择日期范围。</p>
                </div>
              )}
              {travelDates.map((date) => {
                const dayCards = activeCards.filter((card) => {
                  return getJellyDateValue(card, formValues[activeTravel?.id ?? '']) === date;
                });
                const shouldRenderDraft =
                  draftJelly &&
                  getJellyDateValue(draftJelly, formValues[activeTravel?.id ?? '']) === date;

                return (
                  <section key={date} id={`travel-date-${date}`} className="travel-day-section">
                    <div className="travel-day-heading">
                      <span>{formatDate(date)}</span>
                    </div>
                    {shouldRenderDraft && renderJelly(draftJelly, 0, true)}
                    {dayCards.length === 0 && !shouldRenderDraft ? (
                      <div className="travel-timeline-empty">
                        <span>这一天还没有果冻</span>
                        <p>从左侧添加一个项目，保存后会按开始时间排到这里。</p>
                      </div>
                    ) : (
                      dayCards.map((card, index) => renderJelly(card, index))
                    )}
                  </section>
                );
              })}
            </div>
          </section>

          <aside className="theme-card travel-preview-panel">
            <p className="travel-panel-label">日期导航</p>
            <div className={`travel-save-status is-${saveStatus}`}>
              <span>{saveStatusText}</span>
            </div>
            <div className="travel-budget-total" aria-label="实时预算总计">
              <span>实时预算</span>
              <strong>{formatMoney(activeBudget)}</strong>
            </div>

            <div className="travel-companion-panel">
              <div className="travel-companion-heading">
                <span>同行人员</span>
                <strong>{activeTravel?.companions?.length ?? 0}</strong>
              </div>

              <div className="travel-companion-chips">
                {(activeTravel?.companions ?? []).length > 0 ? (
                  activeTravel?.companions.map((companion) => (
                    <button
                      key={companion}
                      type="button"
                      aria-label={`删除同行人员 ${companion}`}
                      onClick={() => activeTravel && toggleTravelCompanion(activeTravel.id, companion)}
                    >
                      <span>{companion}</span>
                      <strong aria-hidden="true">×</strong>
                    </button>
                  ))
                ) : (
                  <p>还没有添加同行人员</p>
                )}
              </div>

              {knownCompanions.length > 0 && (
                <div className="travel-known-companions">
                  {knownCompanions.map((companion) => {
                    const isSelected = activeTravel?.companions?.includes(companion) ?? false;

                    return (
                      <button
                        key={companion}
                        type="button"
                        className={isSelected ? 'is-selected' : ''}
                        onClick={() => activeTravel && toggleTravelCompanion(activeTravel.id, companion)}
                      >
                        {companion}
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="travel-companion-add">
                <input
                  value={newCompanionName}
                  onChange={(event) => setNewCompanionName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      addCompanionToActiveTravel();
                    }
                  }}
                  placeholder="添加名字"
                />
                <button type="button" onClick={addCompanionToActiveTravel}>
                  Add
                </button>
              </div>
            </div>

            <div className="travel-date-nav">
              {travelDates.map((date) => (
                <button
                  key={date}
                  type="button"
                  className={date === activeSelectedDate ? 'is-selected' : ''}
                  onClick={() => jumpToDate(date)}
                >
                  <span>{formatDate(date)}</span>
                  <strong>
                    {activeCards.filter((card) => getJellyDateValue(card, formValues[activeTravel?.id ?? '']) === date).length}
                  </strong>
                </button>
              ))}
            </div>
          </aside>
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
        <button
          type="button"
          className="travel-add-button"
          onClick={() => setIsCreatingTravel((current) => !current)}
          aria-label="新增旅行计划"
        >
          +
        </button>
      </div>

      {isCreatingTravel && (
        <form className="theme-card travel-create-form" onSubmit={createTravel}>
          <label>
            <span>行程名称</span>
            <input
              value={newTravel.title}
              onChange={(event) => setNewTravel((current) => ({ ...current, title: event.target.value }))}
              placeholder="例如 日本关西 7 日"
            />
          </label>
          <label>
            <span>开始日期</span>
            <DatePickerField
              value={newTravel.startDate}
              onChange={(value) => setNewTravel((current) => ({ ...current, startDate: value }))}
              placeholder="选择开始日期"
            />
          </label>
          <label>
            <span>结束日期</span>
            <DatePickerField
              value={newTravel.endDate}
              onChange={(value) => setNewTravel((current) => ({ ...current, endDate: value }))}
              placeholder="选择结束日期"
            />
          </label>
          <button type="submit" className="theme-button">创建行程</button>
        </form>
      )}

      <div className="travel-history-list">
        {travels.length === 0 ? (
          <div className="theme-card travel-empty-state">
            <span>暂无旅行记录</span>
            <h2>创建你的第一条旅行计划</h2>
            <p>点击右上角加号，选择行程日期后开始添加旅行果冻。</p>
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
                {travel.companions.length > 0 && (
                  <p>同行：{travel.companions.join(' / ')}</p>
                )}
              </div>
              <strong>{formatDate(travel.startDate)} - {formatDate(travel.endDate)}</strong>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default TravelPlannerWorkspace;
