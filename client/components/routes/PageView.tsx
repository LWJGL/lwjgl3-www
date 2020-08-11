import { memo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ErrorBoundary } from '../ErrorBoundary';
import { PageError } from './PageError';
// import { trackView } from '~/services/ga';
import { useDocumentTitle } from '~/hooks/useDocumentTitle';
import { useMetaDescription } from '~/hooks/useMetaDescription';

// Store scroll position when leaving a route, restore if we return back to it
interface ScrollPosition {
  x: number;
  y: number;
}

interface Props {
  title?: string;
  description?: string;
}

interface PropsMemo {
  location: any;
  title?: string;
  description?: string;
}

// The maximum number of pages in the browser's session history, i.e. the maximum number of URLs you can traverse purely through the Back/Forward buttons.
// Default value is 50 to match Firefox's default value (about:config -> browser.sessionhistory.max_entries)
const MAX_SCROLL_ENTRIES = 50;
const SCROLL_ENTRIES_SESSION_KEY = 'scrollEntries';
const SCROLL_RESTORATION = 'scrollRestoration' in window.history;
let scrollEntries: Map<string, ScrollPosition> = new Map();

if (SCROLL_RESTORATION) {
  window.history.scrollRestoration = 'manual';

  const scrollEntriesSession = sessionStorage.getItem(SCROLL_ENTRIES_SESSION_KEY);
  if (scrollEntriesSession != null) {
    scrollEntries = new Map(JSON.parse(scrollEntriesSession));
  }
}

function storeScroll(key: string) {
  // Add entry
  // scrollEntries.set(key, { x: window.scrollX, y: window.scrollY });
  scrollEntries.set(key, { x: window.pageXOffset, y: window.pageYOffset });

  // Drop oldest entry if we exceeded maximum number of entries
  if (scrollEntries.size > MAX_SCROLL_ENTRIES) {
    // * The keys() method returns a new Iterator object that contains the keys for each element in the Map object in **insertion** order.
    // * Therefore, the first value returned by the Iterator will be the oldest scroll entry that we need to drop.
    scrollEntries.delete(scrollEntries.keys().next().value);
  }

  // console.table(Array.from(scrollEntries.keys()));
}

function arePropsEqual({ location: prevLocation }: PropsMemo, { location: nextLocation }: PropsMemo) {
  // EXPERIMENTAL: We want to prevent re-render when only hash changes
  // This unfortunately also changes the key which may result in bugs
  return prevLocation.pathname === nextLocation.pathname && prevLocation.search === nextLocation.search;
}

function scrollToTop() {
  if (window.pageXOffset + window.pageYOffset > 0) {
    window.scroll(0, 0);
  }
}

export const PageView: React.FC<Props> = (props) => {
  const location = useLocation();
  return <PageViewMemo location={location} {...props} />;
};

const PageViewMemo: React.FC<PropsMemo> = memo(function PageViewMemo({ location, title, description, children }) {
  const { /*pathname, search,*/ hash, key = 'root' } = location;

  // Update document title
  useDocumentTitle(title);

  // Update META description
  useMetaDescription(description);

  useEffect(() => {
    if (SCROLL_RESTORATION) {
      const storeScrollEntriesInSession = () => {
        storeScroll(key);
        sessionStorage.setItem(SCROLL_ENTRIES_SESSION_KEY, JSON.stringify(Array.from(scrollEntries)));
      };

      // If we have previously stored the same key, restore scroll position
      const entry = scrollEntries.get(key);
      if (entry !== undefined) {
        // Restore scroll position
        window.scroll(entry.x, entry.y);
      } else if (hash.length === 0) {
        scrollToTop();
      }

      window.addEventListener('unload', storeScrollEntriesInSession);
      return () => {
        storeScroll(key);
        window.removeEventListener('unload', storeScrollEntriesInSession);
      };
    } else if (hash.length === 0) {
      scrollToTop();
    }
  }, [key, hash]);

  // // Track in Google Analytics
  // useEffect(() => {
  //   trackView({ page_path: `${pathname}${search}` });
  // }, [pathname, search]);

  if (FLAG_PRODUCTION) {
    return <ErrorBoundary fallback={PageError}>{children}</ErrorBoundary>;
  } else {
    return <>{children}</>;
  }
}, arePropsEqual);
