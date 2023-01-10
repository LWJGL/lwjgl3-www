import { create } from 'zustand';
import { redux } from 'zustand/middleware';
import { config, getConfigSnapshot } from './config';
import { reducer, loadConfig } from './reducer';
import debounce from 'lodash-es/debounce';
import isEqual from 'react-fast-compare';

import type { BuildStore, BuildStoreSnapshot } from './types';

// Persistence
const STORAGE_KEY = 'lwjgl-build-config';

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

// Create Store
export const useStore = create(redux(reducer, getInitialState()));

export function useDispatch() {
  return useStore((state) => state.dispatch);
}

// Subscribe to state changes

useStore.subscribe((state) => {
  saveSnapshotDebounced(state);
});
