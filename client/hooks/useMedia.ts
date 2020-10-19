import { useState, useRef, useEffect } from 'react';

export function useMedia(query: string) {
  const mediaQueryList = useRef(window.matchMedia(query));
  const [matches, setMatches] = useState(mediaQueryList.current.matches);

  useEffect(() => {
    let qr = mediaQueryList.current;

    // Replace media query if changed
    if (qr.media !== query) {
      mediaQueryList.current = window.matchMedia(query);
      qr = mediaQueryList.current;
      setMatches(qr.matches);
    }

    const listener = () => {
      setMatches(qr.matches);
    };

    if (qr.addEventListener) {
      qr.addEventListener('change', listener);
    } else {
      qr.addListener(listener);
    }

    return () => {
      if (qr.removeEventListener) {
        qr.removeEventListener('change', listener);
      } else {
        qr.removeListener(listener);
      }
    };
  }, [query]);

  return matches;
}
