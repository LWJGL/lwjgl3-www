import React from 'react';
import type { ContextRouter } from 'react-router-dom';

type ScrollPositions = {
  [key: string]: Array<number>,
};

type Props = ContextRouter & {
  children?: React$Element<*>,
};

class PageView extends React.Component<void, Props, void> {
  // Remembers last scroll positions
  // TODO: We shouldn't allow infinite keys here, implement a *shared* LRU cache
  static scrollPositions: ScrollPositions = {};

  componentDidMount() {
    const { history: { action }, location: { key = 'root', pathname, search } } = this.props;
    let scrollToTop: boolean = this.props.location.hash.length === 0;

    // Track in Google Analytics
    window.ga('send', 'pageview', `${pathname}${search}`);

    // POP means user is going forward or backward in history, restore previous scroll position
    if (action === 'POP') {
      const pos = PageView.scrollPositions[key];
      if (pos) {
        window.scroll(pos[0], pos[1]);
        scrollToTop = false;
      }
    }

    if (scrollToTop) {
      // Scroll to top of viewport
      window.scroll(0, 0);
    }
  }

  componentWillUnmount() {
    // Remember scroll position so we can restore if we return to this view via browser history
    const { location: { key = 'root' } } = this.props;
    // RouteModule.scrollPositions[key] = [window.scrollX, window.scrollY];  // <-- Only supported in CSSOM browsers
    PageView.scrollPositions[key] = [window.pageXOffset, window.pageYOffset]; // IE9+ pageXOffset is alias of scrollX
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}

export default PageView;
