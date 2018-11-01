import { useState, useEffect } from 'react';

export function getVisibility() {
  return document.visibilityState;
}

export function useDocumentVisibility() {
  const [documentVisibility, setDocumentVisibility] = useState(getVisibility());

  function handleVisibilityChange() {
    setDocumentVisibility(getVisibility());
  }

  useEffect(() => {
    window.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return documentVisibility;
}
