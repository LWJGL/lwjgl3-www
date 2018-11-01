import { useState, useLayoutEffect } from 'react';

export interface ComponentSize {
  width: number;
  height: number;
}

export function getSize(el: HTMLElement | null): ComponentSize | null {
  return el
    ? {
        width: el.offsetWidth,
        height: el.offsetHeight,
      }
    : null;
}

export function useComponentSize(ref: React.RefObject<HTMLElement>) {
  let [componentSize, setComponentSize] = useState(getSize(ref.current));

  function handleResize() {
    if (ref && ref.current) {
      setComponentSize(getSize(ref.current));
    }
  }

  useLayoutEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return componentSize;
}
