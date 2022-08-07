import { useState, useCallback, useLayoutEffect } from 'react';
import { SUPPORTS_RESIZE_OBSERVER } from '~/services/supports';

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

  const handleResize = useCallback(
    function handleResize() {
      if (ref.current) {
        setComponentSize(getSize(ref.current));
      }
    },
    [ref]
  );

  useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }

    if (SUPPORTS_RESIZE_OBSERVER) {
      let resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(ref.current);

      return () => {
        resizeObserver.disconnect();
      };
    } else {
      addEventListener('resize', handleResize);

      return () => {
        removeEventListener('resize', handleResize);
      };
    }
  }, [handleResize, ref]);

  return componentSize;
}
