// @flow
import * as React from 'react';
import { breakpoints, breakpointIndex } from '../theme/media';

//$FlowFixMe
const BreakpointContext = React.createContext(null);

export const Breakpoint = BreakpointContext.Consumer;

type Props = {
  children: React.Node,
};

type State = {
  current: number,
};

export class BreakpointProvider extends React.Component<Props, State> {
  state = {
    current: this.getCurrent(),
    breakpoints: breakpointIndex,
  };

  matchers = [];
  listeners = [];

  getCurrent() {
    const w = window.innerWidth;

    // let i = breakpoints.length - 1;
    let i = 4;
    while (i > 0) {
      if (w >= breakpoints[i]) {
        break;
      }
      i -= 1;
    }

    return i;
  }

  mediaQueryListener(current: number, event: MediaQueryListEvent) {
    if (event.matches) {
      this.setState({ current });
    }
  }

  componentDidMount() {
    if (window.matchMedia) {
      // const last = breakpoints.length - 1;
      const last = 4;

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
        const listener = this.mediaQueryListener.bind(this, i);
        mqr.addListener(listener);
        this.matchers.push(mqr);
        this.listeners.push(listener);
      });
    }
  }

  componentWillUnmount() {
    this.matchers.forEach((matcher, i) => {
      matcher.removeListener(this.listeners[i]);
    });
  }

  render() {
    return (
      <BreakpointContext.Provider value={this.state}>
        {React.Children.only(this.props.children)}
      </BreakpointContext.Provider>
    );
  }
}
