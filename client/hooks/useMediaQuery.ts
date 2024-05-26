import { useSyncExternalStore, useMemo } from 'react';

export function useMediaQuery(query: string, serverFallback: boolean = false): boolean {
  const [getSnapshot, subscribe, getServerSnapshot] = useMemo(() => {
    const mediaQueryList = matchMedia(query);

    return [
      () => mediaQueryList.matches,
      (notify: () => void) => {
        mediaQueryList.addEventListener('change', notify);
        return () => {
          mediaQueryList.removeEventListener('change', notify);
        };
      },
      () => serverFallback,
    ];
  }, [query, serverFallback]);

  return useSyncExternalStore<boolean>(subscribe, getSnapshot, getServerSnapshot);
}
