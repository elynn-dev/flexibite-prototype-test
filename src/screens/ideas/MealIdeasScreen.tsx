import type { ReactNode } from 'react';
import { Pill } from '../../components/Controls';
import { Icon, type IconName } from '../../components/Icon';
import { MealRow } from '../../components/MealRow';
import { RECIPES } from '../../data/recipes';
import { usePlannerDispatch } from '../../state/PlannerContext';
import cucumberSandwich from '../../assets/images/cucumber-sandwich.jpg';
import { IdeasHeader } from './IdeasHeader';
import styles from './Ideas.module.css';

type Availability = 'available' | 'needs' | 'off';

interface Idea {
  name: string;
  image: string;
  availability: Availability;
  /** Opens the recipe page when set. */
  onOpen?: () => void;
}

/** Meal Ideas, "Picked for you" tab (Figma Meal Ideas-1). */
export function MealIdeasScreen() {
  const dispatch = usePlannerDispatch();
  const avocado = RECIPES['avocado-toast'];
  const chicken = RECIPES['baked-chicken-salad'];
  const granola = RECIPES['granola-yogurt-bowl'];
  const openAvocado = () => dispatch({ type: 'openRecipe', recipeId: 'avocado-toast', returnTo: 'ideas' });

  return (
    <section className={styles.screen} aria-label="Meal Ideas">
      <div className={styles.scroll}>
        <IdeasHeader active="picked" />
        <IdeaSection icon="repeat" title="Go-to meal" subtitle="You choose this meal repeatedly">
          <IdeaCard name={avocado.name} image={avocado.thumb} availability="available" onOpen={openAvocado} />
          <IdeaCard name={chicken.name} image={chicken.thumb} availability="available" />
        </IdeaSection>
        <IdeaSection icon="heartSm" title="Enjoyed Meals" subtitle="You reviewed positively.">
          <IdeaCard name={granola.name} image={granola.thumb} availability="needs" />
          <IdeaCard name={chicken.name} image={chicken.thumb} availability="needs" />
        </IdeaSection>
        <IdeaSection icon="backOnIt" title="Back-on-it meal" subtitle="Often helps you get back on track">
          <IdeaCard name="Cucumber Sandwich" image={cucumberSandwich} availability="off" />
          <IdeaCard name={avocado.name} image={avocado.thumb} availability="available" />
        </IdeaSection>
      </div>
    </section>
  );
}

function IdeaSection({ icon, title, subtitle, children }: { icon: IconName; title: string; subtitle: string; children: ReactNode }) {
  return (
    <section className={styles.section}>
      <h2>
        <Icon name={icon} size={16} />
        {title}
      </h2>
      <p>{subtitle}</p>
      <div className={`${styles.row} hide-scrollbar`}>{children}</div>
    </section>
  );
}

function IdeaCard({ name, image, availability, onOpen }: Idea) {
  const pill =
    availability === 'available' ? (
      <Pill tone="dark">Available</Pill>
    ) : availability === 'needs' ? (
      <Pill>
        <Icon name="pantryNeeds" size={16} />
        Needs <b>3+</b>
      </Pill>
    ) : (
      <Pill tone="off">Unavailable</Pill>
    );
  return (
    <div className={styles.card}>
      <MealRow name={name} image={image} trailing={pill} onClick={onOpen ?? (() => {})} ariaLabel={`${name}, ${availability}`} />
    </div>
  );
}
