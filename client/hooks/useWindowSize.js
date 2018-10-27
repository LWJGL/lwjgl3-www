// @flow
//$FlowFixMe
import { useState, useEffect } from 'react';
import throttle from 'lodash-es/throttle';

export type WindowSize = {
  innerHeight: number,
  innerWidth: number,
  outerHeight: number,
  outerWidth: number,
};

function getSize(): WindowSize {
  return {
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth,
    outerHeight: window.outerHeight,
    outerWidth: window.outerWidth,
  };
}

export function useWindowSize(throttleMs: number = 0) {
  const [windowSize, setWindowSize] = useState(getSize());

  useEffect(() => {
    const handleResize = throttle(() => {
      setWindowSize(getSize());
    }, throttleMs);

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return windowSize;
}
