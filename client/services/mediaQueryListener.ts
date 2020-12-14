export function mediaQueryListener(query: string, callback: (list: MediaQueryList) => void) {
  const mediaQueryList = window.matchMedia(query);

  const listener = (e: MediaQueryListEvent) => {
    callback(mediaQueryList);
  };

  callback(mediaQueryList);

  if (mediaQueryList.addEventListener) {
    mediaQueryList.addEventListener('change', listener);
    return () => mediaQueryList.removeEventListener('change', listener);
  } else {
    mediaQueryList.addListener(listener);
    return () => mediaQueryList.removeListener(listener);
  }
}
