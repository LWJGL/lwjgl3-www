// @flow
import * as React from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { PageError } from '../components/PageError';
import type { RouterLocation } from '@reach/router';

// Store scroll position when leaving a route, restore if we return back to it

type ScrollPosition = {
  x: number,
  y: number,
};

// The maximum number of pages in the browser's session history, i.e. the maximum number of URLs you can traverse purely through the Back/Forward buttons.
// Default value is 50 to match Firefox's default value (about:config -> browser.sessionhistory.max_entries)
const MAX_SCROLL_ENTRIES = 50;
const scrollEntries: Map<string, ScrollPosition> = new Map();

type Props = {
  location: RouterLocation,
  children?: React.Node,
};

export class PageView extends React.Component<Props> {
  componentDidMount() {
    const {
      location: { key = 'root', pathname, search },
    } = this.props;

    // Track in Google Analytics
    window.ga('send', 'pageview', `${pathname}${search}`);

    // If we have previously stored the same key, restore scroll position
    const entry = scrollEntries.get(key);
    if (entry !== undefined) {
      // Restore scroll position
      window.scroll(entry.x, entry.y);
    } else if (this.props.location.hash.length === 0) {
      // Scroll to top of viewport
      window.scroll(0, 0);
    }
  }

  componentWillUnmount() {
    // Remember scroll position so we can restore if we return to this view via browser history
    // * [window.scrollX, window.scrollY];  // <-- Only supported in CSSOM browsers
    // * [window.pageXOffset, window.pageYOffset]; // IE9+ pageXOffset is alias of scrollX
    const {
      location: { key = 'root' },
    } = this.props;

    // Add entry
    scrollEntries.set(key, { x: window.pageXOffset, y: window.pageYOffset });

    // Drop oldest entry if we exceeded maximum number of entries
    if (scrollEntries.size > MAX_SCROLL_ENTRIES) {
      // * The keys() method returns a new Iterator object that contains the keys for each element in the Map object in **insertion** order.
      // * Therefore, the first value returned by the Iterator will be the oldest scroll entry that we need to drop.
      //$FlowFixMe
      scrollEntries.delete(scrollEntries.keys().next().value);
    }

    // console.table(Array.from(scrollEntries.keys()));
  }

  render() {
    if (!FLAG_PRODUCTION) {
      // return <React.StrictMode>{this.props.children}</React.StrictMode>;
      return this.props.children;
    } else {
      return <ErrorBoundary render={PageError}>{this.props.children}</ErrorBoundary>;
    }
  }
}
