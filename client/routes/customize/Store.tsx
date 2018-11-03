import * as React from 'react';
import { createContext, useContext, useReducer } from 'react';
import { ActionTypes } from './actions';
import { config } from './config';
import { reducer } from './reducer';
import { BuildConfig } from './types';

// Create store for Build Configurator.
// This lives in a React Context
interface StoreContextType {
  state: BuildConfig;
  dispatch: React.Dispatch<ActionTypes>;
}

export const StoreContext = createContext<StoreContextType>({
  state: config,
  dispatch: () => {},
});

export function useStore<S>(slicer: (state: BuildConfig) => S): [S, React.Dispatch<ActionTypes>] {
  const { state, dispatch } = useContext(StoreContext);
  return [slicer(state), dispatch];
}

interface ProviderProps {
  children: React.ReactNode;
}

// Build store Provider
// <Connect /> components in the tree will receive updates everytime the store changes
export function Provider(props: ProviderProps) {
  const [state, dispatch] = useReducer<BuildConfig, ActionTypes>(reducer, config);

  return (
    <StoreContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {props.children}
    </StoreContext.Provider>
  );
}
