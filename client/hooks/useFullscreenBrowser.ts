import { useState, useEffect } from 'react';
import { useWindowResize } from './useWindowResize';

interface SizeInfo {
  screenTop: number;
  screenY: number;
  screenWidth: number;
  screenHeight: number;
  innerWidth: number;
  innerHeight: number;
}

export function getSizeInfo(): SizeInfo {
  return {
    screenTop: window.screenTop,
    screenY: window.screenY,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
  };
}

export function isFullScreenSize(sizeInfo: SizeInfo) {
  if (sizeInfo.screenWidth === sizeInfo.innerWidth && sizeInfo.screenHeight === sizeInfo.innerHeight) {
    return true;
  } else if (!sizeInfo.screenTop && !sizeInfo.screenY) {
    return true;
  }

  return false;
}

export function useFullScreenBrowser() {
  const [width, height] = useWindowResize();
  const initialSizeInfo = getSizeInfo();
  const [fullScreen, setFullScreen] = useState(isFullScreenSize(initialSizeInfo));
  const [sizeInfo, setSizeInfo] = useState(initialSizeInfo);

  useEffect(() => {
    const sizeInfo = getSizeInfo();
    setFullScreen(isFullScreenSize(sizeInfo));
    setSizeInfo(sizeInfo);
  }, [width, height]);

  return {
    fullScreen: fullScreen,
    info: sizeInfo,
  };
}
