import { useState, useEffect } from 'react';

// determine if we are in fullscreen mode and why
// don't set any state in here as called on init too
export function isFullScreenElement(el?: React.RefObject<HTMLElement>) {
  if (el && el.current) {
    //@ts-ignore
    return Boolean(
      //@ts-ignore
      document.fullscreenElement === el.current ||
        //@ts-ignore
        document.mozFullScreenElement === el.current ||
        //@ts-ignore
        document.webkitFullscreenElement === el.current ||
        //@ts-ignore
        document.msFullscreenElement === el.current
    );
  }

  return Boolean(
    //@ts-ignore
    document.fullscreenElement ||
      document.fullscreen ||
      //@ts-ignore
      document.mozFullScreenElement ||
      //@ts-ignore
      document.mozFullScreen ||
      //@ts-ignore
      document.webkitFullscreenElement ||
      //@ts-ignore
      document.webkitIsFullScreen ||
      //@ts-ignore
      document.msFullscreenElement ||
      //@ts-ignore
      document.fullScreenMode
  );
}

export function useFullScreen(element?: React.RefObject<HTMLElement>) {
  const docEl = document.documentElement;
  const [fullScreen, setFullScreen] = useState(isFullScreenElement(element));

  // access various open fullscreen methods
  function openFullScreen() {
    const el = element !== undefined && element.current !== null ? element.current : docEl;

    if (el.requestFullscreen) {
      return el.requestFullscreen();
    }
    //@ts-ignore
    if (el.mozRequestFullScreen) {
      //@ts-ignore
      return el.mozRequestFullScreen();
    }
    //@ts-ignore
    if (el.webkitRequestFullscreen) {
      //@ts-ignore
      return el.webkitRequestFullscreen();
    }
    //@ts-ignore
    if (el.msRequestFullscreen) {
      //@ts-ignore
      return el.msRequestFullscreen();
    }
  }

  // access various exit fullscreen methods
  function closeFullScreen() {
    if (document.exitFullscreen) {
      return document.exitFullscreen();
    }
    //@ts-ignore
    if (document.mozCancelFullScreen) {
      //@ts-ignore
      return document.mozCancelFullScreen();
    }
    //@ts-ignore
    if (document.webkitExitFullscreen) {
      //@ts-ignore
      return document.webkitExitFullscreen();
    }
    //@ts-ignore
    if (document.msExitFullscreen) {
      //@ts-ignore
      return document.msExitFullscreen();
    }
  }

  function handleChange() {
    setFullScreen(isFullScreenElement(element));
  }

  useEffect(() => {
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
  }, [element]);

  return {
    fullScreen,
    open: openFullScreen,
    close: closeFullScreen,
    toggle: fullScreen ? closeFullScreen : openFullScreen,
  };
}
