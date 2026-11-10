import { useCallback } from 'react';
import { Calendar } from '../components/Calendar';
import { CartButton } from '../components/GroceryBasket';
import { Icon } from '../components/Icon';
import { MealCard, MealTile } from '../components/MealCard';
import { MealCardMenu } from '../components/MealCardMenu';
import { MealTimeLabel } from '../components/MealTime';
import { PageHeader } from '../components/PageHeader';
import { Recommendations } from '../components/Recommendations';
import { MainTabBar } from '../components/TabBar';
import { ToastMessage } from '../components/ToastMessage';
import { RECIPES, hasRecipePage } from '../data/recipes';
import type { DayKey, PlannedMeal } from '../data/types';
import { calendarWeeks, toKey, weekIndexOf, weeklyHeader } from '../lib/dates';
import { usePlanner, usePlannerDispatch } from '../state/PlannerContext';
import { mealsOn } from '../state/plannerReducer';
import tileRainbow from '../assets/images/rainbow-rice-bowl.jpg';
import tileMore from '../assets/images/cucumber-sandwich-tall.jpg';
import styles from './HomeScreen.module.css';

/** Home (Figma drag-0, drag-7 … drag-9): calendar, the selected day's meals, and the bottom dock. */
export function HomeScreen() {
  const state = usePlanner();
  const dispatch = usePlannerDispatch();
  const meals = mealsOn(state.plans, state.selectedDay);

  const dismissToast = useCallback(() => dispatch({ type: 'clearToast' }), [dispatch]);
  const openAssistant = () => dispatch({ type: 'setOverlay', overlay: 'assistant' });
  const openIdeas = () => dispatch({ type: 'navigate', screen: 'ideas' });

  const openRecipe = (p: PlannedMeal) =>
    hasRecipePage(p.recipeId) ? () => dispatch({ type: 'openRecipe', recipeId: p.recipeId, returnTo: 'home' }) : undefined;

  const deletePlan = (day: DayKey, p: PlannedMeal) => () => dispatch({ type: 'deletePlan', day, meal: p.meal });

  /** Edit plans for a day (from a card's ⋮ menu or the recommendations row). */
  const editPlans = (day?: DayKey) => () => {
    if (day) dispatch({ type: 'selectDay', day });
    dispatch({ type: 'navigate', screen: 'edit' });
  };

  /** Tapping an empty day starts a new plan for it. */
  const selectDay = (day: DayKey) => {
    dispatch({ type: 'selectDay', day });
    if (!mealsOn(state.plans, day).length) dispatch({ type: 'startDraft', day });
  };

  return (
    <section className={styles.screen} aria-label="Home">
      <div className={styles.scroll}>
        <PageHeader />

        <div className={styles.pad}>
          <Calendar
            selectedDay={state.selectedDay}
            showSelection={state.userSelectedDay}
            expanded={state.calendarExpanded}
            weeklyView={state.weeklyView}
            mealsOn={(day) => mealsOn(state.plans, day)}
            onSelectDay={selectDay}
            onToggleExpanded={() => dispatch({ type: 'toggleCalendarExpanded' })}
            onToggleWeeklyView={() => dispatch({ type: 'toggleWeeklyView' })}
          />
          <ToastMessage toast={state.toast} onDismiss={dismissToast} onUndo={() => dispatch({ type: 'undoDelete' })} />
        </div>

        <div className={styles.plans}>
          {state.weeklyView ? (
            <WeeklyColumns
              selectedDay={state.selectedDay}
              plans={state.plans}
              onOpen={openRecipe}
              onDelete={deletePlan}
              onEdit={(day) => editPlans(day)}
            />
          ) : meals.length === 0 ? (
            <EmptyDay onCreatePlan={openAssistant} onMore={openIdeas} />
          ) : (
            <div className={styles.daily}>
              {meals.map((p) => (
                <div className={styles.mealGroup} key={p.meal}>
                  <MealTimeLabel meal={p.meal} />
                  <MealCardMenu onEdit={editPlans(state.selectedDay)} onDelete={deletePlan(state.selectedDay, p)}>
                    <MealCard
                      name={RECIPES[p.recipeId].name}
                      image={RECIPES[p.recipeId].image}
                      crop={RECIPES[p.recipeId].cardCrop}
                      onClick={openRecipe(p)}
                    />
                  </MealCardMenu>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles.dock}>
        {/* The + button only appears on days that already have meals. */}
        <div className={meals.length ? undefined : styles.hidden}>
          <Recommendations onAddWithSuggestions={openAssistant} onEditPlans={editPlans()} onMoreIdeas={openIdeas} />
        </div>
        <div className={styles.grocery}>
          <CartButton />
        </div>
        <MainTabBar active="home" />
      </div>
    </section>
  );
}

function EmptyDay({ onCreatePlan, onMore }: { onCreatePlan: () => void; onMore: () => void }) {
  return (
    <div className={styles.empty}>
      <button type="button" className={styles.createPlan} onClick={onCreatePlan}>
        <Icon name="magicAdd" size={20} />
        <span>Create a plan</span>
      </button>
      <div className={styles.tiles}>
        <MealCardMenu vertical>
          <MealTile
            label="Pineapple Fried Rice"
            image={RECIPES['pineapple-fried-rice'].image}
            crop={RECIPES['pineapple-fried-rice'].tallCrop}
            badge={<Icon name="heart" size={20} />} />
        </MealCardMenu>
        <MealCardMenu vertical>
          <MealTile
            label="Rainbow Rice Bowl"
            image={tileRainbow}
            badge={<Icon name="arrowCircle" size={20} />}
            caption={
              <>
                Rainbow Rice
                <br />
                Bowl
              </>
            }
          />
        </MealCardMenu>
        <MealTile label="More meal ideas" image={tileMore} more onClick={onMore} />
      </div>
    </div>
  );
}

interface WeeklyColumnsProps {
  selectedDay: DayKey;
  plans: Record<DayKey, PlannedMeal[]>;
  onOpen: (p: PlannedMeal) => (() => void) | undefined;
  onDelete: (day: DayKey, p: PlannedMeal) => () => void;
  onEdit: (day: DayKey) => () => void;
}

/** Weekly view: one column per day of the selected week, with tall meal tiles. */
function WeeklyColumns({ selectedDay, plans, onOpen, onDelete, onEdit }: WeeklyColumnsProps) {
  const week = calendarWeeks()[weekIndexOf(selectedDay)];
  return (
    <div className={`${styles.weekRow} hide-scrollbar`}>
      {week.map((d) => {
        const day = toKey(d);
        return (
          <div className={styles.weekDay} key={day}>
            <div className={`${styles.weekHeader} label-sm-regular`}>{weeklyHeader(day)}</div>
            {mealsOn(plans, day).map((p) => (
              <div className={styles.weekMeal} key={p.meal}>
                <MealTimeLabel meal={p.meal} />
                <MealCardMenu vertical onEdit={onEdit(day)} onDelete={onDelete(day, p)}>
                  <MealTile label={RECIPES[p.recipeId].name} image={RECIPES[p.recipeId].image}
                    crop={RECIPES[p.recipeId].tallCrop} onClick={onOpen(p)} />
                </MealCardMenu>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
