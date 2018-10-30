// @flow
import * as React from 'react';
//$FlowFixMe
import { useEffect, useState } from 'react';
import { breakpoints, breakpointIndex } from '../theme/media';

type Context = {
  current: number,
  breakpoints: typeof breakpointIndex,
};

export const BreakpointContext = React.createContext<Context>({
  current: breakpointIndex.lg,
  breakpoints: breakpointIndex,
});

export const Breakpoint = BreakpointContext.Consumer;

type Props = {
  children: React.Node,
};

type State = {
  current: number,
  breakpoints: typeof breakpointIndex,
};

const matchers: Array<MediaQueryList> = [];
const listeners: Array<MediaQueryListListener> = [];
let initialCurrent = breakpointIndex.lg;

// Create matchMedia event listeners for each breakpoint
// Check for matches and return current value
breakpoints.forEach((limit, i) => {
  let mediaQuery;
  if (i === 0) {
    mediaQuery = `(max-width:${breakpoints[1] - 1}px)`;
  } else if (i === breakpoints.length - 1) {
    mediaQuery = `(min-width:${limit}px)`;
  } else {
    mediaQuery = `(min-width:${limit}px) and (max-width:${breakpoints[i + 1] - 1}px)`;
  }

  const mqr = window.matchMedia(mediaQuery);
  matchers.push(mqr);

  if (mqr.matches) {
    initialCurrent = i;
  }
});

export function BreakpointProvider({ children }: Props) {
  const [current, setCurrent] = useState(initialCurrent);

  useEffect(() => {
    function mediaQueryListener(current: number, event: MediaQueryListEvent) {
      if (event.matches) {
        setCurrent(current);
      }
    }

    matchers.forEach((matcher, i) => {
      const listener = mediaQueryListener.bind(null, i);
      matcher.addListener(listener);
      listeners.push(listener);
    });

    return () => {
      matchers.forEach((matcher, i) => {
        matcher.removeListener(listeners[i]);
      });
    };
  }, []);

  return (
    <BreakpointContext.Provider
      value={{
        current,
        breakpoints: breakpointIndex,
      }}
    >
      {React.Children.only(children)}
    </BreakpointContext.Provider>
  );
}
