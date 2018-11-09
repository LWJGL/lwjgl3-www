import { useState, useEffect } from 'react';

// Monitors localStorage key for changes and updates local state
// NOTE: Value is not deserialized
export function useLocalStorageKey(key: string) {
  const [localState, updateLocalState] = useState(() => window.localStorage.getItem(key));

  useEffect(() => {
    const syncLocalStorage = (event: StorageEvent) => {
      if (event.key === key) {
        updateLocalState(event.newValue);
      }
    };

    window.addEventListener('storage', syncLocalStorage);
    return () => {
      window.removeEventListener('storage', syncLocalStorage);
    };
  }, []);

  return localState;
}
