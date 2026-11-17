import { Tabs } from '../../components/Tabs';
import { usePlannerDispatch } from '../../state/PlannerContext';
import { useOpenGroup } from './useOpenGroup';
import styles from './Join.module.css';

/** "join-in" / "joining" switch at the top of both Join in screens (Figma tabs, type=join-in-nav). */
export function JoinTabs({ active }: { active: 'join' | 'group' }) {
  const dispatch = usePlannerDispatch();
  const openGroup = useOpenGroup();
  return (
    <Tabs
      type="join-in-nav"
      className={styles.tabs}
      items={[
        { id: 'join', label: 'join-in' },
        { id: 'group', label: 'joining', dot: true },
      ]}
      value={active}
      onChange={(id) => {
        if (id === 'join') dispatch({ type: 'navigate', screen: 'join' });
        else if (active !== 'group') openGroup();
      }}
    />
  );
}
