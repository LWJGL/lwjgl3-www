import { useSyncExternalStore, useMemo } from 'react';

export function useMediaQuery(query: string, serverFallback: boolean = false): boolean {
  const [getSnapshot, subscribe, getServerSnapshot] = useMemo(() => {
    const mediaQueryList = window.matchMedia(query);

    return [
      () => mediaQueryList.matches,
      (notify: () => void) => {
        if ('addEventListener' in mediaQueryList) {
          mediaQueryList.addEventListener('change', notify);
        } else {
          mediaQueryList.addListener(notify);
        }
        return () => {
          if ('removeEventListener' in mediaQueryList) {
            mediaQueryList.removeEventListener('change', notify);
          } else {
            mediaQueryList.removeListener(notify);
          }
        };
      },
      () => serverFallback,
    ];
  }, [query, serverFallback]);

  return useSyncExternalStore<boolean>(subscribe, getSnapshot, getServerSnapshot);
}
