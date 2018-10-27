// @flow
//$FlowFixMe
import { useEffect } from 'react';

export default function useDocumentTitle(title: string) {
  useEffect(
    () => {
      document.title = title;
    },
    [title]
  );
}
