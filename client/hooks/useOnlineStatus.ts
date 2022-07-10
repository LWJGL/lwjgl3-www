import { useSyncExternalStore } from 'react';
import { createStore } from '~/services/createStore';

export function getOnlineStatus(): boolean {
  return navigator.onLine ?? true;
}

const store = createStore<boolean>(getOnlineStatus(), (setState) => {
  function callback() {
    setState((prev) => getOnlineStatus());
  }

  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);

  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
});

function getServerSnapshot() {
  return true;
}

export function useOnlineStatus() {
  return useSyncExternalStore<boolean>(store.subscribe, store.getState, getServerSnapshot);
}
