import * as React from 'react';
import { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { ActionTypes, configLoad } from './actions';
import { config } from './config';
import { reducer } from './reducer';
import { getConfig } from './bundler';
import { BuildConfig, BuildConfigStored } from './types';
import debounce from 'lodash-es/debounce';
import * as isEqual from 'react-fast-compare';

// Constants
const STORAGE_KEY = 'lwjgl-build-config';

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

let firstLoad = true;

// Build store Provider
// <Connect /> components in the tree will receive updates everytime the store changes
export function Provider(props: ProviderProps) {
  const [state, dispatch] = useReducer<BuildConfig, ActionTypes>(reducer, config);
  const prevConfig: React.MutableRefObject<null | BuildConfigStored> = useRef(null);

  useEffect(() => {
    if (firstLoad) {
      firstLoad = false;
      const restore = localStorage.getItem(STORAGE_KEY);
      if (restore !== null) {
        try {
          let previousConfig: BuildConfigStored = JSON.parse(restore);
          prevConfig.current = previousConfig;
          dispatch(configLoad(previousConfig));
        } catch (err) {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    }
  }, []);

  useEffect(
    debounce(() => {
      const save = getConfig(state);
      if (save === null) {
        if (prevConfig.current !== null) {
          prevConfig.current = null;
          localStorage.removeItem(STORAGE_KEY);
        }
        return;
      }

      // Save to local storage
      // * NOTE: We deep compare because it is faster than serializing & storing on disk every time
      if (prevConfig.current === null || !isEqual(prevConfig.current, save)) {
        prevConfig.current = save;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
      }
    }, 500)
  );

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
