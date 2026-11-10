import type { ReactNode } from 'react';
import { Icon, type IconName } from '../../components/Icon';
import { MainTabBar } from '../../components/TabBar';
import tomatoPasta from '../../assets/images/explore-tomato-pasta.jpg';
import wouldYouEat from '../../assets/images/explore-would-you-eat.jpg';
import roastedShrimp from '../../assets/images/explore-roasted-shrimp.jpg';
import veggieSalad from '../../assets/images/explore-veggie-salad.jpg';
import butterChicken from '../../assets/images/explore-butter-chicken.jpg';
import pestoPasta from '../../assets/images/explore-pesto-pasta.jpg';
import shakshuka from '../../assets/images/explore-shakshuka.jpg';
import similar1 from '../../assets/images/explore-similar-1.jpg';
import similar2 from '../../assets/images/explore-similar-2.jpg';
import similar3 from '../../assets/images/explore-similar-3.jpg';
import { IdeasHeader } from './IdeasHeader';
import styles from './Ideas.module.css';

const VIDEOS = [
  { image: tomatoPasta, title: '🍅Tomato pasta #shorts #easy', views: '76k views' },
  { image: wouldYouEat, title: 'Would you eat this?😋', views: '1.1M views' },
  { image: roastedShrimp, title: 'Lazy roasted shrimp🍤', views: '121k views' },
];

const FAVOURITES: { image: string; name: ReactNode; label: string; tags: ReactNode; tight?: boolean }[] = [
  { image: veggieSalad, name: <>Roasted Veggi<br />Salad</>, label: 'Roasted Veggi Salad', tags: '#easy#vegiterian' },
  { image: butterChicken, name: <>Butter<br />Chicken Curry</>, label: 'Butter Chicken Curry', tags: <>#30mintocook<br />#curry</> },
  { image: pestoPasta, name: 'Pesto Pasta', label: 'Pesto Pasta', tags: <>#batchcooking<br />#easy</>, tight: true },
  { image: shakshuka, name: 'Shakshuka', label: 'Shakshuka', tags: '', tight: true },
];

/** Meal Ideas, "Explore" tab (Figma Meal Ideas-0). */
export function ExploreScreen() {
  return (
    <section className={styles.screen} aria-label="Meal Ideas, Explore">
      <div className={styles.scroll}>
        <IdeasHeader active="explore" />
        <label className={styles.search}>
          <Icon name="search" size={20} />
          <input type="text" placeholder="Find recipes" aria-label="Find recipes" />
        </label>

        <ExploreSection icon="flame" title="Trending" first>
          {VIDEOS.map((v) => (
            <div className={styles.video} key={v.title}>
              <button type="button" className={styles.tile} aria-label={v.title}>
                <img src={v.image} alt="" />
              </button>
              <div className={styles.videoInfo}>
                <span className={styles.videoTitle}>{v.title}</span>
                <Icon name="dots" size={16} />
              </div>
              <span className={styles.views}>{v.views}</span>
            </div>
          ))}
        </ExploreSection>

        <ExploreSection
          icon="heartOutline"
          title="More Ways to Enjoy Your Favorites"
          subtitle="Discover recipes using ingredients from your go-to meals"
        >
          {FAVOURITES.map((f) => (
            <div className={`${styles.square} ${f.tight ? styles.tight : ''}`} key={f.label}>
              <button type="button" className={`${styles.tile} ${styles.squareTile}`} aria-label={f.label}>
                <img src={f.image} alt="" />
              </button>
              <div className={styles.squareInfo}>
                <span className={styles.squareName}>{f.name}</span>
                {f.tags && <span className={styles.tags}>{f.tags}</span>}
                <span className={styles.squareDots}>
                  <Icon name="dots" size={14} />
                </span>
              </div>
            </div>
          ))}
        </ExploreSection>

        <ExploreSection
          icon="bookmark"
          title="People with Similar Taste Also Like"
          subtitle="Meals chosen by people who enjoy the same dishes as you."
        >
          {[similar1, similar2, similar3].map((img, i) => (
            <div className={styles.square} key={img}>
              <button type="button" className={`${styles.tile} ${styles.squareTile}`} aria-label={`Meal ${i + 1}`}>
                <img src={img} alt="" />
              </button>
            </div>
          ))}
        </ExploreSection>
      </div>
      <div className={styles.tabBar}>
        <MainTabBar active={null} />
      </div>
    </section>
  );
}

function ExploreSection({
  icon,
  title,
  subtitle,
  first,
  children,
}: {
  icon: IconName;
  title: string;
  subtitle?: string;
  first?: boolean;
  children: ReactNode;
}) {
  return (
    <section className={`${styles.exploreSection} ${first ? styles.firstSection : ''}`}>
      <h2>
        <Icon name={icon} size={16} />
        {title}
      </h2>
      {subtitle && <p>{subtitle}</p>}
      <div className={`${styles.exploreRow} hide-scrollbar`}>{children}</div>
    </section>
  );
}
