import { OverlayHeader } from '../../components/Controls';
import { Icon } from '../../components/Icon';
import { usePlannerDispatch } from '../../state/PlannerContext';
import styles from './Ideas.module.css';

/** Close button, "Meal Ideas" title and the three tabs shared by Picked for you and Explore. */
export function IdeasHeader({ active }: { active: 'picked' | 'explore' }) {
  const dispatch = usePlannerDispatch();
  return (
    <>
      <div className={styles.headerSpace}>
        <OverlayHeader onClose={() => dispatch({ type: 'navigate', screen: 'home' })} />
      </div>
      <h1 className={styles.title}>Meal Ideas</h1>
      <div className={styles.tabs} role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={active === 'picked'}
          className={styles.tab}
          onClick={() => dispatch({ type: 'navigate', screen: 'ideas' })}
        >
          Picked for you
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={active === 'explore'}
          className={styles.tab}
          onClick={() => dispatch({ type: 'navigate', screen: 'explore' })}
        >
          <Icon name="search" size={16} />
          Explore
        </button>
        <button type="button" role="tab" aria-selected={false} className={styles.tab}>
          <Icon name="bookmark" size={16} />
          Your picks
        </button>
      </div>
    </>
  );
}
