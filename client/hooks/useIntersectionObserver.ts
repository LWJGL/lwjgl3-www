import { useState, useRef, useEffect } from 'react';

export function useIntersectionObserver(
  target: React.RefObject<HTMLElement>,
  root: React.RefObject<HTMLElement>,
  options: IntersectionObserverInit
) {
  const [isIntersecting, setIntersecting] = useState(false);
  const isIntersectingCurrent = useRef(isIntersecting);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting !== isIntersectingCurrent.current) {
          setIntersecting(entry.isIntersecting);
        }
      },
      {
        root: root.current,
        // rootMargin: '0px 0px 0px 0px',
        // threshold: 0,
        ...options,
      }
    );
    let trg = target.current;
    if (trg) {
      observer.observe(trg);
      return () => {
        if (trg) {
          observer.unobserve(trg);
        }
      };
    }
  }, [target, root, options]);

  return isIntersecting;
}
