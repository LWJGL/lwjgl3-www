// @flow
//$FlowFixMe
import { useState, useEffect } from 'react';

type HtmlRef = { current: null | HTMLElement };

export function useIntersectionObserver(target: HtmlRef, root: HtmlRef) {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting !== isIntersecting) {
          setIntersecting(entry.isIntersecting);
        }
      },
      {
        rootMargin: '0px',
        root: root.current,
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
