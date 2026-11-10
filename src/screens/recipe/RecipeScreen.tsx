import { useCallback, useState } from 'react';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { MealTimeLabel } from '../../components/MealTime';
import { ToastMessage } from '../../components/ToastMessage';
import { RECIPES } from '../../data/recipes';
import type { DayKey, MealTime, RecipeId } from '../../data/types';
import { chipLabel, longLabel } from '../../lib/dates';
import { usePlanner, usePlannerDispatch } from '../../state/PlannerContext';
import { daysWithRecipe, draftTypes } from '../../state/plannerReducer';
import { IngredientStock } from './IngredientStock';
import { ServingSelect } from './ServingSelect';
import { StepList } from './StepList';
import styles from './RecipeScreen.module.css';

/** Recipe page (Figma drag-0-1). */
export function RecipeScreen({ recipeId }: { recipeId: RecipeId }) {
  const { plans, servings: savedServings, toast, recipeMode, draft } = usePlanner();
  const dispatch = usePlannerDispatch();
  const dismissToast = useCallback(() => dispatch({ type: 'clearToast' }), [dispatch]);
  const recipe = RECIPES[recipeId];
  // In the Create-a-plan flow the chips show the plan being made, and the button says Save.
  const planMode = recipeMode === 'plan';

  const [servings, setServings] = useState(savedServings[recipeId] ?? 1);
  const [note, setNote] = useState('');
  // "Done" stays disabled until something on the page changes.
  const [dirty, setDirty] = useState(false);

  const chips: { day: DayKey; meal: MealTime }[] = planMode
    ? [...draft.dates].sort().map((day) => ({ day, meal: draftTypes(draft, day)[0] }))
    : daysWithRecipe(plans, recipeId).map((day) => ({ day, meal: plans[day].find((p) => p.recipeId === recipeId)!.meal }));
  const firstRow = recipe.ingredients.slice(0, 3);
  const secondRow = recipe.ingredients.slice(3);

  const removeChip = (day: DayKey) => {
    if (planMode) {
      dispatch({ type: 'updateDraft', draft: { dates: draft.dates.filter((d) => d !== day) } });
      return;
    }
    dispatch({ type: 'removeRecipeFromDay', day, recipeId });
    setDirty(true);
  };

  const showNotBuilt = (what: string) => () =>
    dispatch({ type: 'showToast', toast: { kind: 'hint', text: `${what} isn't built yet`, durationMs: 2200 } });

  return (
    <section className={styles.screen} aria-label="Recipe">
      <div className={styles.overlayHeader}>
        <button type="button" className={styles.close} aria-label="Close" onClick={() => dispatch({ type: 'closeRecipe' })}>
          <Icon name="close" size={24} />
        </button>
      </div>

      <div className={styles.main}>
        <div className={styles.selectedDates}>
          <Button
            variant="dark"
            className={styles.dateButton}
            aria-label="Edit dates"
            onClick={() => dispatch({ type: 'navigate', screen: planMode ? 'choose' : 'edit' })}
          >
            <Icon name="calendar" size={20} />
          </Button>
          <div className={`${styles.dateChips} hide-scrollbar`}>
            {chips.map(({ day, meal }) => (
              <div className={styles.dateChip} key={day}>
                <MealTimeLabel meal={meal} text={chipLabel(day)} className={styles.chipLabel} />
                <button type="button" aria-label={`Remove ${longLabel(day)}`} onClick={() => removeChip(day)}>
                  <Icon name="closeSm" size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {toast && (
          <div className={styles.toast}>
            <ToastMessage toast={toast} onDismiss={dismissToast} />
          </div>
        )}

        <div className={styles.head}>
          <div className={styles.titleBlock}>
            <div className={styles.title}>
              <h1 className="heading-h4">{recipe.name}</h1>
              <Button size="sm" className={styles.search} aria-label="Search">
                <Icon name="search" size={16} />
              </Button>
            </div>
            <div className={`${styles.info} label-xs-regular-upper`}>
              {recipe.info.map((t, i) => (
                <span key={t} className={`${styles.infoChip} ${i === 0 ? styles.outlined : ''}`}>
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className={styles.photo}>
            <img src={recipe.image} alt={recipe.name} />
          </div>
        </div>

        <div className={styles.sections}>
          <section className={`${styles.section} ${styles.steps}`}>
            <div className={styles.sectionHeader}>
              <h2 className="heading-h6">Steps</h2>
              <Icon name="editSteps" size={16} />
            </div>
            <StepList steps={recipe.steps} />
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className="heading-h6">
                Ingredients
              </h2>
            </div>
            <div className={styles.ingredients}>
              <ServingSelect
                value={servings}
                onChange={(n) => {
                  if (n !== servings) setDirty(true);
                  setServings(n);
                }}
              />
              <div className={`${styles.pantry} hide-scrollbar`}>
                <div className={styles.pantryRows}>
                  <div className={styles.pantryRow}>
                    {firstRow.map((ing) => (
                      <IngredientStock key={ing.id} ingredient={ing} servings={servings} />
                    ))}
                  </div>
                  <div className={styles.pantryRow}>
                    {secondRow.map((ing) => (
                      <IngredientStock key={ing.id} ingredient={ing} servings={servings} />
                    ))}
                    <Button variant="dark" className={styles.addIngredient} aria-label="Add ingredient" onClick={showNotBuilt('Adding ingredients')}>
                      <Icon name="plusWhite" size={20} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className="heading-h6">
                Note
              </h2>
            </div>
            <textarea
              className={`${styles.note} body-sm-regular`}
              placeholder="Placeholder"
              aria-label="Note"
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                setDirty(true);
              }}
            />
          </section>
        </div>
      </div>

      <div className={styles.footer}>
        <Button
          variant="dark"
          size="lg"
          disabled={!planMode && !dirty}
          onClick={() => dispatch({ type: 'saveRecipe', recipeId, servings })}
        >
          {planMode ? 'Save' : 'Done'}
        </Button>
      </div>
    </section>
  );
}
