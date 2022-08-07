import { useSyncExternalStore } from 'react';
import { createStore } from '~/services/createStore';

type Scheme = 'light' | 'dark';

const SCHEME_STORAGE_KEY = 'color-theme';
let schemeCurrent: Scheme = 'light';
let isStored = false;
let prefersColorSchemeDark: MediaQueryList | undefined;

// If we already have a stored scheme, use it and set it as the default
// TODO: This should be a (client-readable) cookie so we can use it for SSR
if ('localStorage' in globalThis) {
  const schemeStored = globalThis.localStorage.getItem(SCHEME_STORAGE_KEY);
  if (schemeStored === 'dark' || schemeStored === 'light') {
    isStored = true;
    schemeCurrent = schemeStored;
  }
}

if (!isStored && 'matchMedia' in globalThis) {
  prefersColorSchemeDark = globalThis.matchMedia('(prefers-color-scheme: dark)');

  // Switch default to dark if user prefers dark mode
  if (prefersColorSchemeDark.matches) {
    schemeCurrent = 'dark';
  }
}

function applySchemeToDOM(current: Scheme) {
  document.body.classList.add(current);
  document.documentElement.style.setProperty('color-scheme', current);
}

// Apply scheme to DOM immediately
if ('document' in globalThis) {
  applySchemeToDOM(schemeCurrent);
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

function cleanup() {
  if ('removeEventListener' in prefersColorSchemeDark!) {
    prefersColorSchemeDark.removeEventListener('change', colorSchemeListener);
  } else {
    //@ts-expect-error
    prefersColorSchemeDark.removeListener(colorSchemeListener);
  }
}

// Manually set preferred color scheme
function setScheme(scheme: Scheme): void {
  applyScheme(scheme);

  if (prefersColorSchemeDark !== undefined) {
    // no longer needed, remove event listeners and delete matchMedia
    cleanup();
    prefersColorSchemeDark = undefined;
  }

  try {
    localStorage.setItem(SCHEME_STORAGE_KEY, scheme);
  } catch {}
}

// Create store with default scheme value
const store = createStore<Scheme>(schemeCurrent, () => {
  // If we have created a MediaQueryList subscribe to changes
  if (!isStored && prefersColorSchemeDark !== undefined) {
    if ('addEventListener' in prefersColorSchemeDark) {
      prefersColorSchemeDark.addEventListener('change', colorSchemeListener);
    } else {
      //@ts-expect-error
      prefersColorSchemeDark.addListener(colorSchemeListener);
    }

    return cleanup;
  }
});

export function useColorScheme(): [Scheme, typeof setScheme] {
  const scheme = useSyncExternalStore(store.subscribe, store.getState, store.getState);
  return [scheme, setScheme];
}
