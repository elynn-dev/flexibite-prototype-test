import type { DayKey } from '../data/types';

export const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const WEEKDAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
export const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** The prototype shows April 2026, starting on the Sunday before April 1. */
export const CALENDAR_MONTH = 3; // April (0-based)
export const CALENDAR_START = new Date(2026, 2, 29);
export const CALENDAR_WEEKS = 5;
export const TODAY: DayKey = '2026-04-01';

const pad = (n: number) => String(n).padStart(2, '0');

export function toKey(d: Date): DayKey {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function fromKey(key: DayKey): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}

/** Whole days since 1970 — handy for "every N days" maths. */
export function dayNumber(key: DayKey): number {
  const d = fromKey(key);
  return Math.round(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5);
}

export function fromDayNumber(n: number): DayKey {
  const d = new Date(n * 864e5);
  return toKey(new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

/** All days shown in the month grid, grouped into weeks. */
export function calendarWeeks(weeks = CALENDAR_WEEKS): Date[][] {
  return Array.from({ length: weeks }, (_, w) =>
    Array.from({ length: 7 }, (_, i) => addDays(CALENDAR_START, w * 7 + i)),
  );
}

/** Every day in the 5-week grid, as keys. */
export function calendarDays(): DayKey[] {
  return calendarWeeks().flat().map(toKey);
}

export function weekIndexOf(key: DayKey): number {
  const weeks = calendarWeeks();
  const i = weeks.findIndex((week) => week.some((d) => toKey(d) === key));
  return Math.max(0, i);
}

export function weekdayName(key: DayKey): string {
  return WEEKDAY_NAMES[fromKey(key).getDay()];
}

/** "Apr 8" */
export function shortLabel(key: DayKey): string {
  const d = fromKey(key);
  return `${MONTH_SHORT[d.getMonth()]} ${d.getDate()}`;
}

/** "04.08 Wed" — used on date chips. */
export function chipLabel(key: DayKey): string {
  const d = fromKey(key);
  return `${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${WEEKDAY_NAMES[d.getDay()].slice(0, 3)}`;
}

/** "Apr. 08" — used on the weekly calendar column headers. */
export function weeklyHeader(key: DayKey): string {
  const d = fromKey(key);
  return `${MONTH_SHORT[d.getMonth()]}. ${pad(d.getDate())}`;
}

/** "Apr 8, Wednesday" */
export function longLabel(key: DayKey): string {
  return `${shortLabel(key)}, ${weekdayName(key)}`;
}
