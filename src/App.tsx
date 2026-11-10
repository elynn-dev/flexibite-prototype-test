import type { ReactNode } from 'react';
import { ShoppingList } from './overlays/ShoppingList';
import { AssistantSheet } from './overlays/assistant/AssistantSheet';
import { HomeScreen } from './screens/HomeScreen';
import { EditScreen } from './screens/edit/EditScreen';
import { ChooseDatesScreen } from './screens/plan/ChooseDatesScreen';
import { PlanBuilderScreen } from './screens/plan/PlanBuilderScreen';
import { PlanSummaryScreen } from './screens/plan/PlanSummaryScreen';
import { RecipeScreen } from './screens/recipe/RecipeScreen';
import { ExploreScreen } from './screens/ideas/ExploreScreen';
import { MealIdeasScreen } from './screens/ideas/MealIdeasScreen';
import { GroupScreen } from './screens/join/GroupScreen';
import { JoinScreen } from './screens/join/JoinScreen';
import { PantryScreen } from './screens/pantry/PantryScreen';
import { usePlanner, usePlannerDispatch } from './state/PlannerContext';
import type { Screen } from './state/plannerReducer';
import styles from './App.module.css';

/** Which component draws each screen. Add new screens here. */
function renderScreen(screen: Screen, recipeId: ReturnType<typeof usePlanner>['openRecipeId']): ReactNode {
  switch (screen) {
    case 'home':
      return <HomeScreen />;
    case 'recipe':
      return recipeId ? <RecipeScreen key={recipeId} recipeId={recipeId} /> : null;
    case 'edit':
      return <EditScreen />;
    case 'choose':
      return <ChooseDatesScreen />;
    case 'build':
      return <PlanBuilderScreen />;
    case 'summary':
      return <PlanSummaryScreen />;
    case 'ideas':
      return <MealIdeasScreen />;
    case 'explore':
      return <ExploreScreen />;
    case 'pantry':
      return <PantryScreen />;
    case 'join':
      return <JoinScreen />;
    case 'group':
      return <GroupScreen />;
  }
}

/** Shows the current screen inside a phone-sized frame (393 × 852, as in Figma). */
export default function App() {
  const { screen, openRecipeId, overlay } = usePlanner();
  const dispatch = usePlannerDispatch();

  return (
    <main>
      <div className={styles.frame}>
        {renderScreen(screen, openRecipeId)}
        {overlay === 'cart' && <ShoppingList />}
        {overlay === 'assistant' && <AssistantSheet />}
      </div>
      <div className={styles.help}>
        <span>
          Tap Create a plan to plan a meal with the assistant. On a day with meals, tap the black +, then the pencil, and
          drag a card onto a day. Tap a meal to open its recipe.
        </span>
        <button type="button" onClick={() => dispatch({ type: 'reset' })}>
          Reset
        </button>
      </div>
    </main>
  );
}
