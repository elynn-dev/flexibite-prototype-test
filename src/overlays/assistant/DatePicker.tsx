import { useEffect, useRef, useState } from 'react';
import { Icon } from '../../components/Icon';
import { MEAL_LABEL, MEAL_TIMES, type DayKey, type MealTime } from '../../data/types';
import { CALENDAR_MONTH, MONTH_SHORT, TODAY, WEEKDAY_LETTERS, calendarWeeks, longLabel, toKey } from '../../lib/dates';
import styles from './DatePicker.module.css';

/** Month calendar over the assistant: tap a day, then choose Breakfast / Lunch / Dinner. */
export function DatePicker({ onPick, onClose }: { onPick: (day: DayKey, meal: MealTime) => void; onClose: () => void }) {
  const [chosen, setChosen] = useState<DayKey | null>(null);
  const [menuPos, setMenuPos] = useState<{ left: number; top: number } | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const choose = (day: DayKey, el: HTMLButtonElement) => {
    setChosen(day);
    const cardWidth = cardRef.current?.clientWidth ?? 0;
    // Put the menu to the right of the day, or to the left if it would run off the card.
    let left = el.offsetLeft + el.offsetWidth + 4;
    if (left + 94 > cardWidth) left = el.offsetLeft - 94 - 4;
    setMenuPos({ left, top: el.offsetTop });
  };

  return (
    <div className={styles.backdrop} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.card} role="dialog" aria-label="Choose a date" ref={cardRef}>
        <div className={styles.heading}>
          <span>{MONTH_SHORT[CALENDAR_MONTH]}</span>
          <Icon name="chevronDownSm" size={16} />
        </div>
        <div className={styles.weekdays}>
          {WEEKDAY_LETTERS.map((l, i) => (
            <span key={i}>{l}</span>
          ))}
        </div>
        {calendarWeeks().map((week) => (
          <div className={styles.week} key={toKey(week[0])}>
            {week.map((d) => {
              const day = toKey(d);
              return (
                <button
                  key={day}
                  type="button"
                  className={[
                    styles.day,
                    d.getMonth() !== CALENDAR_MONTH && styles.outside,
                    day === TODAY && styles.today,
                    day === chosen && styles.selected,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-label={longLabel(day)}
                  onClick={(e) => choose(day, e.currentTarget)}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        ))}
        {chosen && menuPos && (
          <div className={styles.menu} role="menu" style={menuPos}>
            {MEAL_TIMES.map((m) => (
              <button key={m} type="button" role="menuitem" onClick={() => onPick(chosen, m)}>
                {MEAL_LABEL[m]}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
