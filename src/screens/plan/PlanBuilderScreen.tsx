import { useEffect, useRef, useState } from 'react';
import { Button } from '../../components/Button';
import { OverlayHeader } from '../../components/Controls';
import { Icon } from '../../components/Icon';
import { MealMarker } from '../../components/MealTime';
import { ListItem } from '../../components/ListItem';
import { RECIPES } from '../../data/recipes';
import type { DayKey, MealTime, RecipeId } from '../../data/types';
import { chipLabel } from '../../lib/dates';
import { usePlanner, usePlannerDispatch } from '../../state/PlannerContext';
import { draftTypes } from '../../state/plannerReducer';
import tomatoSoup from '../../assets/images/tomato-soup.jpg';
import styles from './Plan.module.css';

interface Choice {
  name: string;
  image: string;
  /** null = can't be added yet (only shown as an example). */
  recipeId: RecipeId | null;
}

const RECENT: Choice[] = [{ name: 'Tomato soup', image: tomatoSoup, recipeId: null }];
const GO_TO: Choice[] = (['avocado-toast', 'granola-yogurt-bowl', 'baked-chicken-salad'] as RecipeId[]).map((id) => ({
  name: RECIPES[id].name,
  image: RECIPES[id].thumb,
  recipeId: id,
}));

/** Create a plan, step 2 (Figma "Choosing dates-10/11"): search for and pick a recipe. */
export function PlanBuilderScreen() {
  const { draft } = usePlanner();
  const dispatch = usePlannerDispatch();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !searchRef.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  const removeChip = (day: DayKey, meal: MealTime) => {
    const types = draftTypes(draft, day);
    if (types.length > 1) {
      dispatch({ type: 'updateDraft', draft: { types: { ...draft.types, [day]: types.filter((t) => t !== meal) } } });
    } else {
      const nextTypes = { ...draft.types };
      delete nextTypes[day];
      dispatch({ type: 'updateDraft', draft: { dates: draft.dates.filter((d) => d !== day), types: nextTypes } });
    }
  };

  const choose = (id: RecipeId) => {
    dispatch({ type: 'updateDraft', draft: { recipeId: id, removedRows: [], removedNeeds: [] } });
    if (RECIPES[id].steps.length) dispatch({ type: 'openRecipe', recipeId: id, returnTo: 'build', mode: 'plan' });
    else dispatch({ type: 'navigate', screen: 'summary' });
  };

  const q = query.toLowerCase();
  const match = (c: Choice) => !q || c.name.toLowerCase().includes(q);
  const recent = RECENT.filter(match);
  const goTo = GO_TO.filter(match);

  const item = (c: Choice) => (
    <ListItem key={c.name} label={c.name} image={c.image} link={{ label: 'Add to plan', onClick: () => c.recipeId && choose(c.recipeId) }} />
  );

  return (
    <section className={styles.screen} aria-label="Plan builder">
      <div className={styles.scroll}>
        <OverlayHeader onClose={() => dispatch({ type: 'navigate', screen: 'home' })} />
        <div className={styles.chipRow}>
          <Button
            variant="default"
            className={styles.calendarButton}
            aria-label="Edit dates"
            onClick={() => dispatch({ type: 'navigate', screen: 'choose' })}
          >
            <Icon name="calendar" size={20} />
          </Button>
          <div className={`${styles.chips} hide-scrollbar`}>
            {[...draft.dates].sort().flatMap((day) =>
              draftTypes(draft, day).map((meal) => (
                <span className={styles.dateChip} key={`${day}|${meal}`}>
                  <span className={styles.dateChipLabel}>
                    <MealMarker meal={meal} size="md" />
                    {chipLabel(day)}
                  </span>
                  <button type="button" aria-label={`Remove ${chipLabel(day)} ${meal}`} onClick={() => removeChip(day, meal)}>
                    <Icon name="close" size={20} />
                  </button>
                </span>
              )),
            )}
          </div>
        </div>

        <div ref={searchRef}>
          <label className={styles.search}>
            <Icon name="search" size={20} />
            <input
              type="text"
              placeholder="Choosing a recipe"
              aria-label="Search recipes"
              value={query}
              onFocus={() => setOpen(true)}
              onClick={() => setOpen(true)}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
            />
          </label>
          {open && (
            <div className={styles.dropdown}>
              {recent.length > 0 && (
                <div className={styles.dropSection}>
                  <h3>Recent</h3>
                  <div className={styles.dropList}>{recent.map(item)}</div>
                </div>
              )}
              {goTo.length > 0 && (
                <div className={styles.dropSection}>
                  <h3>Go-to meal</h3>
                  <div className={styles.dropList}>{goTo.map(item)}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
