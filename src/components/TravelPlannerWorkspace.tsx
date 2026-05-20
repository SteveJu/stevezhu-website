'use client';

import Link from 'next/link';
import { useSiteMode } from '@/contexts/SiteModeContext';
import { type MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  companionStorageKey,
  initialTravels,
  maxAiImageBytes,
  travelDatalists,
  travelDateFields,
  travelDefaultValues,
  travelFieldOptions,
  travelModules,
  travelTimeFields,
  getModule,
} from '@/features/travel/modules';
import type { JellyCard, PlannerPayload, PlannerView, TravelFormValues, TravelModule, TravelRecord } from '@/features/travel/types';
import {
  createShareCode,
  dedupeNames,
  formatDate,
  formatMoney,
  getDateRange,
  getJellyDateValue,
  getJellyTimeValue,
  getMaxNumericId,
  getNumericValue,
  isPlannerPayload,
  normalizeName,
  sortJellies,
} from '@/features/travel/utils';

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

const blockManualDateInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
  event.preventDefault();
};

const blockManualDatePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
  event.preventDefault();
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

const TravelPlannerWorkspace = ({ shareCode }: { shareCode?: string }) => {
  const { mode } = useSiteMode();
  const isSharedMode = Boolean(shareCode);
  const plannerApiPath = isSharedMode ? `/api/shared-travel/${shareCode}` : '/api/travel-planner';
  const [view, setView] = useState<PlannerView>(isSharedMode ? 'editor' : 'list');
  const [travels, setTravels] = useState(initialTravels);
  const [activeTravelId, setActiveTravelId] = useState(initialTravels[0]?.id ?? '');
  const [timelineCards, setTimelineCards] = useState<Record<string, JellyCard[]>>({});
  const [draftJelly, setDraftJelly] = useState<JellyCard | null>(null);
  const [editingJellyId, setEditingJellyId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<TravelFormValues>({});
  const [isCreatingTravel, setIsCreatingTravel] = useState(false);
  const [newTravel, setNewTravel] = useState({ title: '', startDate: '', endDate: '' });
  const [selectedTravelDate, setSelectedTravelDate] = useState('');
  const [pendingDeleteTravelId, setPendingDeleteTravelId] = useState('');
  const [knownCompanions, setKnownCompanions] = useState<string[]>([]);
  const [newCompanionName, setNewCompanionName] = useState('');
  const [isCompanionHistoryOpen, setIsCompanionHistoryOpen] = useState(false);
  const [companionHistoryPosition, setCompanionHistoryPosition] = useState<{ left: number; top: number } | null>(null);
  const [isPlannerLoaded, setIsPlannerLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'loading' | 'saved' | 'saving' | 'error' | 'local'>('loading');
  const [hasSaveConflict, setHasSaveConflict] = useState(false);
  const [copiedShareCode, setCopiedShareCode] = useState('');
  const [aiFillStatus, setAiFillStatus] = useState<Record<string, 'idle' | 'reading' | 'filled' | 'error'>>({});
  const [generalAiFillStatus, setGeneralAiFillStatus] = useState<'idle' | 'reading' | 'filled' | 'error'>('idle');
  const jellyIdCounter = useRef(0);
  const travelIdCounter = useRef(0);
  const hasLoadedCompanions = useRef(false);
  const plannerUpdatedAt = useRef<string | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openCompanionHistory = (event: MouseEvent<HTMLButtonElement>) => {
    if (isCompanionHistoryOpen) {
      setIsCompanionHistoryOpen(false);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const popoverWidth = 272;
    const left = Math.min(rect.right + 12, window.innerWidth - popoverWidth - 16);
    const top = Math.min(rect.top, window.innerHeight - 260);

    setCompanionHistoryPosition({
      left: Math.max(16, left),
      top: Math.max(16, top),
    });
    setIsCompanionHistoryOpen(true);
  };

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
    if (!isSharedMode) {
      window.localStorage.setItem(companionStorageKey, JSON.stringify(knownCompanions));
    }
  }, [isSharedMode, knownCompanions]);

  useEffect(() => {
    let isMounted = true;

    const loadPlannerState = async () => {
      try {
        const response = await fetch(plannerApiPath, { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Planner backend is not ready.');
        }

        const result = (await response.json()) as { payload?: unknown; updatedAt?: string | null };

        if (isMounted && isPlannerPayload(result.payload)) {
          const loadedTravels = result.payload.travels.map((travel) => ({
            ...travel,
            companions: dedupeNames(Array.isArray(travel.companions) ? travel.companions : []),
            shareCode: travel.shareCode || '',
          }));

          setTravels(loadedTravels);
          setTimelineCards(result.payload.timelineCards);
          setFormValues(result.payload.formValues);
          setKnownCompanions(
            dedupeNames(isSharedMode ? loadedTravels.flatMap((travel) => travel.companions) : result.payload.knownCompanions)
              .sort((a, b) => a.localeCompare(b)),
          );
          setActiveTravelId(loadedTravels[0]?.id ?? '');
          setSelectedTravelDate(loadedTravels[0]?.startDate ?? '');
          travelIdCounter.current = getMaxNumericId(loadedTravels.map((travel) => travel.id), 'trip-');
          jellyIdCounter.current = getMaxNumericId(
            Object.values(result.payload.timelineCards).flat().map((card) => card.id),
            'jelly-',
          );
          plannerUpdatedAt.current = result.updatedAt ?? null;
          setHasSaveConflict(false);
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
  }, [isSharedMode, plannerApiPath]);

  useEffect(() => {
    if (!isPlannerLoaded || hasSaveConflict) return;

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
      void fetch(plannerApiPath, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ payload, updatedAt: plannerUpdatedAt.current }),
      }).then(async (response) => {
        const result = (await response.json().catch(() => null)) as { updatedAt?: string | null } | null;
        if (response.status === 409) {
          setHasSaveConflict(true);
          setSaveStatus('error');
          window.alert('这个旅行计划刚刚被其他人更新了。为了避免覆盖对方的修改，请刷新页面后再继续编辑。');
          return;
        }

        if (response.ok) {
          plannerUpdatedAt.current = result?.updatedAt ?? plannerUpdatedAt.current;
          setSaveStatus('saved');
          return;
        }

        setSaveStatus('error');
      }).catch(() => {
        setSaveStatus('error');
      });
    }, 650);

    return () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
      }
    };
  }, [formValues, hasSaveConflict, isPlannerLoaded, knownCompanions, plannerApiPath, timelineCards, travels]);

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
    saved: '已保存',
    saving: '正在保存',
    error: '保存失败',
    local: '本地模式',
  }[saveStatus];

  const openEditor = (travelId: string) => {
    const nextTravel = travels.find((travel) => travel.id === travelId);
    setPendingDeleteTravelId('');
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
      shareCode: createShareCode(),
    };

    setTravels((currentTravels) => [nextTravel, ...currentTravels]);
    setActiveTravelId(nextTravel.id);
    setSelectedTravelDate(nextTravel.startDate);
    setNewTravel({ title: '', startDate: '', endDate: '' });
    setPendingDeleteTravelId('');
    setIsCreatingTravel(false);
    setView('editor');
  };

  const deleteTravel = (travelId: string) => {
    if (pendingDeleteTravelId !== travelId) {
      setPendingDeleteTravelId(travelId);
      return;
    }

    setTravels((currentTravels) => currentTravels.filter((travel) => travel.id !== travelId));
    setTimelineCards((currentCards) => {
      return Object.fromEntries(Object.entries(currentCards).filter(([id]) => id !== travelId));
    });
    setFormValues((currentValues) => {
      return Object.fromEntries(Object.entries(currentValues).filter(([id]) => id !== travelId));
    });

    if (activeTravelId === travelId) {
      setActiveTravelId('');
      setSelectedTravelDate('');
      setDraftJelly(null);
      setEditingJellyId(null);
    }

    setPendingDeleteTravelId('');
  };

  const getShareUrl = (code: string) => {
    if (typeof window === 'undefined') return `/travel/${code}`;
    return `${window.location.origin}/travel/${code}`;
  };

  const ensureTravelShareCode = async (travelId: string) => {
    const travel = travels.find((currentTravel) => currentTravel.id === travelId);
    const nextShareCode = travel?.shareCode || createShareCode();

    setTravels((currentTravels) =>
      currentTravels.map((currentTravel) => (
        currentTravel.id === travelId
          ? { ...currentTravel, shareCode: currentTravel.shareCode || nextShareCode }
          : currentTravel
      )),
    );

    await navigator.clipboard?.writeText(getShareUrl(nextShareCode)).catch(() => undefined);
    setCopiedShareCode(nextShareCode);
    window.setTimeout(() => setCopiedShareCode(''), 1400);
  };

  const copyShareCode = async (code: string) => {
    await navigator.clipboard?.writeText(code).catch(() => undefined);
    setCopiedShareCode(code);
    window.setTimeout(() => setCopiedShareCode(''), 1400);
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

  const deleteKnownCompanion = (companionName: string) => {
    setKnownCompanions((currentCompanions) =>
      currentCompanions.filter((companion) => companion.toLowerCase() !== companionName.toLowerCase()),
    );
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

  const addTravelCompanion = (travelId: string, companionName: string) => {
    setTravels((currentTravels) =>
      currentTravels.map((travel) => {
        if (travel.id !== travelId || travel.companions.includes(companionName)) return travel;

        return {
          ...travel,
          companions: dedupeNames([...travel.companions, companionName]),
        };
      }),
    );
  };

  const addCompanionToActiveTravel = () => {
    if (!activeTravel) return;

    const normalizedName = addCompanionToPool(newCompanionName);
    if (!normalizedName) return;

    addTravelCompanion(activeTravel.id, normalizedName);
    setNewCompanionName('');
  };

  const startDraftJelly = (moduleId: TravelModule['id']) => {
    createDraftJelly(moduleId, {});
  };

  const createDraftJelly = (moduleId: TravelModule['id'], initialValues: Record<string, string>) => {
    if (!activeTravel) return null;

    jellyIdCounter.current += 1;
    const nextDraft: JellyCard = {
      id: `jelly-${jellyIdCounter.current}`,
      moduleId,
    };

    setDraftJelly(nextDraft);
    setEditingJellyId(null);
    setFormValues((currentValues) => ({
      ...currentValues,
      [activeTravel.id]: {
        ...currentValues[activeTravel.id],
        [nextDraft.id]: {
          [travelDateFields[moduleId]]: activeSelectedDate || activeTravel.startDate,
          [travelTimeFields[moduleId]]: '09:00',
          ...travelDefaultValues[moduleId],
          ...initialValues,
        },
      },
    }));

    return nextDraft;
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

  const readFileAsBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  };

  const isValidAiImageFile = (file: File) => {
    if (file.size <= maxAiImageBytes) return true;

    window.alert('截图太大了，请换一张 6MB 以内的图片。');
    return false;
  };

  const getValidatedAiFields = (card: JellyCard, fields: Record<string, string>) => {
    if (!activeTravel) return fields;

    const dateFieldLabels = getModule(card.moduleId).fields
      .filter((field) => field.type === 'date')
      .map((field) => field.label);
    const invalidDateLabels: string[] = [];
    const validatedFields = Object.fromEntries(
      Object.entries(fields).filter(([fieldLabel, fieldValue]) => {
        if (!dateFieldLabels.includes(fieldLabel)) return true;

        const isIsoDate = /^\d{4}-\d{2}-\d{2}$/.test(fieldValue);
        const isInRange = fieldValue >= activeTravel.startDate && fieldValue <= activeTravel.endDate;
        if (isIsoDate && isInRange) return true;

        invalidDateLabels.push(fieldLabel);
        return false;
      }),
    );

    if (invalidDateLabels.length > 0) {
      window.alert(`AI 识别到的 ${invalidDateLabels.join('、')} 不在当前行程日期范围内，已先不填这些日期。`);
    }

    return validatedFields;
  };

  const fillJellyFromScreenshot = async (card: JellyCard, file: File) => {
    if (!activeTravel) return;
    if (!isValidAiImageFile(file)) return;

    setAiFillStatus((currentStatus) => ({ ...currentStatus, [card.id]: 'reading' }));

    try {
      const imageBase64 = await readFileAsBase64(file);
      const response = await fetch('/api/travel-planner/ai-fill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          moduleId: card.moduleId,
          imageBase64,
          mimeType: file.type,
          shareCode,
        }),
      });

      if (!response.ok) {
        throw new Error('AI fill failed.');
      }

      const result = await response.json() as { fields?: Record<string, string> };
      const fields = getValidatedAiFields(card, result.fields ?? {});

      if (Object.keys(fields).length === 0) {
        window.alert('AI 没有从这张截图里识别到对应果冻的明确信息。');
        setAiFillStatus((currentStatus) => ({ ...currentStatus, [card.id]: 'idle' }));
        return;
      }

      setFormValues((currentValues) => ({
        ...currentValues,
        [activeTravel.id]: {
          ...currentValues[activeTravel.id],
          [card.id]: {
            ...currentValues[activeTravel.id]?.[card.id],
            ...fields,
          },
        },
      }));
      setAiFillStatus((currentStatus) => ({ ...currentStatus, [card.id]: 'filled' }));
      window.setTimeout(() => {
        setAiFillStatus((currentStatus) => ({ ...currentStatus, [card.id]: 'idle' }));
      }, 1800);
    } catch {
      setAiFillStatus((currentStatus) => ({ ...currentStatus, [card.id]: 'error' }));
    }
  };

  const createJellyFromScreenshot = async (file: File) => {
    if (!activeTravel) return;
    if (!isValidAiImageFile(file)) return;

    setGeneralAiFillStatus('reading');

    try {
      const imageBase64 = await readFileAsBase64(file);
      const response = await fetch('/api/travel-planner/ai-fill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64,
          mimeType: file.type,
          shareCode,
        }),
      });

      if (!response.ok) {
        throw new Error('AI fill failed.');
      }

      const result = await response.json() as { moduleId?: TravelModule['id'] | null; fields?: Record<string, string> };
      if (!result.moduleId || !getModule(result.moduleId)) {
        window.alert('没有检测到信息');
        setGeneralAiFillStatus('idle');
        return;
      }

      const temporaryCard: JellyCard = {
        id: 'ai-validation',
        moduleId: result.moduleId,
      };
      const fields = getValidatedAiFields(temporaryCard, result.fields ?? {});

      if (Object.keys(fields).length === 0) {
        window.alert('没有检测到信息');
        setGeneralAiFillStatus('idle');
        return;
      }

      createDraftJelly(result.moduleId, fields);
      setGeneralAiFillStatus('filled');
      window.setTimeout(() => setGeneralAiFillStatus('idle'), 1800);
    } catch {
      setGeneralAiFillStatus('error');
    }
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
                <label className="travel-ai-fill-button">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/heic,image/heif"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      event.target.value = '';
                      if (file) {
                        void fillJellyFromScreenshot(card, file);
                      }
                    }}
                  />
                  <span>
                    {aiFillStatus[card.id] === 'reading'
                      ? 'AI reading...'
                      : aiFillStatus[card.id] === 'filled'
                        ? 'AI filled'
                        : aiFillStatus[card.id] === 'error'
                          ? 'AI failed'
                          : 'AI Fill Screenshot'}
                  </span>
                </label>
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
            <p className="theme-kicker mb-4">{isSharedMode ? 'Shared Travel' : 'Travel Editor'}</p>
            <h1 className="theme-heading">{activeTravel?.title ?? '旅行计划'}</h1>
            <p className="theme-copy mt-4 text-base leading-7">
              {activeTravel?.summary}
            </p>
          </div>
          {!isSharedMode && (
            <button type="button" className="theme-button" onClick={() => setView('list')}>
              返回列表
            </button>
          )}
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
              <div className="travel-entry-heading-actions">
                <label className="travel-ai-fill-button">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/heic,image/heif"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      event.target.value = '';
                      if (file) {
                        void createJellyFromScreenshot(file);
                      }
                    }}
                  />
                  <span>
                    {generalAiFillStatus === 'reading'
                      ? 'AI reading...'
                      : generalAiFillStatus === 'filled'
                        ? 'AI created'
                        : generalAiFillStatus === 'error'
                          ? 'AI failed'
                          : 'AI filling'}
                  </span>
                </label>
                <span>{activeCards.length} saved</span>
              </div>
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
            {isSharedMode && (
              <Link href="/" className="travel-home-link">
                返回 Steve 主页
              </Link>
            )}
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

              {!isSharedMode && (
                <button
                  type="button"
                  className="travel-companion-history-trigger"
                  onClick={openCompanionHistory}
                  disabled={knownCompanions.length === 0}
                >
                  以往
                </button>
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

              {isCompanionHistoryOpen &&
                typeof document !== 'undefined' &&
                createPortal(
                  <div className="site-frame travel-companion-portal" data-site-mode={mode}>
                    <div
                      className="travel-companion-popover"
                      role="dialog"
                      aria-label="以往同行人员"
                      style={
                        companionHistoryPosition
                          ? { left: companionHistoryPosition.left, top: companionHistoryPosition.top }
                          : undefined
                      }
                    >
                      <div className="travel-companion-popover-head">
                        <span>以往同行</span>
                        <button
                          type="button"
                          onClick={() => setIsCompanionHistoryOpen(false)}
                          aria-label="关闭以往同行人员"
                        >
                          ×
                        </button>
                      </div>
                      <div className="travel-known-companions">
                        {knownCompanions.map((companion) => {
                          const isSelected = activeTravel?.companions?.includes(companion) ?? false;

                          return (
                            <div key={companion} className="travel-known-companion-row">
                              <button
                                type="button"
                                className={isSelected ? 'is-selected' : ''}
                                onClick={() => activeTravel && toggleTravelCompanion(activeTravel.id, companion)}
                              >
                                {companion}
                              </button>
                              <button
                                type="button"
                                className="travel-known-companion-delete"
                                onClick={() => deleteKnownCompanion(companion)}
                                aria-label={`删除以往同行 ${companion}`}
                              >
                                ×
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>,
                  document.body,
                )}
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
            <div
              key={travel.id}
              className="theme-card travel-history-card"
            >
              <button type="button" onClick={() => openEditor(travel.id)}>
                <span>{travel.status}</span>
                <h2>{travel.title}</h2>
                <p>{travel.summary}</p>
                {travel.companions.length > 0 && (
                  <p>同行：{travel.companions.join(' / ')}</p>
                )}
              </button>
              <div className="travel-history-actions">
                <strong>{formatDate(travel.startDate)} - {formatDate(travel.endDate)}</strong>
                {travel.shareCode && (
                  <div className="travel-share-code">
                    <span>Code: {travel.shareCode}</span>
                    <button
                      type="button"
                      onClick={() => void copyShareCode(travel.shareCode)}
                      aria-label={`复制分享 code ${travel.shareCode}`}
                    >
                      <svg aria-hidden="true" viewBox="0 0 24 24">
                        <path d="M8 8h11v11H8z" />
                        <path d="M5 16H4V4h12v1" />
                      </svg>
                    </button>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => void ensureTravelShareCode(travel.id)}
                  aria-label={`分享旅行计划 ${travel.title}`}
                >
                  {travel.shareCode && copiedShareCode === travel.shareCode ? 'Copied' : 'Share'}
                </button>
                <button
                  type="button"
                  onClick={() => deleteTravel(travel.id)}
                  aria-label={`删除旅行计划 ${travel.title}`}
                  className={pendingDeleteTravelId === travel.id ? 'is-confirming-delete' : ''}
                >
                  {pendingDeleteTravelId === travel.id ? 'Confirm' : 'Delete'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TravelPlannerWorkspace;
