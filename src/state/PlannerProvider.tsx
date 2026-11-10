import { useReducer, type ReactNode } from 'react';
import { DispatchContext, StateContext } from './PlannerContext';
import { initialState, plannerReducer } from './plannerReducer';

/** Holds the app state for everything inside it. */
export function PlannerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(plannerReducer, initialState);
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  );
}
