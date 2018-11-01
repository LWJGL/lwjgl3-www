import { useState, useEffect } from 'react';

interface Orientation {
  absolute: boolean;
  alpha: number | null;
  beta: number | null;
  gamma: number | null;
}

export function useDeviceOrientation() {
  const [orientation, setOrientation] = useState({
    alpha: null,
    beta: null,
    gamma: null,
    absolute: false,
  } as Orientation);

  useEffect(() => {
    const handle = (e: DeviceOrientationEvent) => {
      setOrientation({
        beta: e.beta,
        alpha: e.alpha,
        gamma: e.gamma,
        absolute: e.absolute,
      });
    };

    window.addEventListener('deviceorientation', handle);
    return () => {
      window.removeEventListener('deviceorientation', handle);
    };
  }, []);

  return orientation;
}
