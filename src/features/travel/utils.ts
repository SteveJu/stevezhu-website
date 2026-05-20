import { travelDateFields, travelTimeFields } from './modules';
import type { JellyCard, PlannerPayload, TravelFormValues } from './types';

export const createShareCode = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID().replaceAll('-', '').slice(0, 10);
  }

  return Math.random().toString(36).slice(2, 12);
};

export const getNumericValue = (value: string) => {
  const numericValue = Number.parseFloat(value.replaceAll(',', ''));
  return Number.isFinite(numericValue) ? numericValue : 0;
};

export const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: string) => {
  if (!date) return '未定日期';
  const [, month, day] = date.split('-');
  const weekday = new Intl.DateTimeFormat('zh-CN', { weekday: 'short' }).format(new Date(`${date}T00:00:00`));
  return `${month}/${day} ${weekday}`;
};

export const getDateRange = (startDate: string, endDate: string) => {
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

export const getJellyDateValue = (card: JellyCard, values: TravelFormValues[string] = {}) => {
  return values[card.id]?.[travelDateFields[card.moduleId]] ?? '';
};

export const getJellyTimeValue = (card: JellyCard, values: TravelFormValues[string] = {}) => {
  return values[card.id]?.[travelTimeFields[card.moduleId]] ?? '';
};

export const sortJellies = (cards: JellyCard[], values: TravelFormValues[string] = {}) => {
  return [...cards].sort((a, b) => {
    const aKey = `${getJellyDateValue(a, values) || '9999-99-99'}T${getJellyTimeValue(a, values) || '99:99'}`;
    const bKey = `${getJellyDateValue(b, values) || '9999-99-99'}T${getJellyTimeValue(b, values) || '99:99'}`;
    return aKey.localeCompare(bKey);
  });
};

export const isPlannerPayload = (payload: unknown): payload is PlannerPayload => {
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

export const getMaxNumericId = (ids: string[], prefix: string) => {
  return ids.reduce((maxId, id) => {
    if (!id.startsWith(prefix)) return maxId;

    const numericId = Number.parseInt(id.slice(prefix.length), 10);
    return Number.isFinite(numericId) ? Math.max(maxId, numericId) : maxId;
  }, 0);
};

export const normalizeName = (name: string) => name.trim();

export const dedupeNames = (names: string[]) => {
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
