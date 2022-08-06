import { useSyncExternalStore, useCallback } from 'react';
import { createStore } from '~/services/createStore';

export function isFullScreen() {
  return document.fullscreenElement !== null;
}

export function isFullScreenElement(el: HTMLElement = document.documentElement) {
  return document.fullscreenElement === el;
}

// access various exit fullscreen methods
export function closeFullScreen() {
  if (document.exitFullscreen !== undefined) {
    return document.exitFullscreen();
  }
}

const store = createStore<boolean>('document' in globalThis && isFullScreen(), (setState) => {
  function handler(ev: Event) {
    setState((prev) => isFullScreen());
  }

  document.addEventListener('fullscreenchange', handler);

  return () => {
    document.removeEventListener('fullscreenchange', handler);
  };
});

export function useFullScreen(ref?: React.RefObject<HTMLElement>) {
  const fullScreen = useSyncExternalStore<boolean>(store.subscribe, store.getState, store.getState);

  const openFullScreen = useCallback(() => {
    const el = (ref && ref.current) || document.documentElement;

    if (el.requestFullscreen !== undefined) {
      return el.requestFullscreen();
    }
  }, [ref]);

  return {
    fullScreen,
    open: openFullScreen,
    close: closeFullScreen,
    toggle: fullScreen ? closeFullScreen : openFullScreen,
  };
}
