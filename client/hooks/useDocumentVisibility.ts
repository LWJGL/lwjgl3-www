import { useState, useEffect } from 'react';

export function useDocumentVisibility() {
  const [documentVisibility, setDocumentVisibility] = useState(document?.visibilityState ?? 'visible');

  useEffect(() => {
    const handler = () => {
      setDocumentVisibility(document.visibilityState);
    };
    document.addEventListener('visibilitychange', handler);
    return () => {
      document.removeEventListener('visibilitychange', handler);
    };
  }, []);

  return documentVisibility;
}
