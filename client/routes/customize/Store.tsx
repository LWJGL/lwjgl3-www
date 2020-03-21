import { createContext, useContext, useReducer, useEffect, useRef, useMemo } from 'react';
import { configLoad } from './actions';
import type { ActionCreator } from './actions';
import { config, getConfigSnapshot } from './config';
import { reducer } from './reducer';
import type { BuildStore, BuildStoreSnapshot } from './types';
import debounce from 'lodash-es/debounce';
import isEqual from 'react-fast-compare';

// Constants
const STORAGE_KEY = 'lwjgl-build-config';

type StoreTuple = [BuildStore, React.Dispatch<ActionCreator>];
export const StoreContext = createContext<StoreTuple>([config, () => {}]);

if (!FLAG_PRODUCTION) {
  StoreContext.displayName = 'StoreContext';
}

export function useStore(): StoreTuple {
  return useContext(StoreContext);
}

export function useStoreRef() {
  const [state] = useContext(StoreContext);
  const storeRef = useRef<BuildStore>(state);
  storeRef.current = state;
  return storeRef;
}

type SliceTuple<S> = [S, React.Dispatch<ActionCreator>];

export function useSlice<S>(slicer: (state: BuildStore) => S): SliceTuple<S> {
  const [state, dispatch] = useContext(StoreContext);
  return [slicer(state), dispatch];
}

export function useMemoSlice<S>(
  getSlice: (state: BuildStore) => S,
  getInputs: (state: BuildStore) => React.DependencyList
): SliceTuple<S> {
  const [state, dispatch] = useContext(StoreContext);
  return [useMemo(() => getSlice(state), getInputs(state)), dispatch];
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

let prevConfig: BuildStoreSnapshot | null;
const saveSnapshot = debounce((state: BuildStore) => {
  if (state === config) {
    // Skip default state
    return;
  }
  const save = getConfigSnapshot(state);
  if (save === null) {
    if (prevConfig !== null) {
      prevConfig = null;
      localStorage.removeItem(STORAGE_KEY);
    }
    return;
  }

  // Save to local storage
  // * NOTE: We deep compare because it is much faster than serializing & storing on disk every time
  if (prevConfig === null || !isEqual(prevConfig, save)) {
    prevConfig = save;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
  }
}, 1000);

// Store Provider
export const Provider: React.FC = (props) => {
  const [state, dispatch] = useReducer<React.Reducer<BuildStore, ActionCreator>>(reducer, config);

  useEffect(() => {
    const restore = localStorage.getItem(STORAGE_KEY);
    if (restore !== null) {
      try {
        prevConfig = JSON.parse(restore) as BuildStoreSnapshot;
        dispatch(configLoad(prevConfig));
      } catch (err) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    return () => {
      // Immediately flush pending unsaved config changes
      saveSnapshot.flush();
    };
  }, []);

  useEffect(() => {
    saveSnapshot(state);
  });

  return <StoreContext.Provider value={[state, dispatch]}>{props.children}</StoreContext.Provider>;
};
