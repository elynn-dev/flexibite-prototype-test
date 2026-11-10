import { icons } from '../assets/icons';
import { usePlannerDispatch } from '../state/PlannerContext';
import styles from './TabBar.module.css';

export type Tab = 'home' | 'pantry' | 'join-in';

const TABS: { id: Tab; label: string; normal: string; hover: string; active: string }[] = [
  { id: 'home', label: 'Home', normal: icons.tabHome, hover: icons.tabHome, active: icons.tabHomeActive },
  { id: 'pantry', label: 'Pantry', normal: icons.tabPantry, hover: icons.tabPantryHover, active: icons.tabPantryActive },
  { id: 'join-in', label: 'Join in', normal: icons.tabJoin, hover: icons.tabJoinHover, active: icons.tabJoinActive },
];

/** The tab bar wired to navigation. `active` can be null on screens that aren't a tab (Explore). */
export function MainTabBar({ active }: { active: Tab | null }) {
  const dispatch = usePlannerDispatch();
  return (
    <TabBar
      active={active}
      onSelect={(tab) => {
        if (tab === 'home') dispatch({ type: 'goHome' });
        else dispatch({ type: 'navigate', screen: tab === 'pantry' ? 'pantry' : 'join' });
      }}
    />
  );
}

/** Figma "main-tab": the bottom bar with Home, Pantry and Join in. */
export function TabBar({ active, onSelect }: { active: Tab | null; onSelect: (tab: Tab) => void }) {
  return (
    <nav className={styles.bar} aria-label="Main">
      {TABS.map((t) => {
        const isActive = t.id === active;
        return (
          <button
            key={t.id}
            type="button"
            className={styles.tab}
            aria-label={t.label}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onSelect(t.id)}
          >
            <img src={isActive ? t.active : t.normal} alt="" className={styles.normal} />
            {!isActive && <img src={t.hover} alt="" className={styles.hover} />}
          </button>
        );
      })}
    </nav>
  );
}
