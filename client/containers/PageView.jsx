// @flow
import * as React from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { PageError } from '../components/PageError';
import type { RouterLocation } from '@reach/router';
import { trackView } from '../services/ga';

// Store scroll position when leaving a route, restore if we return back to it
const SCROLL_RESTORATION = 'scrollRestoration' in window.history;
if (SCROLL_RESTORATION) {
  window.history.scrollRestoration = 'manual';
}

type ScrollPosition = {
  x: number,
  y: number,
};

// The maximum number of pages in the browser's session history, i.e. the maximum number of URLs you can traverse purely through the Back/Forward buttons.
// Default value is 50 to match Firefox's default value (about:config -> browser.sessionhistory.max_entries)
const MAX_SCROLL_ENTRIES = 50;
const SCROLL_ENTRIES_SESSION_KEY = 'scrollEntries';
let scrollEntries: Map<string, ScrollPosition> = new Map();

if (SCROLL_RESTORATION) {
  const scrollEntriesSession = sessionStorage.getItem(SCROLL_ENTRIES_SESSION_KEY);
  if (scrollEntriesSession != null) {
    scrollEntries = new Map(JSON.parse(scrollEntriesSession));
  }
}

type Props = {
  location: RouterLocation,
  children?: React.Node,
};

export class PageView extends React.Component<Props> {
  storeScroll() {
    const {
      location: { key = 'root' },
    } = this.props;

    // Add entry
    // scrollEntries.set(key, { x: window.scrollX, y: window.scrollY });
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

  storeScrollEntriesInSession = this.storeScrollEntriesInSession.bind(this);
  storeScrollEntriesInSession() {
    this.storeScroll();
    sessionStorage.setItem(SCROLL_ENTRIES_SESSION_KEY, JSON.stringify(Array.from(scrollEntries)));
  }

  componentDidMount() {
    const {
      location: { key = 'root', pathname, search },
    } = this.props;

    // Track in Google Analytics
    trackView({
      page_path: `${pathname}${search}`,
    });

    if (SCROLL_RESTORATION) {
      // If we have previously stored the same key, restore scroll position
      const entry = scrollEntries.get(key);
      if (entry !== undefined) {
        // Restore scroll position
        window.scroll(entry.x, entry.y);
      } else if (this.props.location.hash.length === 0) {
        // Scroll to top of viewport
        window.scroll(0, 0);
      }

      window.addEventListener('unload', this.storeScrollEntriesInSession);
    }
  }

  componentWillUnmount() {
    if (SCROLL_RESTORATION) {
      this.storeScroll();
      window.removeEventListener('unload', this.storeScrollEntriesInSession);
    }
  }

  render() {
    const { children } = this.props;
    if (!FLAG_PRODUCTION) {
      // return <React.StrictMode>{children}</React.StrictMode>;
      return children !== undefined ? children : null;
    } else {
      return <ErrorBoundary render={PageError}>{children}</ErrorBoundary>;
    }
  }
}
