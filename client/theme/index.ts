import { atom, DefaultValue } from 'recoil';
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

const SCHEME_STORAGE_KEY = 'color-theme';
const schemeClasses: [string, string] = ['', themes.dark];

function toggleScheme(prevScheme: Scheme, newScheme: Scheme) {
  const cl = document.body.classList;
  cl.remove(prevScheme);
  cl.add(newScheme);

  const darkBit = newScheme === 'dark' ? 1 : 0;
  let classToRemove = schemeClasses[darkBit ^ 1];
  let classToAdd = schemeClasses[darkBit ^ 0];

  if (classToRemove) {
    cl.remove(classToRemove);
  }
  if (classToAdd) {
    cl.add(classToAdd);
  }

  setRootColorScheme(newScheme);
}

function setRootColorScheme(scheme: Scheme) {
  document.documentElement.style.setProperty('color-scheme', scheme);
}

export const dark = themes.dark;
export const light = ''; // defaults to no theme override
let isStored = false;
let agentTriggered = false;

export const scheme = atom<Scheme>({
  key: SCHEME_STORAGE_KEY,
  default: 'light',
  effects_UNSTABLE: [
    ({ setSelf }) => {
      let activeScheme: Scheme = 'light';

      const schemeStored = window.localStorage.getItem(SCHEME_STORAGE_KEY);
      if (schemeStored === 'dark' || schemeStored === 'light') {
        isStored = true;
        activeScheme = schemeStored;
      }

      let unsubscribe;
      if (!isStored) {
        unsubscribe = mediaQueryListener('(prefers-color-scheme: dark)', (list: MediaQueryList) => {
          if (!isStored) {
            // Change scheme automatically if we haven't set a preference
            activeScheme = list.matches ? 'dark' : 'light';
            // First this fires will be synchronous, scheme will change below
            // Next times will be async, scheme whill change by onSet
            agentTriggered = true;
            setSelf(activeScheme);
          }
        });
        // Reset immediately the first time
        agentTriggered = false;
      }

      if (activeScheme === 'dark') {
        setSelf('dark');
        toggleScheme('light', 'dark');
      } else {
        setRootColorScheme('light');
      }

      return unsubscribe;
    },
    ({ onSet }) => {
      onSet((newValue, oldValue) => {
        if (newValue instanceof DefaultValue || oldValue instanceof DefaultValue) {
          return;
        }
        if (newValue !== oldValue) {
          toggleScheme(oldValue, newValue);

          if (!agentTriggered) {
            try {
              window.localStorage.setItem(SCHEME_STORAGE_KEY, newValue);
            } catch {}
          } else {
            agentTriggered = false;
          }
        }
      });
    },
  ],
});
