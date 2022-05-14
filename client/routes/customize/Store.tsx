import { useReducer, useEffect } from 'react';
import { createContext, useContextSelector, useContext /*, useContextUpdate*/ } from 'use-context-selector';
import { config, getConfigSnapshot } from './config';
import { reducer, createActionConfigLoad } from './reducer';
import debounce from 'lodash-es/debounce';
import isEqual from 'react-fast-compare';

import type { ActionMessage } from './reducer';
import type { BuildStore, BuildStoreSnapshot } from './types';

// Constants
const STORAGE_KEY = 'lwjgl-build-config';

export const StoreContext = createContext<BuildStore>(config);
export const DispatchContext = createContext<React.Dispatch<ActionMessage>>(() => {});

if (!FLAG_PRODUCTION) {
  StoreContext.displayName = 'StoreContext';
  DispatchContext.displayName = 'DispatchContext';
}

export function useStore(): BuildStore {
  return useContext(StoreContext);
}

export function useDispatch(): React.Dispatch<ActionMessage> {
  return useContext(DispatchContext);
}

export function useSelector<T>(selector: (store: BuildStore) => T): T {
  return useContextSelector(StoreContext, selector);
}

export let latestStore: BuildStore;
let prevConfig: BuildStoreSnapshot | null;
function saveSnapshot(state: BuildStore): void {
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
}

const saveSnapshotDebounced = debounce(saveSnapshot, 1000);

// Store Provider
export const Provider: FCC = (props) => {
  const [state, dispatch] = useReducer<React.Reducer<BuildStore, ActionMessage>>(reducer, config);
  // const update = useContextUpdate(StoreContext);
  // const safeDispatch = update(() => {});

  useEffect(() => {
    const restore = localStorage.getItem(STORAGE_KEY);
    if (restore !== null) {
      try {
        prevConfig = JSON.parse(restore) as BuildStoreSnapshot;
        dispatch(createActionConfigLoad(prevConfig));
      } catch (err) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    return () => {
      // Immediately flush pending unsaved config changes
      saveSnapshotDebounced.flush();
    };
  }, []);

  useEffect(() => {
    latestStore = state;
    saveSnapshotDebounced(state);
  });

  return (
    <DispatchContext.Provider value={dispatch}>
      <StoreContext.Provider value={state}>{props.children}</StoreContext.Provider>
    </DispatchContext.Provider>
  );
};
