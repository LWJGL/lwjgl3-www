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
    const handle = (deviceMotionEvent: DeviceMotionEvent) => {
      setMotion(deviceMotionEvent);
    };

    window.addEventListener('devicemotion', handle);
    return () => {
      window.removeEventListener('devicemotion', handle);
    };
  }, []);

  return motion;
}
