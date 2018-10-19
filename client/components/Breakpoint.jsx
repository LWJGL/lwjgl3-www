// @flow
import * as React from 'react';
import { breakpoints, breakpointIndex } from '../theme/media';

export const BreakpointContext = React.createContext({
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

export class BreakpointProvider extends React.Component<Props, State> {
  // Holds matchMedia matchers
  matchers: Array<MediaQueryList> = [];

  // Holds matchMedia matcher eventListeners
  listeners: Array<MediaQueryListListener> = [];

  state = {
    current: (() => {
      const last = breakpoints.length - 1;
      let current = breakpointIndex.lg;

      // Create matchMedia event listeners for each breakpoint
      // Check for matches and return current value
      breakpoints.forEach((limit, i) => {
        let mediaQuery;
        if (i === 0) {
          mediaQuery = `(max-width:${breakpoints[1] - 1}px)`;
        } else if (i === last) {
          mediaQuery = `(min-width:${limit}px)`;
        } else {
          mediaQuery = `(min-width:${limit}px) and (max-width:${breakpoints[i + 1] - 1}px)`;
        }

        const mqr = window.matchMedia(mediaQuery);
        if (mqr.matches) {
          current = i;
        }
        this.matchers.push(mqr);
      });

      return current;
    })(),
    breakpoints: breakpointIndex,
  };

  mediaQueryListener(current: number, event: MediaQueryListEvent) {
    if (event.matches) {
      this.setState({ current });
    }
  }

  componentDidMount() {
    this.matchers.forEach((matcher, i) => {
      const listener = this.mediaQueryListener.bind(this, i);
      matcher.addListener(listener);
      this.listeners.push(listener);
    });
  }

  componentWillUnmount() {
    this.matchers.forEach((matcher, i) => {
      matcher.removeListener(this.listeners[i]);
    });
    this.matchers = [];
    this.listeners = [];
  }

  render() {
    return (
      <BreakpointContext.Provider value={this.state}>
        {React.Children.only(this.props.children)}
      </BreakpointContext.Provider>
    );
  }
}
