import { useState, useEffect } from 'react';

type XY = [number, number];

export function getWindowScroll(): XY {
  // return [window.scrollX, window.scrollY];
  return [window.pageXOffset, window.pageYOffset];
}

export function useScroll() {
  const [pos, setPos] = useState<XY>(getWindowScroll());

  function handleScroll() {
    setPos(getWindowScroll());
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, false);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return pos;
}
