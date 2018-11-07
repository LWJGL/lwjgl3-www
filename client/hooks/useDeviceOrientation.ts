import { useState, useEffect } from 'react';

interface Orientation {
  absolute: boolean;
  alpha: number | null;
  beta: number | null;
  gamma: number | null;
}

const getInitialOrientation = () =>
  ({
    alpha: null,
    beta: null,
    gamma: null,
    absolute: false,
  } as Orientation);

export function useDeviceOrientation() {
  const [orientation, setOrientation] = useState(getInitialOrientation);

  useEffect(() => {
    const handle = (e: DeviceOrientationEvent) => setOrientation(e);

    window.addEventListener('deviceorientation', handle);
    return () => {
      window.removeEventListener('deviceorientation', handle);
    };
  }, []);

  return orientation;
}
