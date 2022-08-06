import { useEffect, useRef } from 'react';

export function useMetaDescription(description?: string) {
  const meta = useRef<HTMLMetaElement | null>(null);

  useEffect(() => {
    if (description != null && description.length > 0) {
      if (meta.current === null) {
        let metatag: HTMLMetaElement | null = document.head.querySelector('meta[name=description]');
        if (metatag === null) {
          metatag = document.createElement('meta');
          metatag.setAttribute('name', 'description');
          document.head.append(metatag);
        }
        meta.current = metatag;
      }
      meta.current.setAttribute('content', description);
    }
  }, [description]);
}
