import { useSyncExternalStore } from 'react';

function subscribe(callback: EventListener) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function getStateClient() {
  return navigator.onLine;
}

function getStateServer() {
  return true;
}

export function useOnlineStatus() {
  return useSyncExternalStore<boolean>(subscribe, getStateClient, getStateServer);
}
