// @flow
import * as React from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { PageError } from '../components/PageError';

import type { RouterLocation } from '@reach/router';

type ScrollPositions = {
  [key: string]: Array<number>,
};

type Props = {
  location: RouterLocation,
  children?: React.Node,
};

export class PageView extends React.Component<Props> {
  // Remembers last scroll positions
  // TODO: We shouldn't allow infinite keys here, implement a *shared* LRU cache
  static scrollPositions: ScrollPositions = {};

  componentDidMount() {
    const {
      location: { key = 'root', pathname, search },
    } = this.props;
    let scrollToTop: boolean = this.props.location.hash.length === 0;

    // Track in Google Analytics
    window.ga('send', 'pageview', `${pathname}${search}`);

    // If we have previously stored the same key, restore scroll position
    const pos = PageView.scrollPositions[key];
    if (pos !== undefined) {
      window.scroll(pos[0], pos[1]);
      scrollToTop = false;
    }

    if (scrollToTop) {
      // Scroll to top of viewport
      window.scroll(0, 0);
    }
  }

  componentWillUnmount() {
    // Remember scroll position so we can restore if we return to this view via browser history
    const {
      location: { key = 'root' },
    } = this.props;
    // RouteModule.scrollPositions[key] = [window.scrollX, window.scrollY];  // <-- Only supported in CSSOM browsers
    PageView.scrollPositions[key] = [window.pageXOffset, window.pageYOffset]; // IE9+ pageXOffset is alias of scrollX
  }

  render() {
    // TODO: Use error boundary but find a way to re-render on hot reload
    // TODO: Custom rendering of errors
    // TODO: Steal ideas from create-react-app's react-error-overlay (e.g. open file in editor)
    if (!FLAG_PRODUCTION) {
      //$FlowFixMe
      return <React.StrictMode>{this.props.children}</React.StrictMode>;
      // return this.props.children;
    } else {
      return <ErrorBoundary render={PageError}>{this.props.children}</ErrorBoundary>;
    }
  }
}
