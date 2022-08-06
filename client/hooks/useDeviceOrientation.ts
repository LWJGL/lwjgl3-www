import { useSyncExternalStore } from 'react';
import { createStore } from '~/services/createStore';

interface Orientation {
  absolute: boolean;
  alpha: number | null;
  beta: number | null;
  gamma: number | null;
}

function getOrientation(): Orientation {
  return {
    alpha: null,
    beta: null,
    gamma: null,
    absolute: false,
  };
}

const store = createStore<Orientation>(getOrientation(), (setState) => {
  function handler(ev: DeviceOrientationEvent) {
    setState((prev) => ev);
  }

  window.addEventListener('deviceorientation', handler);

  return () => {
    window.removeEventListener('deviceorientation', handler);
  };
});

export function useDeviceOrientation(): Orientation {
  return useSyncExternalStore<Orientation>(store.subscribe, store.getState, store.getState);
}
