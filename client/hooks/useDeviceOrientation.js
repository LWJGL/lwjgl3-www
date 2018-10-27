// @flow
//$FlowFixMe
import { useState, useEffect } from 'react';

export function useDeviceOrientation() {
  const [orientation, setOrientation] = useState({
    alpha: null,
    beta: null,
    gamma: null,
    absolute: false,
  });

  useEffect(() => {
    const handle = e => {
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
