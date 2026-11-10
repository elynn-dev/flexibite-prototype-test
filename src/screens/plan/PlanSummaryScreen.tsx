import { Button } from '../../components/Button';
import { OverlayHeader } from '../../components/Controls';
import { Icon } from '../../components/Icon';
import { MealMarker } from '../../components/MealTime';
import { RECIPES } from '../../data/recipes';
import { chipLabel } from '../../lib/dates';
import { usePlanner, usePlannerDispatch } from '../../state/PlannerContext';
import { draftNeeds, draftRows } from '../../state/plannerReducer';
import styles from './Plan.module.css';

/** Create a plan, step 3: check the days and what to buy, then add to the plan. */
export function PlanSummaryScreen() {
  const state = usePlanner();
  const dispatch = usePlannerDispatch();
  const { draft } = state;
  const recipe = RECIPES[draft.recipeId ?? 'avocado-toast'];
  const rows = draftRows(draft);
  const needs = rows.length ? draftNeeds(state) : [];

  const back = () =>
    recipe.steps.length
      ? dispatch({ type: 'openRecipe', recipeId: recipe.id, returnTo: 'build', mode: 'plan' })
      : dispatch({ type: 'navigate', screen: 'build' });

  return (
    <section className={styles.screen} aria-label="Plan summary">
      <div className={styles.scroll}>
        <OverlayHeader height={80} onBack={back} onClose={() => dispatch({ type: 'navigate', screen: 'home' })} />
        {rows.map(({ day, meal }) => (
          <div key={`${day}|${meal}`}>
            <div className={styles.summaryDate}>
              <MealMarker meal={meal} size="md" />
              {chipLabel(day)}
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryPicture}>
                <img src={recipe.thumb} alt="" />
              </span>
              <span className={styles.summaryText}>
                {recipe.name}
                <button
                  type="button"
                  aria-label={`Remove ${recipe.name} on ${chipLabel(day)}`}
                  onClick={() =>
                    dispatch({ type: 'updateDraft', draft: { removedRows: [...draft.removedRows, `${day}|${meal}`] } })
                  }
                >
                  <Icon name="close" size={24} />
                </button>
              </span>
            </div>
          </div>
        ))}
      </div>

      {needs.length > 0 && (
        <div className={styles.needs}>
          <h2 className="heading-h6">You may need</h2>
          <div className={styles.needChips}>
            {needs.map((n) => (
              <span className={styles.needChip} key={n.name}>
                {n.name} <em>{n.amount}</em> <small>{n.unit}</small>
                <button
                  type="button"
                  aria-label={`Remove ${n.name}`}
                  onClick={() => dispatch({ type: 'updateDraft', draft: { removedNeeds: [...draft.removedNeeds, n.name] } })}
                >
                  <Icon name="close" size={20} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      <Button variant="dark" size="lg" className={styles.addButton} disabled={!rows.length} onClick={() => dispatch({ type: 'commitDraft' })}>
        Add to plan
      </Button>
    </section>
  );
}
