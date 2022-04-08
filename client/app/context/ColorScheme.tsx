import { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Scheme = 'light' | 'dark';
type Toggle = (scheme: Scheme) => void;

const SCHEME_STORAGE_KEY = 'color-theme';
let schemeDefault: Scheme = 'light';
let isStored = false;

const schemeStored = window.localStorage.getItem(SCHEME_STORAGE_KEY);
if (schemeStored === 'dark' || schemeStored === 'light') {
  isStored = true;
  schemeDefault = schemeStored;
}

const prefersColorSchemeDark = window.matchMedia('(prefers-color-scheme: dark)');

if (prefersColorSchemeDark.matches && !isStored) {
  schemeDefault = 'dark';
}

export const ColorSchemeContext = createContext<Scheme>(schemeDefault);
if (!FLAG_PRODUCTION) {
  ColorSchemeContext.displayName = 'ColorSchemeContext';
}

export const ColorSchemeToggleContext = createContext<Toggle>(() => {});
if (!FLAG_PRODUCTION) {
  ColorSchemeToggleContext.displayName = 'ColorSchemeToggleContext';
}

export const ColorSchemeProvider: FCC = ({ children }) => {
  const [current, setCurrent] = useState<Scheme>(schemeDefault);

  const toggle = useCallback((scheme: Scheme) => {
    setCurrent(scheme);

    try {
      window.localStorage.setItem(SCHEME_STORAGE_KEY, scheme);
      // This is an unsafe set, but since localStorage is external anyway,
      // there is no point trying to make this safe.
      isStored = true;
    } catch {}
  }, []);

  useEffect(() => {
    if (!isStored) {
      // Listen for prefers-color-scheme changes
      const callback = (e: MediaQueryListEvent) => {
        if (!isStored) {
          setCurrent(e.matches ? 'dark' : 'light');
        }
      };

      if ('addEventListener' in prefersColorSchemeDark) {
        prefersColorSchemeDark.addEventListener('change', callback);
      } else {
        prefersColorSchemeDark.addListener(callback);
      }

      return () => {
        if ('removeEventListener' in prefersColorSchemeDark) {
          prefersColorSchemeDark.removeEventListener('change', callback);
        } else {
          prefersColorSchemeDark.removeListener(callback);
        }
      };
    }
  }, []);

  useEffect(() => {
    let prevScheme = current === 'dark' ? 'light' : 'dark';

    const cl = document.body.classList;
    cl.remove(prevScheme);
    cl.add(current);

    document.documentElement.style.setProperty('color-scheme', current);
  }, [current]);

  return (
    <ColorSchemeToggleContext.Provider value={toggle}>
      <ColorSchemeContext.Provider value={current}>{children}</ColorSchemeContext.Provider>
    </ColorSchemeToggleContext.Provider>
  );
};

export function useColorScheme() {
  return useContext(ColorSchemeContext);
}

export function useColorSchemeToggle() {
  return useContext(ColorSchemeToggleContext);
}
