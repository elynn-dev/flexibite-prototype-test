import type { DayKey, PlannedMeal } from '../data/types';
import {
  CALENDAR_MONTH,
  MONTH_SHORT,
  TODAY,
  WEEKDAY_LETTERS,
  calendarWeeks,
  longLabel,
  toKey,
  weekIndexOf,
} from '../lib/dates';
import { Icon } from './Icon';
import { MealMarker } from './MealTime';
import styles from './Calendar.module.css';

interface CalendarProps {
  selectedDay: DayKey;
  /** Highlight the selected day. */
  showSelection: boolean;
  /** Show all weeks instead of only the selected week. */
  expanded: boolean;
  weeklyView: boolean;
  mealsOn: (day: DayKey) => PlannedMeal[];
  onSelectDay: (day: DayKey) => void;
  onToggleExpanded: () => void;
  onToggleWeeklyView: () => void;
}

/** Figma "calendar-base": month heading, weekday letters, the day grid and the disclosure arrow. */
export function Calendar(props: CalendarProps) {
  const { selectedDay, showSelection, expanded, weeklyView, mealsOn, onSelectDay } = props;
  const weeks = calendarWeeks();
  const visible = expanded ? weeks : [weeks[weekIndexOf(selectedDay)]];

  return (
    <div className={styles.calendar}>
      <div className={styles.heading}>
        <div className={`${styles.month} heading-h2`}>
          <span>{MONTH_SHORT[CALENDAR_MONTH]}</span>
          <Icon name="chevronDownSm" size={16} />
        </div>
        <button
          type="button"
          className={styles.viewToggle}
          aria-label={weeklyView ? 'Show the daily calendar' : 'Show the weekly calendar'}
          aria-pressed={weeklyView}
          onClick={props.onToggleWeeklyView}
        >
          <Icon name={weeklyView ? 'viewToggleWeekly' : 'viewToggle'} size={32} />
        </button>
      </div>

      <div className={styles.dates}>
        <div className={styles.weekdays} aria-hidden="true">
          {WEEKDAY_LETTERS.map((l, i) => (
            <span key={i} className="label-xs-regular">
              {l}
            </span>
          ))}
        </div>
        <div className={styles.weeks}>
          {visible.map((week) => (
            <div className={styles.week} key={toKey(week[0])}>
              {week.map((d) => {
                const key = toKey(d);
                const meals = mealsOn(key);
                const cls = [
                  styles.day,
                  'label-xs-regular',
                  d.getMonth() !== CALENDAR_MONTH && styles.outside,
                  showSelection && key === selectedDay && styles.selected,
                ]
                  .filter(Boolean)
                  .join(' ');
                return (
                  <button
                    key={key}
                    type="button"
                    className={cls}
                    aria-label={`${longLabel(key)}, ${meals.length} planned`}
                    aria-pressed={showSelection && key === selectedDay}
                    onClick={() => onSelectDay(key)}
                  >
                    <span>{d.getDate()}</span>
                    {meals.length > 0 && (
                      <span className={styles.plan}>
                        {meals.map((m) => (
                          <MealMarker key={m.meal} meal={m.meal} />
                        ))}
                      </span>
                    )}
                    {key === TODAY && <i className={styles.today} />}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        className={`${styles.disclosure} ${expanded ? styles.open : ''}`}
        aria-label={expanded ? 'Show one week' : 'Show the whole month'}
        aria-expanded={expanded}
        onClick={props.onToggleExpanded}
      >
        <Icon name="disclosureArrow" size={12} />
      </button>
    </div>
  );
}
