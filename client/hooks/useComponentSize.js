// @flow
//$FlowFixMe
import { useState, useLayoutEffect } from 'react';

export type ComponentSize = {
  width: number,
  height: number,
};

type Ref = {
  current: HTMLElement | null,
};

export function getSize(el: HTMLElement | null): ComponentSize | null {
  return el
    ? {
        width: el.offsetWidth,
        height: el.offsetHeight,
      }
    : null;
}

export function useComponentSize(ref: Ref) {
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
