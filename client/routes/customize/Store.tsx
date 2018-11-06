import * as React from 'react';
import { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { ActionCreator, configLoad } from './actions';
import { config, getConfigSnapshot } from './config';
import { reducer } from './reducer';
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

const emptyFn = () => {};
export const StoreContext = createContext<StoreContextType>({
  state: config,
  dispatch: emptyFn,
});

type SliceTuple<S> = [S, React.Dispatch<ActionCreator>];

export function useStore<S>(slicer: (state: BuildStore) => S): SliceTuple<S> {
  const { state, dispatch } = useContext(StoreContext);
  return [slicer(state), dispatch];
}

export function useStoreRef() {
  const { state } = useContext(StoreContext);
  const storeRef = useRef<BuildStore>(state);
  storeRef.current = state;
  return storeRef;
}

// export function useStoreContext(): StoreContextType {
//   return useContext(StoreContext);
// }

// export function useDispatch<T>(actionCreator: T): T {
//   const { dispatch } = useContext(StoreContext);
//   //@ts-ignore
//   return (...args: any[]) => dispatch(actionCreator.apply(null, args));
// }

// export function readContext<T>(Context: React.Context<T>, observedBits?: number) {
//   //@ts-ignore
//   const dispatcher = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner.currentDispatcher;
//   return dispatcher.readContext(Context, observedBits) as T;
// }

interface ProviderProps {
  children: React.ReactNode;
}

// Store Provider
export function Provider(props: ProviderProps) {
  const [state, dispatch] = useReducer<BuildStore, ActionCreator>(reducer, config);
  const prevConfig: React.MutableRefObject<null | BuildStoreSnapshot> = useRef(null);

  useEffect(() => {
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
  }, []);

  useEffect(
    debounce(() => {
      const save = getConfigSnapshot(state);
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
