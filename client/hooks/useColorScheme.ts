import { useSyncExternalStore } from 'react';
import { createStore } from '~/services/createStore';

type Scheme = 'light' | 'dark';

const SCHEME_STORAGE_KEY = 'color-theme';
let schemeDefault: Scheme = 'light';
let isStored = false;

// If we already have a stored scheme, use it and set it as the default
// TODO: This should be a (client-readable) cookie so we can use it for SSR
if ('localStorage' in globalThis) {
  const schemeStored = globalThis.localStorage.getItem(SCHEME_STORAGE_KEY);
  if (schemeStored === 'dark' || schemeStored === 'light') {
    isStored = true;
    schemeDefault = schemeStored;
  }
}

// Set up a MediaQueryList so we can subscribe to changes (if not already stored)
let prefersColorSchemeDark: MediaQueryList | undefined;
if (!isStored && 'matchMedia' in globalThis) {
  prefersColorSchemeDark = globalThis.matchMedia('(prefers-color-scheme: dark)');

  // Switch default to dark if user prefers dark mode
  if (prefersColorSchemeDark.matches) {
    schemeDefault = 'dark';
  }
}

// Create store with default scheme value
const store = createStore<Scheme>(schemeDefault);

// Apply scheme to DOM
applySchemeToDOM(schemeDefault);

function applySchemeToDOM(current: Scheme) {
  document.body.classList.add(current);
  document.documentElement.style.setProperty('color-scheme', current);
}

function applyScheme(current: Scheme) {
  store.setState((prev) => {
    document.body.classList.remove(prev);
    applySchemeToDOM(current);
    return current;
  });
}

// Listener for prefers-color-scheme changes
function colorSchemeListener(e: MediaQueryListEvent) {
  applyScheme(e.matches ? 'dark' : 'light');
}

// Manually set preferred color scheme
function setScheme(scheme: Scheme): void {
  applyScheme(scheme);

  if (prefersColorSchemeDark !== undefined) {
    // no longer needed, remove event listeners
    if ('removeEventListener' in prefersColorSchemeDark) {
      prefersColorSchemeDark.removeEventListener('change', colorSchemeListener);
    } else {
      //@ts-expect-error
      prefersColorSchemeDark.removeListener(colorSchemeListener);
    }
  }

  try {
    window.localStorage.setItem(SCHEME_STORAGE_KEY, scheme);
  } catch {}
}

// If we have created a MediaQueryList subscribe to changes
if (!isStored && prefersColorSchemeDark !== undefined) {
  if ('addEventListener' in prefersColorSchemeDark) {
    prefersColorSchemeDark.addEventListener('change', colorSchemeListener);
  } else {
    //@ts-expect-error
    prefersColorSchemeDark.addListener(colorSchemeListener);
  }
}

export function useColorScheme(): [Scheme, typeof setScheme] {
  const scheme = useSyncExternalStore(store.subscribe, store.getState, () => schemeDefault);
  return [scheme, setScheme];
}
