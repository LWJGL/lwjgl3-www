import { useSyncExternalStore } from 'react';
import { createStore } from '~/services/createStore';
import { SUPPORTS_PASSIVE_EVENTS } from '~/services/supports';

export type WindowSize = {
  innerWidth: number;
  innerHeight: number;
  outerWidth: number;
  outerHeight: number;
  screenTop: number;
  screenLeft: number;
  screenX: number;
  screenY: number;
  screenWidth: number;
  screenHeight: number;
  isFullScreen: boolean;
};

function getSize(): WindowSize {
  return {
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    outerWidth: window.outerWidth,
    outerHeight: window.outerHeight,
    screenTop: window.screenTop,
    screenLeft: window.screenLeft,
    screenX: window.screenX,
    screenY: window.screenY,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    isFullScreen:
      (window.screen.width === window.innerWidth && window.screen.height === window.innerHeight) ||
      (!window.screenTop && !window.screenY),
  };
}

const registerOptions = SUPPORTS_PASSIVE_EVENTS ? { passive: true } : false;

const store = createStore<WindowSize>(getSize(), (setState) => {
  function handleResize(ev: Event) {
    setState((prev) => getSize());
  }

  addEventListener('resize', handleResize, registerOptions);

  return () => {
    /*
      We're passing the same registerOptions object even if the spec says it's fine to just pass `false`.
      Based on recommendation from:
      https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener#syntax
      "It's worth noting that some browser releases have been inconsistent on this, and unless you have specific reasons otherwise,
      it's probably wise to use the same values used for the call to addEventListener() when calling removeEventListener()."
    */
    //@ts-expect-error
    removeEventListener('resize', handleResize, registerOptions);
  };
});

function getServerSnapshot(): WindowSize {
  return {
    innerWidth: 1024,
    innerHeight: 768,
    outerWidth: 1024,
    outerHeight: 768,
    screenTop: 0,
    screenLeft: 0,
    screenX: 0,
    screenY: 0,
    screenWidth: 1024,
    screenHeight: 768,
    isFullScreen: true,
  };
}

export function useWindowSize(): WindowSize {
  return useSyncExternalStore<WindowSize>(store.subscribe, store.getState, getServerSnapshot);
}
