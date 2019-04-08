import React, { useState, useEffect, useRef } from 'react';
import { SUPPORTS_IMG_LOADING, SUPPORTS_INTERSECTION_OBSERVER } from '~/services/supports';

let io: IntersectionObserver | null = null;
let map: WeakMap<Element, Function> = new WeakMap();
let mapCount: number = 0;

function observeEntries(entries: Array<IntersectionObserverEntry>) {
  entries.forEach(entry => {
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
    return `data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="${params.width}" height="${
      params.height
    }" />`;
  }
  return '';
}

interface LazyImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  rootMargin?: string;
}

export const LazyImg: React.FC<LazyImgProps> =
  !SUPPORTS_IMG_LOADING && SUPPORTS_INTERSECTION_OBSERVER
    ? ({ src: lazySrc, srcSet: lazySrcSet, rootMargin = '0px', ...rest }) => {
        const [src, setSrc] = useState<string | undefined>(getPlaceholder(rest));
        const [srcSet, setSrcSet] = useState<string | undefined>();
        const imgRef: React.RefObject<HTMLImageElement> = useRef(null);

        useEffect(() => {
          function cleanup() {
            if (io !== null && imgRef.current !== null) {
              io.unobserve(imgRef.current);
              map.delete(imgRef.current);
              mapCount -= 1;

              if (mapCount === 0) {
                // We don't need this IO anymore
                io = null;
              }
            }
          }

          function loadImage() {
            setSrc(lazySrc);
            setSrcSet(lazySrcSet);
            cleanup();
          }

          if (imgRef.current !== null) {
            if (io === null) {
              io = new IntersectionObserver(observeEntries, {
                threshold: 0,
                rootMargin,
              });
            }

            map.set(imgRef.current, loadImage);
            io.observe(imgRef.current);
            mapCount += 1;

            return cleanup;
          }
        }, [lazySrc, lazySrcSet, rootMargin]);

        return <img ref={imgRef} src={src} srcSet={srcSet} {...rest} />;
      }
    : ({ src, srcSet, ...rest }) => {
        //@ts-ignore
        return <img loading="lazy" src={src} srcSet={srcSet} {...rest} />;
      };
