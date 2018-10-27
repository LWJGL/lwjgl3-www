// @flow
//$FlowFixMe
import { useState, useEffect } from 'react';

export function useLocalStorage(key: string) {
  const [localState, updateLocalState] = useState(localStorage[key]);

  function syncLocalStorage(event) {
    if (event.key === key) {
      updateLocalState(event.newValue);
    }
  }

  useEffect(() => {
    window.addEventListener('storage', syncLocalStorage);
    return () => {
      window.removeEventListener('storage', syncLocalStorage);
    };
  }, []);

  return localState;
}
