import { useState, useEffect } from 'react';

export function getConnection(): NetworkInformation | undefined {
  return navigator.connection;
}

export function useNetworkStatus() {
  const [connection, updateNetworkConnection] = useState(getConnection);

  function updateConnectionStatus() {
    updateNetworkConnection(getConnection);
  }

  useEffect(() => {
    if (connection !== undefined) {
      //@ts-ignore
      connection.addEventListener('change', updateConnectionStatus);
      return () => {
        //@ts-ignore
        connection.removeEventListener('change', updateConnectionStatus);
      };
    }
  }, []);

  return connection;
}
