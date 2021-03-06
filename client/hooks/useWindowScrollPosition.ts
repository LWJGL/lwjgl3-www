import { useState, useEffect } from 'react';
import { SUPPORTS_PASSIVE_EVENTS } from '~/services/supports';
import throttle from 'lodash-es/throttle';

export function getPosition() {
  return {
    x: window.pageXOffset,
    y: window.pageYOffset,
  };
}

export function useWindowScrollPosition(throttleMs: number = 0) {
  let [position, setPosition] = useState(getPosition);

  useEffect(() => {
    const handleScroll =
      throttleMs > 0 ? throttle(() => setPosition(getPosition), throttleMs) : () => setPosition(getPosition);

    window.addEventListener('scroll', handleScroll, SUPPORTS_PASSIVE_EVENTS ? { passive: true } : false);
    return () => {
      window.removeEventListener('scroll', handleScroll, false);
    };
  }, [throttleMs]);

  return position;
}
