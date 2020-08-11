import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  let [onlineStatus, setOnlineStatus] = useState(globalThis?.navigator?.onLine ?? true);

  useEffect(() => {
    const goOnline = () => {
      setOnlineStatus(true);
    };
    const goOffline = () => {
      setOnlineStatus(false);
    };

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  return onlineStatus;
}
