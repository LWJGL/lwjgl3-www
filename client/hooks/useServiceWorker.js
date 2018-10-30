// @flow
//$FlowFixMe
import { useState, useEffect } from 'react';
import { isPending, update, addListener, removeListener } from '../services/serviceWorker';

export function useServiceWorker() {
  let [pending, setPending] = useState(isPending());

  useEffect(() => {
    addListener(setPending);
    return () => {
      removeListener(setPending);
    };
  }, []);

  return [pending, update];
}
