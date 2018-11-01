import { useEffect } from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';

export function useScrollToMe(elementRef: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (elementRef.current != null) {
      scrollIntoView(elementRef.current, {
        behavior: 'smooth',
        block: 'start',
        inline: 'start',
      });
    }
  }, []);
}
