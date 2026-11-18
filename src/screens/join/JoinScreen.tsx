import { useState } from 'react';
import { Link } from '../../components/Link';
import { Post } from '../../components/Post';
import { SectionHeader } from '../../components/SectionHeader';
import { Chip } from '../../components/Chip';
import { Button } from '../../components/Button';

import { Icon } from '../../components/Icon';
import { MealRow } from '../../components/MealRow';
import { MainTabBar } from '../../components/TabBar';
import { usePlanner, usePlannerDispatch } from '../../state/PlannerContext';
import easyMeals from '../../assets/images/group-easy-meals.jpg';
import pantryFirst from '../../assets/images/group-pantry-first.jpg';
import budgetMeals from '../../assets/images/group-budget-meals.jpg';
import mediterraneanPrep from '../../assets/images/posts/mediterranean-prep.jpg';
import tofuCurry from '../../assets/images/posts/tofu-curry.jpg';
import grilledVeggies from '../../assets/images/posts/grilled-veggies.jpg';
import peachy from '../../assets/images/posts/avatar-peachy.png';
import heyjune from '../../assets/images/posts/avatar-heyjune.png';
import noah from '../../assets/images/posts/avatar-noah.png';
import { JoinTabs } from './JoinTabs';
import styles from './Join.module.css';

const SOON = [
  { id: 'easy', name: 'Easy Meals', description: 'Quick meals that don’t take much effort.', image: easyMeals, when: 'In 2 days' },
  { id: 'pantry', name: 'Pantry First', description: 'Use what you have', image: pantryFirst, when: 'In a week' },
  { id: 'budget', name: 'Budget Meals', description: 'Cook well while spending less.', image: budgetMeals, when: 'In a week' },
];

const TAGS = ['All', 'Mediterranean Week', 'Back to Home cooking', 'Budget Meals', 'Chicken curry'];

/** Active-now feed (Figma Join-in feed → posts). */
const POSTS = [
  {
    name: '@peachy',
    time: '3 min ago',
    avatar: peachy,
    avatarBackground: '#dcc3a4',
    image: mediterraneanPrep,
    alt: 'Mediterranean meal prep dishes',
    note: (
      <>
        Another week of Mediterranean meal prep!
        <br />
        🥗 Getting a few things ready for the week
        <br />
        ahead.
      </>
    ),
    comments: 2,
  },
  {
    name: '@heyjune',
    time: '1 day ago',
    avatar: heyjune,
    image: tofuCurry,
    alt: 'Tofu curry with rice',
    note: (
      <>
        Tofu curry for dinner tonight! Been craving
        <br />
        something warm and comforting. 🍛
      </>
    ),
    comments: 2,
    likes: 23,
  },
  {
    name: '@noah',
    time: '1 day ago',
    avatar: noah,
    image: grilledVeggies,
    alt: 'Grilled vegetables with yogurt sauce',
    note: (
      <>
        Grilled some veggies and had them with a
        <br />
        yogurt sauce. So simple, but SO good!
        <br />
        Definitely making this again.
      </>
    ),
    comments: 2,
  },
];

/** Join in tab (Figma Join-in feed): groups starting soon, then what people in active groups are cooking. */
export function JoinScreen() {
  const { join } = usePlanner();
  const dispatch = usePlannerDispatch();
  const [tag, setTag] = useState(TAGS[0]);

  return (
    <section className={styles.screen} aria-label="Join in">
      <div className={styles.scroll}>
        <div className={styles.body}>
          <JoinTabs active="join" />

          <div className={styles.headingContainer}>
            <h1 className={styles.title}>
              Find your
              <br />
              next meal
              <br />
              with others
            </h1>
            <div className={styles.searchRow}>
              <label className={styles.search}>
                <Icon name="search" size={20} />
                <input type="text" placeholder="Explore" aria-label="Explore" />
              </label>
              <Button variant="default" className={styles.create} aria-label="Create a group">
                <Icon name="plusWhiteThick" size={18.286} />
              </Button>
            </div>
          </div>

          <div className={styles.lists}>
            <div className={styles.section}>
              <SectionHeader title="Starting soon" trailing={<Link variant="outline-all">See more</Link>} />
              <div className={`${styles.soonRow} hide-scrollbar`}>
                {SOON.map((g) => {
                  const on = !!join.reminders[g.id];
                  return (
                    <div className={styles.soonCard} key={g.id}>
                      <MealRow
                        name={g.name}
                        description={g.description}
                        image={g.image}
                        trailing={
                          <span className={styles.soonRight}>
                            <Chip type="outline" label={g.when} />
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
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={styles.section}>
              <SectionHeader title="Active now" />
              <div className={styles.feedList}>
                <div className={`${styles.tags} hide-scrollbar`} role="group" aria-label="Filter by group">
                  {TAGS.map((t) => (
                    <button key={t} type="button" className={styles.tag} aria-pressed={tag === t} onClick={() => setTag(t)}>
                      <Chip type={tag === t ? 'default' : 'outline'} label={t} />
                    </button>
                  ))}
                </div>
                <div className={styles.posts}>
                  {POSTS.map((p) => (
                    <Post
                      key={p.name}
                      name={p.name}
                      time={p.time}
                      avatar={p.avatar}
                      avatarBackground={p.avatarBackground}
                      image={p.image}
                      imageAlt={p.alt}
                      note={p.note}
                      comments={p.comments}
                      likes={p.likes}
                      contentGap={24}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.tabBar}>
        <MainTabBar active="join-in" />
      </div>
    </section>
  );
}
