import { useState, useLayoutEffect } from 'react';

export function useOnScreen(ref: React.RefObject<Element>, options?: IntersectionObserverInit) {
  const [isIntersecting, setIntersecting] = useState(false);

  useLayoutEffect(() => {
    if (ref.current) {
      const observer = new IntersectionObserver(([entry]) => setIntersecting(entry.isIntersecting), options);
      observer.observe(ref.current);
      return () => {
        observer.disconnect();
      };
    }
  }, [ref, options]);

  return isIntersecting;
}
