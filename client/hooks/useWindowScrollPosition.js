// @flow
//$FlowFixMe
import { useState, useEffect } from 'react';
import { SupportsPassiveEvents } from '~/services/supports';
import throttle from 'lodash-es/throttle';

export function getPosition() {
  return {
    x: window.pageXOffset,
    y: window.pageYOffset,
  };
}

export function useWindowScrollPosition(throttleMs: number = 0) {
  let [position, setPosition] = useState(getPosition());

  useEffect(() => {
    const handleScroll = throttle(() => {
      setPosition(getPosition());
    }, throttleMs);

    window.addEventListener('scroll', handleScroll, SupportsPassiveEvents ? { passive: true } : false);
    return () => {
      window.removeEventListener('scroll', handleScroll, SupportsPassiveEvents ? { passive: true } : false);
    };
  }, []);

  return position;
}
