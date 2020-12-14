import { proxy } from 'valtio';
import { mediaQueryListener } from '../services/mediaQueryListener';
import { themes } from '~/theme/stitches.config';

// Z-Index
export const ZINDEX_DROPDOWN = 1000;
export const ZINDEX_STICKY = 1020;
export const ZINDEX_FIXED = 1030;
export const ZINDEX_MODAL_BACKDROP = 1040;
export const ZINDEX_MODAL = 1050;
export const ZINDEX_POPOVER = 1060;
export const ZINDEX_TOOLTIP = 1070;

// Themes
export type Scheme = 'light' | 'dark';
export type ThemeName = 'default';

interface ThemeConfig {
  name: ThemeName;
  scheme: Scheme;
  prefers: Scheme;
  stored: Scheme | null;
  dark: string;
  light: string;
}

const themeMap: { [key in ThemeName]: [string, string] } = {
  default: ['', themes.dark],
};

const SCHEME_STORAGE_KEY = 'color-theme';

export const theme = proxy<ThemeConfig>({
  name: 'default',
  scheme: 'light',
  prefers: 'light',
  stored: null,
  dark: themes.dark,
  light: '', // defaults to no theme override
});

function toggleThemeClasses(prevName: ThemeName = theme.name, prevScheme: Scheme = theme.scheme) {
  const cl = document.body.classList;
  const { name, scheme } = theme;

  if (scheme !== prevScheme) {
    if (scheme === 'dark') {
      cl.remove('light');
      cl.add('dark');
    } else {
      cl.add('light');
      cl.remove('dark');
    }
  }

  let classToRemove = themeMap[prevName][prevScheme === 'dark' ? 1 : 0];
  let classToAdd = themeMap[name][scheme === 'dark' ? 1 : 0];

  if (classToAdd !== classToRemove) {
    if (classToRemove) {
      cl.remove(classToRemove);
    }
    if (classToAdd) {
      cl.add(classToAdd);
    }
  }

  setRootColorScheme(scheme);
}

export function setTheme(name: ThemeName) {
  if (name !== theme.name) {
    const prevTheme = theme.name;
    theme.name = name;
    theme.light = themeMap[name][0];
    theme.dark = themeMap[name][1];
    toggleThemeClasses(prevTheme, theme.scheme);
  }
}

function setScheme(scheme: Scheme) {
  if (theme.scheme !== scheme) {
    const prevScheme = theme.scheme;
    theme.scheme = scheme;
    toggleThemeClasses(theme.name, prevScheme);
  }
}

function setRootColorScheme(scheme: Scheme) {
  document.documentElement.style.setProperty('color-scheme', scheme);
}

export function toggleScheme(scheme?: Scheme | React.SyntheticEvent) {
  if (scheme === theme.scheme) {
    // early out
    return;
  } else if (typeof scheme !== 'string') {
    scheme = theme.scheme === 'light' ? 'dark' : 'light';
  }

  setScheme(scheme);

  try {
    window.localStorage.setItem(SCHEME_STORAGE_KEY, scheme);
  } catch {}
}

{
  const schemeStored = window.localStorage.getItem(SCHEME_STORAGE_KEY);
  if (schemeStored === 'dark' || schemeStored === 'light') {
    theme.stored = schemeStored;
    if (schemeStored === 'dark') {
      theme.scheme = 'dark';
      toggleThemeClasses(theme.name, 'light');
    } else {
      setRootColorScheme('light');
    }
  }
}

mediaQueryListener('(prefers-color-scheme: dark)', (list: MediaQueryList) => {
  const prefers = list.matches ? 'dark' : 'light';

  if (prefers !== theme.prefers) {
    theme.prefers = prefers;

    // Change scheme automatically if we haven't set a preference
    if (theme.stored === null) {
      setScheme(prefers);
    }
  }
});
