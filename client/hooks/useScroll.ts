import { useSyncExternalStore } from 'react';
import { SUPPORTS_PASSIVE_EVENTS } from '~/services/supports';
import { createStore } from '~/services/createStore';

type ScrollPosition = [number, number];

let registerOptions = SUPPORTS_PASSIVE_EVENTS ? { passive: true } : false;

let store = createStore<ScrollPosition>([0, 0], (setState) => {
  function updateScrollPosition(ev: Event) {
    setState((prev) => [window.pageXOffset, Math.max(0, window.pageYOffset)]);
  }

  window.addEventListener('scroll', updateScrollPosition, registerOptions);

  return () => {
    /*
      We're passing the same registerOptions object even if the spec says it's fine to just pass `false`.
      Based on recommendation from:
      https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener#syntax
      "It's worth noting that some browser releases have been inconsistent on this, and unless you have specific reasons otherwise,
      it's probably wise to use the same values used for the call to addEventListener() when calling removeEventListener()."
    */
    //@ts-expect-error
    window.removeEventListener('scroll', updateScrollPosition, registerOptions);
  };
});

export function useScroll(): ScrollPosition {
  return useSyncExternalStore<ScrollPosition>(store.subscribe, store.getState, store.getState);
}
