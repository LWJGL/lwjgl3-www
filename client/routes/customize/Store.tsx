import * as React from 'react';
import { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { ActionCreator, configLoad } from './actions';
import { config } from './config';
import { reducer } from './reducer';
import { getConfig } from './bundler';
import { BuildStore, BuildStoreSnapshot } from './types';
import debounce from 'lodash-es/debounce';
import * as isEqual from 'react-fast-compare';

// Constants
const STORAGE_KEY = 'lwjgl-build-config';

// Create store for Build Configurator.
// This lives in a React Context
interface StoreContextType {
  state: BuildStore;
  dispatch: React.Dispatch<ActionCreator>;
}

export const StoreContext = createContext<StoreContextType>({
  state: config,
  dispatch: () => {},
});

export function useStore<S>(slicer: (state: BuildStore) => S): [S, React.Dispatch<ActionCreator>] {
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
  const [state, dispatch] = useReducer<BuildStore, ActionCreator>(reducer, config);
  const prevConfig: React.MutableRefObject<null | BuildStoreSnapshot> = useRef(null);

  useEffect(() => {
    if (firstLoad) {
      firstLoad = false;
      const restore = localStorage.getItem(STORAGE_KEY);
      if (restore !== null) {
        try {
          let previousConfig: BuildStoreSnapshot = JSON.parse(restore);
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
