export type SiteMode = 'cyber' | 'sketch';

const toEasternParts = (date: Date) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
  }).formatToParts(date);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '';

  return {
    year: Number(get('year')),
    month: Number(get('month')),
    day: Number(get('day')),
    weekday: get('weekday'),
  };
};

const nthWeekday = (year: number, month: number, weekday: number, nth: number) => {
  const first = new Date(Date.UTC(year, month - 1, 1));
  const offset = (weekday - first.getUTCDay() + 7) % 7;
  return 1 + offset + (nth - 1) * 7;
};

const lastWeekday = (year: number, month: number, weekday: number) => {
  const last = new Date(Date.UTC(year, month, 0));
  return last.getUTCDate() - ((last.getUTCDay() - weekday + 7) % 7);
};

const observedFixedHoliday = (year: number, month: number, day: number) => {
  const actual = new Date(Date.UTC(year, month - 1, day));
  const weekday = actual.getUTCDay();
  if (weekday === 6) return { month, day: day - 1 };
  if (weekday === 0) return { month, day: day + 1 };
  return { month, day };
};

const isMajorUsHoliday = (year: number, month: number, day: number) => {
  const fixedHolidays = [
    observedFixedHoliday(year, 1, 1),
    observedFixedHoliday(year, 6, 19),
    observedFixedHoliday(year, 7, 4),
    observedFixedHoliday(year, 11, 11),
    observedFixedHoliday(year, 12, 25),
  ];

  if (fixedHolidays.some((holiday) => holiday.month === month && holiday.day === day)) {
    return true;
  }

  return (
    (month === 1 && day === nthWeekday(year, 1, 1, 3)) ||
    (month === 2 && day === nthWeekday(year, 2, 1, 3)) ||
    (month === 5 && day === lastWeekday(year, 5, 1)) ||
    (month === 9 && day === nthWeekday(year, 9, 1, 1)) ||
    (month === 10 && day === nthWeekday(year, 10, 1, 2)) ||
    (month === 11 && day === nthWeekday(year, 11, 4, 4))
  );
};

export const getSiteMode = (date = new Date()): SiteMode => {
  const { year, month, day, weekday } = toEasternParts(date);
  const isWeekend = weekday === 'Sat' || weekday === 'Sun';

  return isWeekend || isMajorUsHoliday(year, month, day) ? 'sketch' : 'cyber';
};

export const getSiteModeLabel = (mode: SiteMode) =>
  mode === 'cyber' ? 'Weekday Cyberpunk' : 'Weekend Sketchbook';
