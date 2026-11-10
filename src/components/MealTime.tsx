import { MEAL_LABEL, type MealTime } from '../data/types';
import styles from './MealTime.module.css';

/**
 * Meal-time shape: circle = breakfast, square = lunch, triangle = dinner.
 * "sm" is the 6px dot under calendar days, "md" is the 12px shape next to labels.
 */
export function MealMarker({ meal, size = 'sm' }: { meal: MealTime; size?: 'sm' | 'md' }) {
  return (
    <span className={`${styles.marker} ${styles[size]}`} aria-hidden="true">
      <i className={styles[meal]} />
    </span>
  );
}

/** Figma "meal-time": shape + "Breakfast" / "Lunch" / "Dinner". */
export function MealTimeLabel({ meal, text, className }: { meal: MealTime; text?: string; className?: string }) {
  return (
    <div className={`${styles.label} label-md-regular ${className ?? ''}`}>
      <MealMarker meal={meal} size="md" />
      {text ?? MEAL_LABEL[meal]}
    </div>
  );
}
