// @flow
//$FlowFixMe
import { useEffect, useRef } from 'react';

export function useMetaDescription(description?: string) {
  const meta = useRef(null);

  useEffect(
    () => {
      if (description != null && description.length > 0) {
        if (meta.current === null) {
          //$FlowFixMe
          let metatag = document.head.querySelector('meta[name=description]');
          if (metatag === null) {
            metatag = document.createElement('meta');
            metatag.setAttribute('name', 'description');
            //$FlowFixMe
            document.head.appendChild(metatag);
          }
          meta.current = metatag;
        }
        meta.current.setAttribute('content', description);
      }
    },
    [description]
  );
}
