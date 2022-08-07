import { useSyncExternalStore } from 'react';
import { createStore } from '~/services/createStore';

export enum Breakpoint {
  xs,
  sm,
  md,
  lg,
  xl,
  xxl,
}

export const boundaries: Array<number> = [0, 576, 768, 992, 1200, 1400];
const mediaQueryMap = new Map<string, Breakpoint>();
const matchers: Array<MediaQueryList> = [];
let defaultBreakpoint: Breakpoint = Breakpoint.lg;

if ('matchMedia' in globalThis) {
  // Create matchMedia event listeners for each breakpoint
  // Check for matches and return current value
  boundaries.forEach((limit, i) => {
    let mediaQuery;
    // ! whitespace matters, browsers normalize the query and it needs to be exactly the same when matched
    if (i === 0) {
      mediaQuery = `(max-width: ${boundaries[1] - 1}px)`;
    } else if (i === boundaries.length - 1) {
      mediaQuery = `(min-width: ${limit}px)`;
    } else {
      mediaQuery = `(min-width: ${limit}px) and (max-width: ${boundaries[i + 1] - 0.02}px)`;
    }

    mediaQueryMap.set(mediaQuery, i as Breakpoint);

    const mqr = matchMedia(mediaQuery);
    matchers.push(mqr);

    if (mqr.matches) {
      defaultBreakpoint = i;
    }
  });
}

const store = createStore<Breakpoint>(defaultBreakpoint, (setState) => {
  function mediaQueryListener(event: MediaQueryListEvent) {
    if (event.matches) {
      setState((prev) => mediaQueryMap.get(event.media)!);
    }
  }

  if ('addEventListener' in matchers[0]) {
    matchers.forEach((matcher, i) => matcher.addEventListener('change', mediaQueryListener));
  } else {
    matchers.forEach((matcher, i) => matcher.addListener(mediaQueryListener));
  }

  return () => {
    if ('removeEventListener' in matchers[0]) {
      matchers.forEach((matcher, i) => matcher.removeEventListener('change', mediaQueryListener));
    } else {
      matchers.forEach((matcher, i) => matcher.removeListener(mediaQueryListener));
    }
  };
});

export function useBreakpoint(): Breakpoint {
  return useSyncExternalStore<Breakpoint>(store.subscribe, store.getState, store.getState);
}
