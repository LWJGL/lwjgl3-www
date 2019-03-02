import { useState, useReducer } from 'react';
import produce, { Draft } from 'immer';

// Copied from: https://github.com/mweststrate/use-immer

type Recipe<S = any> = (this: Draft<S>, draftState: Draft<S>) => void | S;
type Update<S = any> = (recipe: Recipe<S>) => void;
type Reducer<S = any, A = any> = (this: Draft<S>, draftState: Draft<S>, action: A) => void | S;

export function useImmer<S = any>(initialValue: S): [S, Update<S>] {
  const [value, updateValue] = useState(initialValue);
  return [
    value,
    updater => {
      updateValue(produce(updater));
    },
  ];
}

export function useImmerReducer<S = any, A = any>(
  reducer: Reducer<S, A>,
  initialState: S,
  initialAction: A
): [S, React.Dispatch<A>] {
  return useReducer(produce(reducer), initialState, initialAction);
}
