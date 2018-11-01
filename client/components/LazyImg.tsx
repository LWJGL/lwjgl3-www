import * as React from 'react';
import { memo, useState, useEffect, useRef } from 'react';
import { SUPPORTS_INTERSECTION_OBSERVER } from '~/services/supports';

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

export const LazyImg = memo(
  ({ src: lazySrc, srcSet: lazySrcSet, ...rest }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    const [src, setSrc] = useState(SUPPORTS_INTERSECTION_OBSERVER ? undefined : lazySrc);
    const [srcSet, setSrcSet] = useState(SUPPORTS_INTERSECTION_OBSERVER ? undefined : lazySrcSet);
    const imgRef: React.RefObject<HTMLImageElement> = useRef(null);

    if (SUPPORTS_INTERSECTION_OBSERVER) {
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
              rootMargin: '400px',
            });
          }

          map.set(imgRef.current, loadImage);
          io.observe(imgRef.current);
          mapCount += 1;

          return cleanup;
        }
      }, []);
    }

    return <img ref={imgRef} src={src} srcSet={srcSet} {...rest} />;
  }
);
