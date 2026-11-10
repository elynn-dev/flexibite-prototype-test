import { Button } from '../../components/Button';
import { Checkbox } from '../../components/Controls';
import { MealTimeLabel } from '../../components/MealTime';
import { RECIPES } from '../../data/recipes';
import { usePlanner, usePlannerDispatch } from '../../state/PlannerContext';
import styles from './Join.module.css';

const GOAL = 3;

/** "Did you cook at home today?" dialog (Figma Check in-1 / Check in-2). */
export function CheckIn({ onDone }: { onDone: () => void }) {
  const { join } = usePlanner();
  const dispatch = usePlannerDispatch();
  // One day done already this week, plus each meal checked today.
  const days = 1 + join.checked.filter(Boolean).length;
  const left = GOAL - days;

  const toggle = (i: 0 | 1) => {
    const checked: [boolean, boolean] = [...join.checked];
    checked[i] = !checked[i];
    dispatch({ type: 'updateJoin', join: { checked } });
  };

  const meals = [
    { meal: 'lunch' as const, recipe: RECIPES['avocado-toast'] },
    { meal: 'dinner' as const, recipe: RECIPES['baked-chicken-salad'] },
  ];

  return (
    <div className={styles.dialogBackdrop}>
      <div className={styles.checkIn} role="dialog" aria-label="Check in">
        <div className={styles.checkInHead}>
          <h2>Check in</h2>
          <span>Today · Apr.08</span>
        </div>
        <p className={styles.question}>Did you cook at home today?</p>

        {meals.map(({ meal, recipe }, i) => (
          <div key={meal}>
            <MealTimeLabel meal={meal} className={styles.checkInMeal} />
            <div className={styles.checkInItem}>
              <span className={styles.checkInPicture}>
                <img src={recipe.thumb} alt="" />
              </span>
              <span className={styles.checkInText}>
                {recipe.name}
                <Checkbox size={20} checked={join.checked[i]} label={recipe.name} onChange={() => toggle(i as 0 | 1)} />
              </span>
            </div>
          </div>
        ))}

        <div className={styles.week}>
          <span>This week</span>
          <span className={styles.dots}>
            {Array.from({ length: GOAL }, (_, i) => (
              <i key={i} className={i < days ? undefined : styles.emptyDot} />
            ))}
            {days} of {GOAL} days
          </span>
        </div>
        <div className={styles.goalHint}>
          {left > 0 ? `${left} more day${left > 1 ? 's' : ''} to reach your goal` : 'You’ve reached your goal!'}
        </div>
        <Button variant="dark" size="lg" className={styles.checkInDone} onClick={onDone}>
          DONE
        </Button>
      </div>
    </div>
  );
}
