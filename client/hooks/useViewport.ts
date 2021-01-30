/*
  Adopted from:
  https://github.com/WebReflection/screenfit
  (c) Andrea Giammarchi - ISC
*/

import { useState, useEffect } from 'react';
import { viewport } from '~/services/screenFit';

interface HookSignature {
  width: number;
  height: number;
}

export function useViewport(): HookSignature {
  const [dimensions, setDimensions] = useState({
    width: viewport.width,
    height: viewport.height,
  });

  useEffect(() => {
    const listener = (e: CustomEvent<VisualViewport>) => {
      const { width, height } = e.detail;
      setDimensions({
        width,
        height,
      });
    };

    addEventListener('screenfit', listener as EventListener);

    return () => {
      removeEventListener('screenfit', listener as EventListener);
    };
  }, []);

  return dimensions;
}
