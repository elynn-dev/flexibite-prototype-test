import type { DayKey, MealTime, RecipeId } from '../../data/types';
import { calendarDays, dayNumber, fromDayNumber, weekdayName } from '../../lib/dates';

/**
 * "Read the pattern": remember the last few days a meal was dropped on and use the gap
 * between the last two as a repeat suggestion ("Every other day", "Every Wed", ...).
 */
export interface Suggestion {
  meal: MealTime;
  recipeId: RecipeId;
  step: number;
  last: number;
  lead: string;
}

export type History = Partial<Record<MealTime, number[]>>;

export function stepText(step: number, day: DayKey): string {
  if (step === 1) return 'Every day';
  if (step === 2) return 'Every other day';
  if (step === 7) return `Every ${weekdayName(day).slice(0, 3)}`;
  if (step % 7 === 0) return `Every ${step / 7} weeks`;
  return `Every ${step} days`;
}

/** Returns the updated history and the new suggestion (or null). */
export function learn(
  history: History,
  meal: MealTime,
  recipeId: RecipeId,
  from: DayKey,
  to: DayKey,
): { history: History; suggestion: Suggestion | null } {
  const n = dayNumber(to);
  const h = [...(history[meal] ?? [dayNumber(from)]), n].slice(-3);
  const step = n - h[h.length - 2];
  if (step < 1) return { history: { ...history, [meal]: [n] }, suggestion: null };
  return { history: { ...history, [meal]: h }, suggestion: { meal, recipeId, step, last: n, lead: stepText(step, to) } };
}

/** The days the suggestion would fill: up to 4 weeks ahead, inside the visible calendar. */
export function suggestedDays(s: Suggestion): DayKey[] {
  const all = calendarDays();
  const first = dayNumber(all[0]);
  const lastShown = dayNumber(all[all.length - 1]);
  const out: DayKey[] = [];
  for (let n = s.last + s.step; n <= s.last + Math.max(28, s.step) && n <= lastShown; n += s.step) {
    if (n >= first) out.push(fromDayNumber(n));
  }
  return out;
}
