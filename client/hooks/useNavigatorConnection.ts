import { useSyncExternalStore } from 'react';
import { createStore } from '~/services/createStore';

interface NetworkInformationData {
  type: ConnectionType;
  effectiveType: EffectiveConnectionType;
  downlink: number;
  downlinkMax: number;
  saveData: boolean;
}

export function getNetworkInformation(): NetworkInformationData {
  if ('connection' in navigator) {
    const { type, effectiveType, downlink, downlinkMax, saveData } = navigator.connection;

    return {
      type: type ?? 'ethernet',
      effectiveType: effectiveType ?? '4g',
      downlink: downlink ?? 8,
      downlinkMax: downlinkMax ?? 24,
      saveData: saveData ?? false,
    };
  } else {
    return {
      type: 'ethernet',
      effectiveType: '4g',
      downlink: 8,
      downlinkMax: 24,
      saveData: false, // TODO: get value from header if running on server
    };
  }
}

const store = createStore<NetworkInformationData>(getNetworkInformation(), (setState) => {
  function onChange() {
    setState((prev) => getNetworkInformation());
  }

  if ('connection' in navigator) {
    //@ts-expect-error
    navigator.connection.addEventListener('change', onChange);
    return () => {
      //@ts-expect-error
      navigator.connection.removeEventListener('change', onChange);
    };
  }
});

export function useNavigatorConnection() {
  return useSyncExternalStore<NetworkInformationData>(store.subscribe, store.getState, store.getState);
}
