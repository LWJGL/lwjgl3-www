import { useState, useEffect } from 'react';

type XY = [number, number];

export function getWindowSize(): XY {
  return [window.innerWidth, window.innerHeight];
}

export function useWindowResize() {
  const [size, setSize] = useState<XY>(getWindowSize());

  function handleResize() {
    setSize(getWindowSize());
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize, false);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return size;
}
