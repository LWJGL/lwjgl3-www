import { useState, useEffect } from 'react';

export function useDocumentHidden() {
  const [hidden, setHidden] = useState(document?.hidden ?? false);

  useEffect(() => {
    const handler = () => {
      setHidden(document.hidden);
    };
    document.addEventListener('visibilitychange', handler);
    return () => {
      document.removeEventListener('visibilitychange', handler);
    };
  }, []);

  return hidden;
}
