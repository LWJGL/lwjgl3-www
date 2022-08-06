import { useInsertionEffect } from 'react';

export function useCSS(href: string) {
  useInsertionEffect(() => {
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = href;
    css.media = 'only x';

    css.addEventListener(
      'load',
      () => {
        css.media = 'screen';
      },
      { once: true }
    );

    document.head.append(css);

    return () => {
      css.remove();
    };
  }, [href]);
}
