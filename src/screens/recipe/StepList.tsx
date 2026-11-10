import { useState } from 'react';
import type { RecipeStep } from '../../data/types';
import styles from './StepList.module.css';

/** Horizontally scrolling recipe steps with the small scroll indicator underneath. */
export function StepList({ steps }: { steps: RecipeStep[] }) {
  const [progress, setProgress] = useState(0);

  return (
    <div className={styles.wrap}>
      <ol
        className={`${styles.list} hide-scrollbar`}
        onScroll={(e) => {
          const el = e.currentTarget;
          const max = el.scrollWidth - el.clientWidth;
          setProgress(max > 0 ? el.scrollLeft / max : 0);
        }}
      >
        {steps.map((s) => (
          <li className={styles.step} key={s.text}>
            <div className={styles.picture}>
              <img src={s.image} alt="" />
            </div>
            <p>{s.text}</p>
          </li>
        ))}
      </ol>
      <div className={styles.indicator} aria-hidden="true">
        <b />
        <i style={{ left: 2 + progress * 16 }} />
      </div>
    </div>
  );
}
