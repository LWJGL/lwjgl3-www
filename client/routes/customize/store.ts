import create from 'zustand/vanilla';
import createHook from 'zustand';
import { redux } from 'zustand/middleware';
import { config, getConfigSnapshot } from './config';
import { reducer, loadConfig } from './reducer';
import debounce from 'lodash-es/debounce';
import isEqual from 'react-fast-compare';

import type { BuildStore, BuildStoreSnapshot } from './types';

const STORAGE_KEY = 'lwjgl-build-config';

export const store = create(redux(reducer, getInitialState()));
export const useStore = createHook(store);
export function useDispatch() {
  return useStore((state) => state.dispatch);
}

// Persistence
function getInitialState(): BuildStore {
  const restore = localStorage.getItem(STORAGE_KEY);
  if (restore !== null) {
    try {
      loadConfig(config, JSON.parse(restore) as BuildStoreSnapshot);
    } catch (err) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  return config;
}

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

store.subscribe((state) => {
  saveSnapshotDebounced(state);
});
