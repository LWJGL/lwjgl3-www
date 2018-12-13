import { useReducer } from 'react';

function forcedReducer(state: boolean) {
  return !state;
}
export function useForceUpdate() {
  return useReducer(forcedReducer, false)[1];
}
