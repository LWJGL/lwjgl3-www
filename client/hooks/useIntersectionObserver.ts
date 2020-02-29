import { useState, useEffect } from 'react';

export function useIntersectionObserver(
  ref: React.RefObject<HTMLElement>,
  options: IntersectionObserverInit = { rootMargin: '0px' }
) {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIntersecting(entry.isIntersecting);
    }, options);
    let trg = ref.current;
    if (trg) {
      observer.observe(trg);
      return () => {
        if (trg) {
          observer.unobserve(trg);
        }
      };
    }
  }, [ref, options]);

  return isIntersecting;
}
