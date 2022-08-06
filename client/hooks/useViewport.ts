/*
  Adopted from:
  https://github.com/WebReflection/screenfit
  (c) Andrea Giammarchi - ISC
*/

import { useSyncExternalStore } from 'react';
import { createStore } from '~/services/createStore';
import { viewport } from '~/services/screenFit';

interface ViewportSize {
  width: number;
  height: number;
}

function getViewportSize(): ViewportSize {
  return {
    width: viewport.width,
    height: viewport.height,
  };
}

const store = createStore<ViewportSize>(getViewportSize(), (setState) => {
  function listener(ev: CustomEvent<VisualViewport>) {
    const { width, height } = ev.detail;
    setState((prev) => ({ width, height }));
  }

  addEventListener('screenfit', listener as EventListener);

  return () => {
    removeEventListener('screenfit', listener as EventListener);
  };
});

export function useViewport(): ViewportSize {
  return useSyncExternalStore<ViewportSize>(store.subscribe, store.getState, store.getState);
}
