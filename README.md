# Meal Planner

The meal planner prototype rebuilt as a React + TypeScript app (Vite). The visuals follow the Figma file
"[Design system] Meal planner"; the behaviour follows the original HTML prototype.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm run lint
```

## Publish to GitHub Pages

```bash
npm run deploy
```

This builds the app and uploads it to the `gh-pages` branch. The live site is
https://elynn-dev.github.io/flexibite-prototype-test/ (GitHub Pages must be set to deploy from the
`gh-pages` branch). Pushing to `main` alone does not update the live site.

## Where things live

```
src/
  App.tsx             Picks the screen to show and the overlay on top of it
  styles/
    tokens.css        Colours, shadows, fonts, spacing, named after the Figma variables
    typography.css    Figma text styles as classes (heading-h2, label-md-regular, ...)
    global.css        Resets and font loading
  data/
    types.ts          MealTime, Recipe, PlannedMeal, PantryItem, ...
    recipes.ts        Recipe content (name, tags, steps, ingredients, photos)
    pantry.ts         What's in the pantry when the app starts
  lib/dates.ts        Calendar helpers (April 2026 grid, date labels, day maths)
  state/
    plannerReducer.ts All app state and every action (navigate, add plans, save recipe, ...)
    PlannerContext.ts usePlanner() to read state, usePlannerDispatch() to change it
    PlannerProvider.tsx
  components/         Reusable design-system pieces
    Button, Controls (MiniButton, Pill, Switch, Checkbox, Stepper, SnackBar, OverlayHeader),
    Calendar, MealCard (card + tile), MealRow, MealCardMenu, MealTime (marker + label),
    PageHeader, Recommendations, GroceryBasket, TabBar, ToastMessage, Icon
  screens/
    HomeScreen.tsx    Home (Figma drag-0, drag-7 … drag-9)
    recipe/           Recipe page (drag-0-1); also used inside Create a plan
    edit/             Edit plans (drag-1 … drag-6): drag cards onto days, repeat suggestions
    plan/             Create a plan: Choose dates → Plan builder → Summary
    ideas/            Meal Ideas: Picked for you and Explore
    pantry/           Pantry and the ingredient sheet
    join/             Join in, the group page and the check-in dialog
  overlays/
    ShoppingList.tsx  Grocery list from the basket button
    assistant/        The "Plan a meal" assistant sheet and its date picker
  assets/             Icons (assets/icons/index.ts lists them all), photos and ingredient pictures
```

Each component has a matching `*.module.css` file, so styles stay scoped to that component.

## How navigation works

There is no URL routing: the current screen is `state.screen`, and overlays (grocery list, assistant)
are `state.overlay`. To go somewhere, dispatch an action:

```ts
dispatch({ type: 'navigate', screen: 'pantry' });
dispatch({ type: 'setOverlay', overlay: 'assistant' });
```

To add a screen: add its name to `Screen` in `plannerReducer.ts`, create it under `src/screens/`, and add a
`case` for it in `renderScreen` in `App.tsx`.

## Things that are placeholders (as in the prototype)

Search fields, "Your picks", sort, the add (+) buttons in Pantry / Join in / the grocery list, "Plan my prep
ahead", message boxes in the assistant, and most "See more" buttons don't do anything yet.
