// @flow
//$FlowFixMe
import { useEffect } from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';

type ElementRef = { current: null | HTMLElement };

export function useScrollToMe(elementRef: ElementRef) {
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
