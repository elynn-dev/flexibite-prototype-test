import { Select, SelectButton } from '../../components/Select';
import { useState } from 'react';
import { Button } from '../../components/Button';
import { OverlayHeader } from '../../components/Controls';
import { Icon } from '../../components/Icon';
import { MealMarker } from '../../components/MealTime';
import { ListItem } from '../../components/ListItem';
import { RECIPES } from '../../data/recipes';
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
  const toggleDay = (day: DayKey) => {
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

  // "Choose a meal" on one meal type: pick a recipe for just that day and time.
  const chooseOne = (day: DayKey, meal: MealTime) => {
    dispatch({ type: 'updateDraft', draft: { dates: [day], types: { [day]: [meal] } } });
    dispatch({ type: 'navigate', screen: 'build' });
  };

  // Figma Choosing dates-4/5: the main button turns on from two picked meal types and shows the count.
  const pickedCount = draft.dates.reduce((n, d) => n + (draft.types[d]?.length ?? 0), 0);

  return (
    <section className={styles.screen} aria-label="Choose dates">
      <div className={styles.scroll}>
        <OverlayHeader onClose={() => dispatch({ type: 'navigate', screen: 'home' })} />
        {/* Figma calendar-base heading: month + chevron, month view icon on the right */}
        <div className={styles.titleRow}>
          <div className={`${styles.title} heading-h2`}>
            {MONTH_SHORT[CALENDAR_MONTH]}
            <Icon name="chevronDownSm" size={16} />
          </div>
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
          {/* Figma Choosing dates-2…5: the chevron points down while the list is showing */}
          <SelectButton label="Selected" open={showSelected} chevron={showSelected ? 'down' : 'up'} onClick={() => setShowSelected((s) => !s)} />
        </div>

        {showSelected && (
          <div className={styles.dateRows}>
            {draft.dates.map((day) => {
              const types = draft.types[day] ?? [];
              const planned = mealsOn(plans, day);
              return (
                <div className={styles.dateRow} key={day}>
                  <div className={styles.dateRowHead}>
                    <span>{chipLabel(day)}</span>
                    <Select
                      value={null}
                      placeholder="Meal type"
                      ariaLabel={`Meal type for ${chipLabel(day)}`}
                      options={MEAL_TIMES.map((m) => ({ value: m, label: MEAL_LABEL[m] }))}
                      onChange={(m) => !types.includes(m) && setTypes(day, [...types, m])}
                    />
                  </div>
                  {/* Meals already planned for this day: Figma meal-type (.list-items with the meal's photo) */}
                  {planned.length > 0 && (
                    <div className={styles.plannedList}>
                      {planned.map((p) => (
                        <ListItem
                          key={p.meal}
                          noFill
                          hug
                          labelStyle="sm-medium"
                          image={RECIPES[p.recipeId].thumb}
                          mealTime={p.meal}
                          label={MEAL_LABEL[p.meal]}
                          onDelete={() => dispatch({ type: 'removePlan', day, meal: p.meal })}
                          deleteLabel={`Remove ${MEAL_LABEL[p.meal]} on ${chipLabel(day)}`}
                        />
                      ))}
                    </div>
                  )}
                  {/* Picked meal types: Figma meal-type (.list-items, no picture) with "Choose a meal" and × */}
                  {types.length > 0 && (
                    <div className={styles.typeList}>
                      {types.map((m) => (
                        <ListItem
                          key={m}
                          noFill
                          mealTime={m}
                          label={MEAL_LABEL[m]}
                          link={{ label: 'Choose a meal', onClick: () => chooseOne(day, m) }}
                          onDelete={() => setTypes(day, types.filter((t) => t !== m))}
                          deleteLabel={`Remove ${MEAL_LABEL[m]} on ${chipLabel(day)}`}
                        />
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
        variant="default"
        className={styles.done}
        disabled={pickedCount < 2}
        onClick={() => dispatch({ type: 'navigate', screen: 'build' })}
      >
        {pickedCount < 2 ? 'Choose a meal' : `Choose a meal (${pickedCount})`}
      </Button>
    </section>
  );
}
