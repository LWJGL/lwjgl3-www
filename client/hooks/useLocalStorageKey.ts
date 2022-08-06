import { useSyncExternalStore, useMemo, useCallback } from 'react';

/*
  Monitors localStorage key for changes and updates local state

  * Note: Value is not deserialized

  ! Note: This won't work on the same page that is making the changes — it is
  really a way for other pages on the domain using the storage to sync any
  changes that are made. Pages on other domains can't access the same storage
  objects.
*/
export function useLocalStorageKey(key: string, serverFallback: string | null = null) {
  const [getSnapshot, subscribe, getServerSnapshot] = useMemo(() => {
    return [
      () => window.localStorage.getItem(key),
      (notify: () => void) => {
        function check(ev: StorageEvent) {
          if (ev.key === key) {
            notify();
          }
        }

        window.addEventListener('storage', check);
        return () => {
          window.removeEventListener('storage', check);
        };
      },
      () => serverFallback,
    ];
  }, [key, serverFallback]);

  return useSyncExternalStore<string | null>(subscribe, getSnapshot, getServerSnapshot);
}
