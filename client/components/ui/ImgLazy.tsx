import { useState, useEffect, useRef } from 'react';
import { SUPPORTS_IMG_LOADING, SUPPORTS_INTERSECTION_OBSERVER } from '~/services/supports';
import { styled } from '~/theme/stitches.config';

let io: IntersectionObserver;
let map: WeakMap<Element, Function>;
let lazyPolyfill = false;

if (!SUPPORTS_IMG_LOADING && SUPPORTS_INTERSECTION_OBSERVER) {
  lazyPolyfill = true;
  map = new WeakMap();
}

function observeEntries(entries: Array<IntersectionObserverEntry>) {
  entries.forEach((entry) => {
    if (entry.intersectionRatio > 0) {
      const cb = map.get(entry.target);
      if (cb !== undefined) {
        cb();
      }
    }
  });
}

function getPlaceholder(params: Partial<React.ImgHTMLAttributes<HTMLImageElement>>) {
  if (params.width !== undefined && params.height !== undefined) {
    return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="${params.width}" height="${params.height}" />`;
  }
  return '';
}

const Img = styled('img', {
  'md-down': {
    maxWidth: '90%',
    height: 'auto',
  },
});

export interface ImgLazyProps extends React.ComponentProps<typeof Img> {
  rootMargin?: string;
}

export const ImgLazy: React.FC<ImgLazyProps> = lazyPolyfill
  ? function ImgLazyPolyfill({ src: lazySrc, srcSet: lazySrcSet, rootMargin = '0px', ...rest }) {
      const [src, setSrc] = useState<string | undefined>(getPlaceholder(rest));
      const [srcSet, setSrcSet] = useState<string | undefined>();
      const imgRef = useRef<HTMLImageElement>(null);

      useEffect(() => {
        function cleanup() {
          if (io !== undefined && imgRef.current !== null) {
            io.unobserve(imgRef.current);
            map.delete(imgRef.current);
          }
        }

        function loadImage() {
          setSrc(lazySrc);
          setSrcSet(lazySrcSet);
          cleanup();
        }

        if (imgRef.current !== null) {
          if (io === undefined) {
            io = new IntersectionObserver(observeEntries, {
              threshold: 0,
              rootMargin,
            });
          }

          map.set(imgRef.current, loadImage);
          io.observe(imgRef.current);

          return cleanup;
        }
      }, [lazySrc, lazySrcSet, rootMargin]);

      return <Img ref={imgRef} src={src} srcSet={srcSet} {...rest} />;
    }
  : function ImgLazyNative({ src, srcSet, ...rest }) {
      //@ts-ignore
      return <Img loading="lazy" src={src} srcSet={srcSet} {...rest} />;
    };
