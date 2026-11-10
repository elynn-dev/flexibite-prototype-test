import { useEffect, useRef, useState } from 'react';
import { Button } from '../../components/Button';
import { MiniButton, OverlayHeader } from '../../components/Controls';
import { Icon } from '../../components/Icon';
import { MealMarker } from '../../components/MealTime';
import { MEAL_LABEL, MEAL_TIMES, type DayKey, type MealTime } from '../../data/types';
import { CALENDAR_MONTH, MONTH_SHORT, TODAY, WEEKDAY_LETTERS, calendarWeeks, chipLabel, shortLabel, toKey } from '../../lib/dates';
import { usePlanner, usePlannerDispatch } from '../../state/PlannerContext';
import { mealsOn } from '../../state/plannerReducer';
import styles from './Plan.module.css';

/** Create a plan, step 1 (Figma "Choosing dates"): pick days and the meal types for each. */
export function ChooseDatesScreen() {
  const { draft, plans } = usePlanner();
  const dispatch = usePlannerDispatch();
  const [showSelected, setShowSelected] = useState(true);
  const [menuFor, setMenuFor] = useState<DayKey | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuFor) return;
    const onDown = (e: PointerEvent) => !menuRef.current?.contains(e.target as Node) && setMenuFor(null);
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [menuFor]);

  const toggleDay = (day: DayKey) => {
    setMenuFor(null);
    if (draft.dates.includes(day)) {
      const types = { ...draft.types };
      delete types[day];
      dispatch({ type: 'updateDraft', draft: { dates: draft.dates.filter((d) => d !== day), types } });
    } else {
      dispatch({ type: 'updateDraft', draft: { dates: [...draft.dates, day].sort() } });
    }
  };

  const setTypes = (day: DayKey, types: MealTime[]) =>
    dispatch({ type: 'updateDraft', draft: { types: { ...draft.types, [day]: types } } });

  return (
    <section className={styles.screen} aria-label="Choose dates">
      <div className={styles.scroll}>
        <OverlayHeader height={80} onClose={() => dispatch({ type: 'navigate', screen: 'home' })} />
        <div className={`${styles.title} heading-h2`}>
          {MONTH_SHORT[CALENDAR_MONTH]}
          <Icon name="chevronDownSm" size={16} />
        </div>

        <div className={styles.weekdays} aria-hidden="true">
          {WEEKDAY_LETTERS.map((l, i) => (
            <span key={i}>{l}</span>
          ))}
        </div>
        <div className={styles.grid}>
          {calendarWeeks()
            .flat()
            .map((d) => {
              const day = toKey(d);
              const on = draft.dates.includes(day);
              const picked = on ? (draft.types[day] ?? []) : [];
              const existing = mealsOn(plans, day).map((p) => p.meal);
              const marks = MEAL_TIMES.filter((m) => picked.includes(m) || existing.includes(m));
              return (
                <button
                  key={day}
                  type="button"
                  className={[
                    styles.gridDay,
                    d.getMonth() !== CALENDAR_MONTH && styles.outside,
                    on && styles.on,
                    day === TODAY && styles.today,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-pressed={on}
                  aria-label={shortLabel(day)}
                  onClick={() => toggleDay(day)}
                >
                  {d.getDate()}
                  <span className={styles.marks}>
                    {marks.map((m) => (
                      <MealMarker key={m} meal={m} />
                    ))}
                  </span>
                </button>
              );
            })}
        </div>
        <div className={styles.rule} />

        <div className={styles.selectedToggle}>
          <MiniButton className={styles.upper} aria-expanded={showSelected} onClick={() => setShowSelected((s) => !s)}>
            Selected
            <Icon name={showSelected ? 'chevronDownDark' : 'chevronUp'} size={16} />
          </MiniButton>
        </div>

        {showSelected && (
          <div className={styles.dateRows}>
            {draft.dates.map((day) => {
              const types = draft.types[day] ?? [];
              return (
                <div className={styles.dateRow} key={day}>
                  <div className={styles.dateRowHead} ref={menuFor === day ? menuRef : undefined}>
                    <span>{chipLabel(day)}</span>
                    <MiniButton
                      className={styles.upper}
                      aria-haspopup="listbox"
                      aria-expanded={menuFor === day}
                      onClick={() => setMenuFor(menuFor === day ? null : day)}
                    >
                      Meal type
                      <Icon name={menuFor === day ? 'chevronUp' : 'chevronDownDark'} size={16} />
                    </MiniButton>
                    {menuFor === day && (
                      <div className={styles.typeMenu} role="listbox">
                        {MEAL_TIMES.map((m) => (
                          <button
                            key={m}
                            type="button"
                            role="option"
                            aria-selected={types.includes(m)}
                            onClick={() => {
                              if (!types.includes(m)) setTypes(day, [...types, m]);
                              setMenuFor(null);
                            }}
                          >
                            {MEAL_LABEL[m]}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {types.length > 0 && (
                    <div className={styles.typeChips}>
                      {types.map((m) => (
                        <span className={styles.typeChip} key={m}>
                          <MealMarker meal={m} size="md" />
                          {MEAL_LABEL[m]}
                          <button type="button" aria-label={`Remove ${m}`} onClick={() => setTypes(day, types.filter((t) => t !== m))}>
                            <Icon name="close" size={20} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Button
        variant="dark"
        className={styles.done}
        disabled={!draft.dates.length}
        onClick={() => dispatch({ type: 'navigate', screen: 'build' })}
      >
        Done
      </Button>
    </section>
  );
}
