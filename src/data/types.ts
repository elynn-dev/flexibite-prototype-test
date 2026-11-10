export type MealTime = 'breakfast' | 'lunch' | 'dinner';

export const MEAL_TIMES: MealTime[] = ['breakfast', 'lunch', 'dinner'];

export const MEAL_LABEL: Record<MealTime, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
};

export type RecipeId = 'granola-yogurt-bowl' | 'avocado-toast' | 'pineapple-fried-rice' | 'baked-chicken-salad';

export type IngredientId = 'avocado' | 'bread' | 'egg' | 'olive-oil' | 'salt';

export interface RecipeIngredient {
  id: IngredientId;
  name: string;
  /** Amount needed for one serving. */
  amount: number;
  unit: string;
}

export interface RecipeStep {
  text: string;
  image: string;
}

export interface ImageCrop {
  width: number;
  height: number;
  left: number;
  top: number;
}

export interface Recipe {
  id: RecipeId;
  name: string;
  /** Tags under the title, e.g. "Go-to meal", "20min to cook", "234kcal". */
  info: string[];
  /** Photo used on the horizontal meal card and the recipe page. */
  image: string;
  /** How Figma crops the photo inside square meal cards (percent of the card). */
  cardCrop?: ImageCrop;
  /** How Figma crops the photo inside the tall 124 × 164 cards. None = the photo just fills the card. */
  tallCrop?: ImageCrop;
  /** Small square photo used in lists (meal ideas, plan builder, edit cards). */
  thumb: string;
  steps: RecipeStep[];
  ingredients: RecipeIngredient[];
}

/** A date written as YYYY-MM-DD. */
export type DayKey = string;

export interface PlannedMeal {
  meal: MealTime;
  recipeId: RecipeId;
}

export interface PlanEntry extends PlannedMeal {
  day: DayKey;
}

export interface CartItem {
  name: string;
  quantity: number;
  unit: string;
  checked: boolean;
}

export type PantryLocation = 'storage' | 'fridge' | 'freezer';

export interface PantryItem {
  name: string;
  /** -1 means "Plenty" (no count is kept). */
  quantity: number;
  unit: string;
  image: string;
  location: PantryLocation;
  /** Shown in red after the amount was just changed. */
  highlight?: boolean;
}

export interface UsedIngredient {
  name: string;
  quantity: number;
}

export type ToastKind = 'hint' | 'ok' | 'fail';

export interface Toast {
  kind: ToastKind;
  text: string;
  /** Shows an undo button that restores the last deleted plan. */
  undo?: boolean;
  /** Hide the toast after this many milliseconds. */
  durationMs?: number;
}
