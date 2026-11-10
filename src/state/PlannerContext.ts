import { createContext, useContext, type Dispatch } from 'react';
import type { PlannerAction, PlannerState } from './plannerReducer';

export const StateContext = createContext<PlannerState | null>(null);
export const DispatchContext = createContext<Dispatch<PlannerAction> | null>(null);

/** Read the app state. */
export function usePlanner(): PlannerState {
  const s = useContext(StateContext);
  if (!s) throw new Error('usePlanner must be used inside <PlannerProvider>');
  return s;
}

/** Change the app state: dispatch({ type: 'navigate', screen: 'pantry' }), etc. */
export function usePlannerDispatch(): Dispatch<PlannerAction> {
  const d = useContext(DispatchContext);
  if (!d) throw new Error('usePlannerDispatch must be used inside <PlannerProvider>');
  return d;
}
