import { useSyncExternalStore, useRef, useMemo } from 'react';
import { SUPPORTS_INTERSECTION_OBSERVER } from '~/services/supports';

export function useIntersectionObserver(
  ref: React.RefObject<HTMLElement>,
  serverFallback: boolean = false,
  options: IntersectionObserverInit = { rootMargin: '0px' }
) {
  const intersectingRef = useRef<boolean>(serverFallback);
  const [subscribe, getSnapshot, getServerSnapshot] = useMemo(() => {
    return [
      (notify: () => void) => {
        let observer: IntersectionObserver;
        if (SUPPORTS_INTERSECTION_OBSERVER && ref.current) {
          observer = new IntersectionObserver(([entry]) => {
            intersectingRef.current = entry.isIntersecting;
            notify();
          }, options);
          observer.observe(ref.current);
        }
        return () => {
          if (observer && ref.current) {
            observer.unobserve(ref.current);
          }
        };
      },
      () => intersectingRef.current,
      () => serverFallback,
    ];
  }, [ref, options, serverFallback]);

  return useSyncExternalStore<boolean>(subscribe, getSnapshot, getServerSnapshot);
}
