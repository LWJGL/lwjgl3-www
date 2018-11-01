import { useState, useEffect } from 'react';

export function useMedia(query: string, defaultMatches: boolean = true) {
  const [matches, setMatches] = useState(defaultMatches);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);

    const listener = () => {
      if (mediaQueryList.matches) {
        setMatches(true);
      } else {
        setMatches(false);
      }
    };

    mediaQueryList.addListener(listener);
    setMatches(mediaQueryList.matches);

    return () => {
      mediaQueryList.removeListener(listener);
    };
  }, []);

  return matches;
}
