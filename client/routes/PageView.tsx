import { memo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDocumentTitle } from '~/hooks/useDocumentTitle';
import { useMetaDescription } from '~/hooks/useMetaDescription';
import { usePrevious } from '~/hooks/usePrevious';
import { scrollSmooth } from '~/services/scrollSmooth';
// import { trackView } from '~/services/ga';

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
const TERMINATION_EVENT = 'onpagehide' in self ? 'pagehide' : 'unload';
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

function scrollToTop() {
  if (window.pageXOffset + window.pageYOffset > 0) {
    scroll(0, 0);
  }
}

function arePropsEqual({ location: prevLocation }: PropsMemo, { location: nextLocation }: PropsMemo) {
  if (!FLAG_PRODUCTION) {
    // Force re-render when locations match (so react-refresh continues to work for route modules)
    // (alternatively, route modules should have all their content in different modules/files)
    // This should never happen in production, therefore we do this only in DEV mode
    if (prevLocation === nextLocation) {
      return false;
    }
  }

  // We want to prevent re-renders when document hash changes
  // Setting a #hash unfortunately also changes the `location.key` which can result in bugs
  // so we ignore updates when pathname and search remain the same
  return prevLocation.pathname === nextLocation.pathname && prevLocation.search === nextLocation.search;
}

//@ts-ignore
const PageViewWithLocation: React.FC<PropsMemo> = ({ location, title, description, children }) => {
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
        scroll(entry.x, entry.y);
      } else if (hash.length === 0) {
        scrollToTop();
      }

      window.addEventListener(TERMINATION_EVENT, storeScrollEntriesInSession);
      return () => {
        storeScroll(key);
        window.removeEventListener(TERMINATION_EVENT, storeScrollEntriesInSession);
      };
    } else if (hash.length === 0) {
      scrollToTop();
    }
  }, [key, hash]);

  // // Track in Google Analytics
  // useEffect(() => {
  //   trackView({ page_path: `${pathname}${search}` });
  // }, [pathname, search]);

  return children !== undefined ? children : null;
};

const PageViewMemo = memo(PageViewWithLocation, arePropsEqual);

let defaultScrollPos = [0, 0]; // Remember position before we clicked on a HashLink
let scrolling = false; // Avoid calling reset position more than once when multiple <HashLinkTarget /> are on page
function scrollEnd() {
  scrolling = false;
}
function scrollToTarget(el: HTMLElement) {
  var rect = el.getBoundingClientRect();
  scrollSmooth(0, rect.top + window.pageYOffset);
  window.setTimeout(scrollEnd, 0);
}

export const PageView: React.FC<Props> = (props) => {
  const location = useLocation();

  // Hash scrolling
  const { hash } = location;
  const prevHash = usePrevious(hash);
  useEffect(() => {
    const targetEl = document.getElementById(hash.slice(1));

    if (prevHash === null) {
      if (targetEl) {
        // Only runs on mount
        scrollToTarget(targetEl);
      }
    } else if (prevHash !== hash) {
      // Runs on re-render
      if (hash.length && targetEl !== null) {
        if (prevHash === '') {
          defaultScrollPos = [window.pageXOffset, window.pageYOffset];
        }
        scrolling = true;
        scrollToTarget(targetEl);
      } else if (!scrolling) {
        scrolling = true;
        scrollSmooth(defaultScrollPos[0], defaultScrollPos[1]);
        setTimeout(scrollEnd, 0);
      }
    }
  }, [hash, prevHash]);

  // Actual PageView
  return <PageViewMemo location={location} {...props} />;
};
