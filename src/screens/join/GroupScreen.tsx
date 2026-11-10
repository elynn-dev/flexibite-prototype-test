import { useEffect, useRef, useState } from 'react';
import { MiniButton, SnackBar } from '../../components/Controls';
import { Icon } from '../../components/Icon';
import { MainTabBar } from '../../components/TabBar';
import { usePlanner, usePlannerDispatch } from '../../state/PlannerContext';
import homeCooking from '../../assets/images/group-home-cooking.jpg';
import friend1 from '../../assets/images/avatar-friend-1.jpg';
import friend2 from '../../assets/images/avatar-friend-2.jpg';
import tomatoSoup from '../../assets/images/tomato-soup.jpg';
import { CheckIn } from './CheckIn';
import { JoinTabs } from './JoinTabs';
import styles from './Join.module.css';

/** A group the user has joined (Figma Join in group): progress, check-in and the group feed. */
export function GroupScreen() {
  const { join } = usePlanner();
  const dispatch = usePlannerDispatch();
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [snack, setSnack] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const finishCheckIn = () => {
    setCheckInOpen(false);
    if (!join.done && join.checked[0] && join.checked[1]) {
      dispatch({ type: 'updateJoin', join: { done: true } });
      setSnack(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setSnack(false), 5000);
    }
  };

  const undo = () => {
    clearTimeout(timer.current);
    setSnack(false);
    dispatch({ type: 'updateJoin', join: { done: false, checked: [true, false] } });
  };

  return (
    <section className={styles.screen} aria-label="Join in group">
      <div className={styles.scroll}>
        <div className={styles.groupTop}>
          <JoinTabs active="group" />
          <div className={styles.hero}>
            <img src={homeCooking} alt="" />
          </div>
          <h1 className={styles.groupTitle}>
            Back To
            <br />
            Home Cooking
          </h1>
          <div className={styles.status}>
            <span className={styles.members}>
              <Icon name="person" size={14} />
              56
            </span>
            <span>Apr.01-May.01</span>
            <span className={styles.statusBar} />
            <span className={styles.goal}>3 days / week</span>
          </div>
          <div className={styles.progress}>
            <span>This week</span>
            <div className={styles.track}>
              <i />
              <u>80%</u>
            </div>
          </div>
          {join.done ? (
            <button type="button" className={`${styles.checkInButton} ${styles.ok}`} onClick={() => setCheckInOpen(true)}>
              <img src={friend1} alt="" />
              Keep on track!
            </button>
          ) : (
            <button
              type="button"
              className={styles.checkInButton}
              onClick={() => {
                dispatch({ type: 'updateJoin', join: { checked: [true, false] } });
                setCheckInOpen(true);
              }}
            >
              <img src={friend2} alt="" />2 / 3
            </button>
          )}
        </div>

        <div className={styles.feed}>
          <div className={styles.tools}>
            <MiniButton className={styles.all}>
              All <Icon name="chevronDownSm" size={16} />
            </MiniButton>
            <MiniButton className={styles.toolSquare} aria-label="Search">
              <Icon name="search" size={16} />
            </MiniButton>
            <span className={styles.spacer} />
            <MiniButton className={styles.toolSquare} aria-label="New post">
              <Icon name="edit" size={16} />
            </MiniButton>
          </div>
          <article className={styles.post}>
            <div className={styles.postHead}>
              <span className={styles.avatar} />
              ELYN <small>3 MIN AGO</small>
              <span className={styles.more} aria-hidden="true">
                ···
              </span>
            </div>
            <img src={tomatoSoup} alt="Tomato soup with bread" />
            <p>I made tomato soup today!</p>
            <div className={styles.postFoot}>
              <Icon name="comment" size={20} />2
              <Icon name="heartCount" size={20} />
            </div>
          </article>
        </div>
      </div>

      <div className={styles.dock}>
        {snack && <SnackBar text="Your mission updated" onUndo={undo} />}
        <MainTabBar active="join-in" />
      </div>

      {checkInOpen && <CheckIn onDone={finishCheckIn} />}
    </section>
  );
}
