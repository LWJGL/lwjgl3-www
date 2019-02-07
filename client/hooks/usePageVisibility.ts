import { useEffect, useState } from 'react';

export function getVisibility(): boolean {
  if (typeof document.hidden !== 'undefined') {
    // Opera 12.10 and Firefox 18 and later support
    return !document.hidden;
  } else if (
    //@ts-ignore
    typeof document.msHidden !== 'undefined'
  ) {
    //@ts-ignore
    return !document.msHidden;
  } else if (
    //@ts-ignore
    typeof document.webkitHidden !== 'undefined'
  ) {
    //@ts-ignore
    return !document.webkitHidden;
  } else {
    return true;
  }
}

export function usePageVisibility() {
  const [visible, setVisible] = useState(getVisibility());

  useEffect(() => {
    const handler = () => setVisible(getVisibility());
    let visibilityChange: string;

    if (typeof document.hidden !== 'undefined') {
      // Opera 12.10 and Firefox 18 and later support
      visibilityChange = 'visibilitychange';
    } else if (
      //@ts-ignore
      typeof document.msHidden !== 'undefined'
    ) {
      visibilityChange = 'msvisibilitychange';
    } else if (
      //@ts-ignore
      typeof document.webkitHidden !== 'undefined'
    ) {
      visibilityChange = 'webkitvisibilitychange';
    } else {
      return;
    }

    document.addEventListener(visibilityChange, handler);
    return () => document.removeEventListener(visibilityChange, handler);
  }, []);

  return visible;
}
