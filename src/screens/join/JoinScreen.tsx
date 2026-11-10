import { Button } from '../../components/Button';
import { MiniButton, Pill } from '../../components/Controls';
import { Icon } from '../../components/Icon';
import { MealRow } from '../../components/MealRow';
import { MainTabBar } from '../../components/TabBar';
import { usePlanner, usePlannerDispatch } from '../../state/PlannerContext';
import mediterranean from '../../assets/images/group-mediterranean-week.jpg';
import homeCooking from '../../assets/images/group-home-cooking.jpg';
import easyMeals from '../../assets/images/group-easy-meals.jpg';
import pantryFirst from '../../assets/images/group-pantry-first.jpg';
import budgetMeals from '../../assets/images/group-budget-meals.jpg';
import { JoinTabs } from './JoinTabs';
import { useOpenGroup } from './useOpenGroup';
import styles from './Join.module.css';

const ACTIVE = [
  { name: <>Mediterranean<br />Week</>, label: 'Mediterranean Week', image: mediterranean, dates: '08.11-09.11' },
  { name: 'Back To Home Cooking', label: 'Back to Home Cooking', image: homeCooking, dates: '04.01-05.01' },
];

const SOON = [
  { id: 'easy', name: 'Easy Meals', description: 'Quick meals that don’t take much effort.', image: easyMeals, when: 'In 2 days' },
  { id: 'pantry', name: 'Pantry First', description: 'Use what you have', image: pantryFirst, when: 'In a week' },
  { id: 'budget', name: 'Budget Meals', description: 'Cook well while spending less.', image: budgetMeals, when: 'In a week' },
];

/** Join in tab: cooking groups to join with other people. */
export function JoinScreen() {
  const { join } = usePlanner();
  const dispatch = usePlannerDispatch();
  const openGroup = useOpenGroup();

  return (
    <section className={styles.screen} aria-label="Join in">
      <div className={styles.scroll}>
        <JoinTabs active="join" />
        <h1 className={styles.title}>Find your next meal with others</h1>

        <div className={styles.searchRow}>
          <label className={styles.search}>
            <Icon name="search" size={20} />
            <input type="text" placeholder="Explore" aria-label="Explore" />
          </label>
          <Button variant="dark" className={styles.create} aria-label="Create a group">
            <Icon name="plusWhiteThick" size={18} />
          </Button>
        </div>

        <div className={styles.sectionHead}>
          <span>Active now</span>
          <MiniButton className={styles.seeMore} onClick={openGroup}>
            See more
          </MiniButton>
        </div>
        <div className={`${styles.activeRow} hide-scrollbar`}>
          {ACTIVE.map((g) => (
            <div className={styles.activeCard} key={g.label}>
              <MealRow name={g.name} image={g.image} trailing={<Pill tone="dark">{g.dates}</Pill>} onClick={openGroup} ariaLabel={g.label} />
            </div>
          ))}
        </div>

        <div className={`${styles.sectionHead} ${styles.soon}`}>
          <span>Starting soon</span>
          <MiniButton className={styles.seeMore}>See more</MiniButton>
        </div>
        <div className={styles.list}>
          {SOON.map((g) => {
            const on = !!join.reminders[g.id];
            return (
              <MealRow
                key={g.id}
                name={g.name}
                description={g.description}
                image={g.image}
                trailing={
                  <span className={styles.soonRight}>
                    <Pill>{g.when}</Pill>
                    <button
                      type="button"
                      className={styles.bell}
                      aria-label={on ? `Turn off reminder for ${g.name}` : `Remind me about ${g.name}`}
                      aria-pressed={on}
                      onClick={() => dispatch({ type: 'updateJoin', join: { reminders: { ...join.reminders, [g.id]: !on } } })}
                    >
                      <Icon name={on ? 'bellOn' : 'bell'} size={16} />
                    </button>
                  </span>
                }
              />
            );
          })}
        </div>
      </div>
      <div className={styles.tabBar}>
        <MainTabBar active="join-in" />
      </div>
    </section>
  );
}
