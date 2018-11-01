import { useRef, useState, useLayoutEffect } from 'react';
// import ResizeObserver from 'resize-observer-polyfill';

export function useResizeObserver(target: React.RefObject<HTMLElement>) {
  const [rect, setRect] = useState({ width: 0, height: 0, x: 0, y: 0, top: 0, right: 0, bottom: 0, left: 0 });
  const observer: React.RefValue<ResizeObserver> = useRef(null);

  useLayoutEffect(() => {
    function handleResize(entries: Array<ResizeObserverEntry>) {
      setRect(entries[0].contentRect);
    }

    observer.current = new ResizeObserver(handleResize);
    if (target.current !== null) {
      observer.current.observe(target.current);
    }

    return () => {
      if (observer.current !== null) {
        observer.current.disconnect();
        observer.current = null;
      }
    };
  }, []);

  return rect;
}
