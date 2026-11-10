import { usePlannerDispatch } from '../../state/PlannerContext';
import { useOpenGroup } from './useOpenGroup';
import styles from './Join.module.css';

/** "join-in" / "joining" switch at the top of both Join in screens. */
export function JoinTabs({ active }: { active: 'join' | 'group' }) {
  const dispatch = usePlannerDispatch();
  const openGroup = useOpenGroup();
  return (
    <div className={styles.tabs} role="tablist">
      <button
        type="button"
        role="tab"
        aria-selected={active === 'join'}
        className={styles.tab}
        onClick={() => dispatch({ type: 'navigate', screen: 'join' })}
      >
        join-in
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={active === 'group'}
        className={styles.tab}
        onClick={() => active !== 'group' && openGroup()}
      >
        joining
        <i aria-label="New activity" />
      </button>
    </div>
  );
}
