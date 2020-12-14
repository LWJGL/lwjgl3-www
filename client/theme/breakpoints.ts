import { proxy } from 'valtio';

export const boundaries: Array<number> = [0, 576, 768, 992, 1200, 1400];

export enum Breakpoint {
  xs,
  sm,
  md,
  lg,
  xl,
  xxl,
}

export const breakpoint = proxy({
  current: Breakpoint.lg,
});

function mediaQueryListener(current: number, event: MediaQueryListEvent) {
  if (event.matches) {
    breakpoint.current = current;
  }
}

{
  const matchers: Array<MediaQueryList> = [];

  // Create matchMedia event listeners for each breakpoint
  // Check for matches and return current value
  boundaries.forEach((limit, i) => {
    let mediaQuery;
    if (i === 0) {
      mediaQuery = `(max-width:${boundaries[1] - 1}px)`;
    } else if (i === boundaries.length - 1) {
      mediaQuery = `(min-width:${limit}px)`;
    } else {
      mediaQuery = `(min-width:${limit}px) and (max-width:${boundaries[i + 1] - 0.02}px)`;
    }

    const mqr = window.matchMedia(mediaQuery);
    matchers.push(mqr);

    if (mqr.matches) {
      breakpoint.current = i;
    }
  });

  //@ts-expect-error
  if (matchers[0].addEventListener) {
    matchers.forEach((matcher, i) => matcher.addEventListener('change', mediaQueryListener.bind(null, i)));
  } else {
    matchers.forEach((matcher, i) => matcher.addListener(mediaQueryListener.bind(null, i)));
  }
}
