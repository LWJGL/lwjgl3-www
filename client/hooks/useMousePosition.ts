import { useSyncExternalStore } from 'react';
import { createStore } from '~/services/createStore';

type XY = [number, number];

const store = createStore<XY>([0, 0], (setState) => {
  function handler({ clientX, clientY }: MouseEvent) {
    setState((prev) => [clientX, clientY]);
  }

  addEventListener('mousemove', handler);

  return () => {
    removeEventListener('mousemove', handler);
  };
});

export function useMousePosition(): XY {
  return useSyncExternalStore<XY>(store.subscribe, store.getState, store.getState);
}
