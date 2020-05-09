import { useEffect } from 'react';
import { useForceUpdate } from './useForceUpdate';

export function useNetworkStatus() {
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    if (navigator.connection !== undefined) {
      const connection = navigator.connection;
      connection.addEventListener('change', forceUpdate);
      return () => {
        connection.removeEventListener('change', forceUpdate);
      };
    }
  }, [forceUpdate]);

  return navigator.connection;
}
