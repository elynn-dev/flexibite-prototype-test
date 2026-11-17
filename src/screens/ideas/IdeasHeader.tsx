import { OverlayHeader } from '../../components/Controls';
import { Icon } from '../../components/Icon';
import { Tabs } from '../../components/Tabs';
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
      {/* Figma tabs, type=meal-idea--nav. "Your picks" isn't built yet. */}
      <Tabs
        type="meal-idea-nav"
        className={styles.tabs}
        items={[
          { id: 'picked', label: 'Picked for you', icon: <Icon name="star" size={16} /> },
          { id: 'explore', label: 'Explore', icon: <Icon name="search" size={16} /> },
          { id: 'picks', label: 'Your picks', icon: <Icon name="bookmark" size={16} /> },
        ]}
        value={active}
        onChange={(id) => {
          if (id === 'picked') dispatch({ type: 'navigate', screen: 'ideas' });
          if (id === 'explore') dispatch({ type: 'navigate', screen: 'explore' });
        }}
      />
    </>
  );
}
