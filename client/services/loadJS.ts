export const loadJS = (src: string, cb?: Function): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (cb && typeof cb === 'function') {
        cb();
      }
      resolve();
    };

    script.onerror = (ev) => {
      reject(ev);
    };
  });
};
