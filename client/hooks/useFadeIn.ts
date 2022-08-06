import { useLayoutEffect } from 'react';

// Proof of Concept - DO NOT USE
// https://twitter.com/gabe_ragland/status/1233192319479730177
// Better to toggle a class (animation + keyframes) with an IntersectionObserver

export function useFadeIn(ref: React.RefObject<HTMLElement>, duration = 1, enable = true) {
  useLayoutEffect(() => {
    if (ref.current && enable) {
      ref.current.style.transition = `opacity ${duration}s ease-in`;
      ref.current.style.opacity = '1';
    }
  }, [ref, duration, enable]);

  return { style: { opacity: 0 } };
}
