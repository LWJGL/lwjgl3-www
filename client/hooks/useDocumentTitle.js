// @flow
//$FlowFixMe
import { useEffect } from 'react';

export function useDocumentTitle(title?: string) {
  useEffect(
    () => {
      document.title = title != null && title.length > 0 ? `${title} - LWJGL` : 'LWJGL - Lightweight Java Game Library';
    },
    [title]
  );
}
