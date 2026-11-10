import { INITIAL_PANTRY, INITIAL_USED } from '../data/pantry';
import { RECIPES } from '../data/recipes';
import { MEAL_TIMES } from '../data/types';
import type {
  CartItem,
  DayKey,
  MealTime,
  PantryItem,
  PlanEntry,
  PlannedMeal,
  RecipeId,
  Toast,
  UsedIngredient,
} from '../data/types';
import { TODAY } from '../lib/dates';

export type Screen =
  | 'home'
  | 'recipe'
  | 'edit'
  | 'choose' // Create a plan, step 1: pick dates and meal types
  | 'build' // step 2: pick a recipe
  | 'summary' // step 3: review and add
  | 'ideas'
  | 'explore'
  | 'pantry'
  | 'join'
  | 'group';

/** Things that slide over the current screen. */
export type Overlay = 'assistant' | 'cart' | null;

/** A plan being made in the Create-a-plan flow (choose → build → summary). */
export interface PlanDraft {
  dates: DayKey[];
  /** Meal types picked per date. A date with none counts as lunch. */
  types: Record<DayKey, MealTime[]>;
  recipeId: RecipeId | null;
  /** "day|meal" rows removed on the summary screen. */
  removedRows: string[];
  /** Ingredient names removed from "You may need". */
  removedNeeds: string[];
}

export interface JoinState {
  reminders: Record<string, boolean>;
  /** Check-in boxes: [lunch, dinner]. */
  checked: [boolean, boolean];
  /** Today's check-in is complete. */
  done: boolean;
}

export interface PlannerState {
  screen: Screen;
  overlay: Overlay;
  openRecipeId: RecipeId | null;
  /** 'plan' = opened from the Create-a-plan flow (shows the draft's dates, Save goes to the summary). */
  recipeMode: 'view' | 'plan';
  /** Where the recipe screen's close button goes back to. */
  recipeReturnTo: Screen;
  plans: Record<DayKey, PlannedMeal[]>;
  selectedDay: DayKey;
  /** The selected day is only highlighted once the user has picked one. */
  userSelectedDay: boolean;
  weeklyView: boolean;
  calendarExpanded: boolean;
  /** Servings saved per recipe (defaults to 1). */
  servings: Partial<Record<RecipeId, number>>;
  cart: CartItem[];
  /** Increments whenever the basket count should animate. */
  basketBump: number;
  toast: Toast | null;
  lastDeleted: { day: DayKey; meal: PlannedMeal } | null;
  draft: PlanDraft;
  pantry: PantryItem[];
  usedIngredients: UsedIngredient[];
  join: JoinState;
}

const EMPTY_DRAFT: PlanDraft = { dates: [], types: {}, recipeId: null, removedRows: [], removedNeeds: [] };

export const initialState: PlannerState = {
  screen: 'home',
  overlay: null,
  openRecipeId: null,
  recipeMode: 'view',
  recipeReturnTo: 'home',
  plans: {
    '2026-04-08': [
      { meal: 'breakfast', recipeId: 'granola-yogurt-bowl' },
      { meal: 'lunch', recipeId: 'avocado-toast' },
      { meal: 'dinner', recipeId: 'pineapple-fried-rice' },
    ],
    '2026-04-10': [{ meal: 'lunch', recipeId: 'avocado-toast' }],
  },
  selectedDay: TODAY,
  userSelectedDay: false,
  weeklyView: false,
  calendarExpanded: false,
  servings: {},
  cart: [
    { name: 'Avocado', quantity: 6, unit: 'WHOLE', checked: true },
    { name: 'Eggs', quantity: 1, unit: 'TRAY', checked: true },
    { name: 'Bread', quantity: 1, unit: 'LOAF', checked: true },
  ],
  basketBump: 0,
  toast: null,
  lastDeleted: null,
  draft: EMPTY_DRAFT,
  pantry: INITIAL_PANTRY,
  usedIngredients: INITIAL_USED,
  join: { reminders: { easy: true, pantry: false, budget: false }, checked: [true, false], done: false },
};

export type PlannerAction =
  // Navigation
  | { type: 'navigate'; screen: Screen }
  /** Home tab / close buttons: back to Home showing today. */
  | { type: 'goHome' }
  | { type: 'setOverlay'; overlay: Overlay }
  // Home calendar
  | { type: 'selectDay'; day: DayKey }
  | { type: 'toggleWeeklyView' }
  | { type: 'toggleCalendarExpanded' }
  // Plans
  | { type: 'addPlans'; entries: PlanEntry[] }
  | { type: 'removePlan'; day: DayKey; meal: MealTime }
  /** Remove with a "Plan deleted" toast that can be undone. */
  | { type: 'deletePlan'; day: DayKey; meal: MealTime }
  | { type: 'undoDelete' }
  | { type: 'removeRecipeFromDay'; day: DayKey; recipeId: RecipeId }
  // Recipe
  | { type: 'openRecipe'; recipeId: RecipeId; returnTo: Screen; mode?: 'view' | 'plan' }
  | { type: 'closeRecipe' }
  | { type: 'saveRecipe'; recipeId: RecipeId; servings: number }
  // Create-a-plan draft
  | { type: 'startDraft'; day?: DayKey }
  | { type: 'updateDraft'; draft: Partial<PlanDraft> }
  | { type: 'commitDraft' }
  // Grocery list
  | { type: 'toggleCartItem'; index: number }
  | { type: 'changeCartQuantity'; index: number; delta: number }
  | { type: 'removeCheckedCartItems' }
  // Pantry & Join in
  | { type: 'setPantry'; pantry: PantryItem[]; used?: UsedIngredient[] }
  | { type: 'updateJoin'; join: Partial<JoinState> }
  // Toast
  | { type: 'showToast'; toast: Toast }
  | { type: 'clearToast' }
  | { type: 'reset' };

/** Meals planned on a day, always in breakfast → lunch → dinner order. */
export function mealsOn(plans: PlannerState['plans'], day: DayKey): PlannedMeal[] {
  const list = plans[day] ?? [];
  return MEAL_TIMES.flatMap((m) => list.filter((p) => p.meal === m));
}

/** Days a recipe is planned on, oldest first. */
export function daysWithRecipe(plans: PlannerState['plans'], recipeId: RecipeId): DayKey[] {
  return Object.keys(plans)
    .filter((day) => plans[day].some((p) => p.recipeId === recipeId))
    .sort();
}

/** The meal types of a draft date (lunch when none was picked). */
export function draftTypes(draft: PlanDraft, day: DayKey): MealTime[] {
  const t = draft.types[day];
  return t && t.length ? MEAL_TIMES.filter((m) => t.includes(m)) : ['lunch'];
}

/** Rows the summary screen lists: every draft date × meal type, minus removed ones. */
export function draftRows(draft: PlanDraft): { day: DayKey; meal: MealTime }[] {
  return [...draft.dates]
    .sort()
    .flatMap((day) => draftTypes(draft, day).map((meal) => ({ day, meal })))
    .filter((r) => !draft.removedRows.includes(`${r.day}|${r.meal}`));
}

const NEED_UNITS: Record<string, string> = { Avocado: 'whole', Egg: 'whole', Bread: 'Slices' };

/** "You may need" on the summary: ingredient totals for the planned rows. */
export function draftNeeds(state: PlannerState): { name: string; amount: number; unit: string }[] {
  const { draft } = state;
  const recipe = RECIPES[draft.recipeId ?? 'avocado-toast'];
  const rows = draftRows(draft).length;
  const servings = state.servings[recipe.id] ?? 1;
  return recipe.ingredients
    .filter((i) => NEED_UNITS[i.name])
    .map((i) => ({ name: i.name, amount: Math.round(i.amount * servings * rows * 100) / 100, unit: NEED_UNITS[i.name] }))
    .filter((n) => n.amount > 0 && !draft.removedNeeds.includes(n.name));
}

function withoutMeal(plans: PlannerState['plans'], day: DayKey, keep: (p: PlannedMeal) => boolean) {
  const rest = (plans[day] ?? []).filter(keep);
  const next = { ...plans };
  if (rest.length) next[day] = rest;
  else delete next[day];
  return next;
}

/** Add entries, replacing any meal already planned at the same day and time. */
function withEntries(plans: PlannerState['plans'], entries: PlanEntry[]) {
  const next = { ...plans };
  for (const { day, meal, recipeId } of entries) {
    next[day] = [...(next[day] ?? []).filter((p) => p.meal !== meal), { meal, recipeId }];
  }
  return next;
}

function addToCartAvocados(cart: CartItem[], amount: number) {
  return cart.map((c) => (c.name === 'Avocado' ? { ...c, quantity: Math.max(0, c.quantity + amount) } : c));
}

export function plannerReducer(state: PlannerState, action: PlannerAction): PlannerState {
  switch (action.type) {
    case 'navigate':
      return { ...state, screen: action.screen, overlay: null };

    case 'goHome':
      return {
        ...state,
        screen: 'home',
        overlay: null,
        selectedDay: TODAY,
        userSelectedDay: false,
        calendarExpanded: false,
      };

    case 'setOverlay':
      return { ...state, overlay: action.overlay };

    case 'selectDay':
      return { ...state, selectedDay: action.day, userSelectedDay: true };

    case 'toggleWeeklyView':
      return { ...state, weeklyView: !state.weeklyView, calendarExpanded: false };

    case 'toggleCalendarExpanded':
      return { ...state, calendarExpanded: !state.calendarExpanded };

    case 'addPlans':
      return { ...state, plans: withEntries(state.plans, action.entries) };

    case 'removePlan':
      return { ...state, plans: withoutMeal(state.plans, action.day, (p) => p.meal !== action.meal) };

    case 'deletePlan': {
      const removed = (state.plans[action.day] ?? []).find((p) => p.meal === action.meal);
      if (!removed) return state;
      return {
        ...state,
        plans: withoutMeal(state.plans, action.day, (p) => p.meal !== action.meal),
        lastDeleted: { day: action.day, meal: removed },
        toast: { kind: 'ok', text: 'Plan deleted', undo: true },
      };
    }

    case 'undoDelete': {
      if (!state.lastDeleted) return state;
      const { day, meal } = state.lastDeleted;
      return {
        ...state,
        plans: withEntries(state.plans, [{ day, ...meal }]),
        lastDeleted: null,
        toast: null,
      };
    }

    case 'removeRecipeFromDay':
      return { ...state, plans: withoutMeal(state.plans, action.day, (p) => p.recipeId !== action.recipeId) };

    case 'openRecipe':
      return {
        ...state,
        screen: 'recipe',
        overlay: null,
        openRecipeId: action.recipeId,
        recipeReturnTo: action.returnTo,
        recipeMode: action.mode ?? 'view',
      };

    case 'closeRecipe':
      return { ...state, screen: state.recipeReturnTo, openRecipeId: null };

    case 'saveRecipe': {
      const before = state.servings[action.recipeId] ?? 1;
      const servings = { ...state.servings, [action.recipeId]: action.servings };
      // In the Create-a-plan flow, Save just keeps the servings and moves on to the summary.
      if (state.recipeMode === 'plan') {
        return { ...state, servings, screen: 'summary', openRecipeId: null };
      }
      const delta = action.servings - before;
      return {
        ...state,
        servings,
        // Changing servings changes how many avocados go on the grocery list.
        cart: delta ? addToCartAvocados(state.cart, delta) : state.cart,
        basketBump: delta ? state.basketBump + 1 : state.basketBump,
        screen: state.recipeReturnTo,
        openRecipeId: null,
        toast: { kind: 'ok', text: 'Changes saved!', durationMs: 2200 },
      };
    }

    case 'startDraft':
      return { ...state, draft: { ...EMPTY_DRAFT, dates: action.day ? [action.day] : [] }, screen: 'choose', overlay: null };

    case 'updateDraft':
      return { ...state, draft: { ...state.draft, ...action.draft } };

    case 'commitDraft': {
      const rows = draftRows(state.draft);
      if (!rows.length) return state;
      const recipeId = state.draft.recipeId ?? 'avocado-toast';
      const avocados = draftNeeds(state).find((n) => n.name === 'Avocado')?.amount ?? 0;
      return {
        ...state,
        plans: withEntries(state.plans, rows.map((r) => ({ ...r, recipeId }))),
        cart: avocados ? addToCartAvocados(state.cart, avocados) : state.cart,
        selectedDay: rows[0].day,
        userSelectedDay: true,
        calendarExpanded: false,
        draft: EMPTY_DRAFT,
        screen: 'home',
        toast: { kind: 'ok', text: 'Plans added!', durationMs: 2200 },
      };
    }

    case 'toggleCartItem':
      return {
        ...state,
        cart: state.cart.map((c, i) => (i === action.index ? { ...c, checked: !c.checked } : c)),
      };

    case 'changeCartQuantity':
      return {
        ...state,
        cart: state.cart.map((c, i) => (i === action.index ? { ...c, quantity: Math.max(0, c.quantity + action.delta) } : c)),
      };

    case 'removeCheckedCartItems':
      return { ...state, cart: state.cart.filter((c) => !c.checked) };

    case 'setPantry':
      return { ...state, pantry: action.pantry, usedIngredients: action.used ?? state.usedIngredients };

    case 'updateJoin':
      return { ...state, join: { ...state.join, ...action.join } };

    case 'showToast':
      return { ...state, toast: action.toast };

    case 'clearToast':
      return { ...state, toast: null, lastDeleted: null };

    case 'reset':
      return initialState;
  }
}
