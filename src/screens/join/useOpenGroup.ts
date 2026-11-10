import { usePlannerDispatch } from '../../state/PlannerContext';

/** Open the group page with today's check-in starting fresh. */
export function useOpenGroup() {
  const dispatch = usePlannerDispatch();
  return () => {
    dispatch({ type: 'updateJoin', join: { done: false, checked: [true, false] } });
    dispatch({ type: 'navigate', screen: 'group' });
  };
}
