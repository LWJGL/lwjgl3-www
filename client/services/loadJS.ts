export const loadJS = (src: string, cb?: (this: GlobalEventHandlers, ev: Event) => any) => {
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  document.head.appendChild(script);

  if (cb && typeof cb === 'function') {
    script.onload = cb;
  }

  return script;
};
