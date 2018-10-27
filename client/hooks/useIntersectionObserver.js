// @flow
//$FlowFixMe
import { useState, useEffect } from 'react';

type HtmlRef = { current: null | HTMLElement };

export function useIntersectionObserver(target: HtmlRef, root: HtmlRef, options: IntersectionObserverOptions) {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting !== isIntersecting) {
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
    if (target.current) {
      observer.observe(target.current);
    }
    return () => {
      if (target.current) {
        observer.unobserve(target.current);
      }
    };
  }, []);

  return isIntersecting;
}
