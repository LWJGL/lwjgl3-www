import { useState, useEffect } from 'react';

const getBlankEvent = () =>
  ({
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
  } as DeviceMotionEvent);

export function useDeviceMotion() {
  const [motion, setMotion] = useState(getBlankEvent);

  useEffect(() => {
    window.addEventListener('devicemotion', setMotion, true);
    return () => {
      window.removeEventListener('devicemotion', setMotion);
    };
  }, []);

  return motion;
}
