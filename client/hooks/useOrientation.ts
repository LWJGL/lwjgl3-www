import { useState, useEffect } from 'react';

interface ScreenOrientationObject {
  readonly angle: number;
  readonly type: OrientationType;
}

export function getOrientation(): ScreenOrientationObject {
  if (window.screen.orientation !== undefined) {
    const { angle, type } = window.screen.orientation;
    return {
      angle,
      type,
    };
  } else {
    return {
      angle: 0,
      type: 'landscape-primary',
    };
  }
}

export function useOrientation() {
  const [orientation, setOrientation] = useState(getOrientation());

  useEffect(() => {
    if (window.screen.orientation === undefined) {
      return;
    }
    const handler = () => setOrientation(getOrientation());
    window.addEventListener('orientationchange', handler);
    return () => window.removeEventListener('orientationchange', handler);
  }, []);

  return orientation;
}
