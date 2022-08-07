import { useSyncExternalStore } from 'react';
import { createStore } from '~/services/createStore';

export function getOnlineStatus(): boolean {
  return navigator.onLine ?? true;
}

const store = createStore<boolean>(getOnlineStatus(), (setState) => {
  function callback() {
    setState((prev) => getOnlineStatus());
  }

  addEventListener('online', callback);
  addEventListener('offline', callback);

  return () => {
    removeEventListener('online', callback);
    removeEventListener('offline', callback);
  };
});

function getServerSnapshot() {
  return true;
}

export function useOnlineStatus() {
  return useSyncExternalStore<boolean>(store.subscribe, store.getState, getServerSnapshot);
}
