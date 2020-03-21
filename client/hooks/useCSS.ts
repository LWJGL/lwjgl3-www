import { useEffect } from 'react';

export function useCSS(href: string) {
  useEffect(() => {
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = href;
    css.media = 'only x';
    document.head.appendChild(css);

    css.addEventListener('load', () => {
      css.media = 'screen';
    });

    return () => {
      document.head.removeChild(css);
    };
  }, [href]);
}
