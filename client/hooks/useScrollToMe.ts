import { useEffect } from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';

export function useScrollToMe(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (ref.current != null) {
      scrollIntoView(ref.current, {
        behavior: 'smooth',
        block: 'start',
        inline: 'start',
      });
    }
  }, [ref]);
}
