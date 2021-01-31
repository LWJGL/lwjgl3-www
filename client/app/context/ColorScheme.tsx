import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { themes } from '~/theme/stitches.config';

type Scheme = 'light' | 'dark';
type Toggle = (scheme: Scheme) => void;

const SCHEME_STORAGE_KEY = 'color-theme';
const schemeClasses: [string, string] = ['', themes.dark];
// export const dark = themes.dark;
// export const light = ''; // defaults to no theme override
let schemeDefault: Scheme = 'light';
let isStored = false;
// let agentTriggered = false;

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

export const ColorSchemeProvider: React.FC = ({ children }) => {
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

      if (prefersColorSchemeDark.addEventListener) {
        prefersColorSchemeDark.addEventListener('change', callback);
      } else {
        prefersColorSchemeDark.addListener(callback);
      }
    }
  }, []);

  useEffect(() => {
    let prevScheme = current === 'dark' ? 'light' : 'dark';

    const cl = document.body.classList;
    cl.remove(prevScheme);
    cl.add(current);

    const darkBit = current === 'dark' ? 1 : 0;
    let classToRemove = schemeClasses[darkBit ^ 1];
    let classToAdd = schemeClasses[darkBit ^ 0];

    if (classToRemove) {
      cl.remove(classToRemove);
    }
    if (classToAdd) {
      cl.add(classToAdd);
    }

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
