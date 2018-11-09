import { useState, useEffect } from 'react';

export function useOnScreen(ref: React.RefObject<Element>, options?: IntersectionObserverInit) {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIntersecting(entry.isIntersecting), options);
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current !== null) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return isIntersecting;
}
