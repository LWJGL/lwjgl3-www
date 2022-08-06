import { useSyncExternalStore } from 'react';
import { createStore } from '~/services/createStore';

function getServerSnapshot(): DeviceMotionEvent {
  return {
    acceleration: {
      x: null,
      y: null,
      z: null,
    },
    accelerationIncludingGravity: {
      x: null,
      y: null,
      z: null,
    },
    rotationRate: {
      alpha: null,
      beta: null,
      gamma: null,
    },
    interval: 0,
  } as DeviceMotionEvent;
}

const store = createStore<DeviceMotionEvent>(getServerSnapshot(), (setState) => {
  function handler(ev: DeviceMotionEvent) {
    setState((prev) => ev);
  }

  window.addEventListener('devicemotion', handler);

  return () => {
    window.removeEventListener('devicemotion', handler);
  };
});

export function useDeviceMotion(): DeviceMotionEvent {
  return useSyncExternalStore<DeviceMotionEvent>(store.subscribe, store.getState, getServerSnapshot);
}
