import { useState, useCallback, useEffect } from 'react';

export function isFullScreen() {
  return document.fullscreenElement !== null;
}

export function isFullScreenElement(el: HTMLElement = document.documentElement) {
  return document.fullscreenElement === el;
}

// access various exit fullscreen methods
export function closeFullScreen() {
  if (document.exitFullscreen !== undefined) {
    return document.exitFullscreen();
  }
}

export function useFullScreen(ref?: React.RefObject<HTMLElement>) {
  const [fullScreen, setFullScreen] = useState(isFullScreen());

  const openFullScreen = useCallback(() => {
    const el = (ref && ref.current) || document.documentElement;

    if (el.requestFullscreen !== undefined) {
      return el.requestFullscreen();
    }
  }, [ref]);

  useEffect(() => {
    const handleChange = () => {
      setFullScreen(isFullScreen());
    };

    document.addEventListener('webkitfullscreenchange', handleChange, false);
    document.addEventListener('mozfullscreenchange', handleChange, false);
    document.addEventListener('msfullscreenchange', handleChange, false);
    document.addEventListener('MSFullscreenChange', handleChange, false); // IE11
    document.addEventListener('fullscreenchange', handleChange, false);

    return () => {
      document.removeEventListener('webkitfullscreenchange', handleChange);
      document.removeEventListener('mozfullscreenchange', handleChange);
      document.removeEventListener('msfullscreenchange', handleChange);
      document.removeEventListener('MSFullscreenChange', handleChange);
      document.removeEventListener('fullscreenchange', handleChange);
    };
  }, []);

  return {
    fullScreen,
    open: openFullScreen,
    close: closeFullScreen,
    toggle: fullScreen ? closeFullScreen : openFullScreen,
  };
}
