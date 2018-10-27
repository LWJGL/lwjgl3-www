// @flow
//$FlowFixMe
import { useState, useEffect } from 'react';

export function getConnection() {
  //$FlowFixMe
  return navigator.connection || navigator.mozConnection || navigator.webkitConnection;
}

export function useNetworkStatus() {
  const [connection, updateNetworkConnection] = useState(getConnection());

  function updateConnectionStatus() {
    updateNetworkConnection(getConnection());
  }
  useEffect(() => {
    connection.addEventListener('change', updateConnectionStatus);
    return () => {
      connection.removeEventListener('change', updateConnectionStatus);
    };
  }, []);

  return connection;
}
