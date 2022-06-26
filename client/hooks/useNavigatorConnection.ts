import { useSyncExternalStore } from 'react';

interface NetworkInformationData {
  type: ConnectionType;
  effectiveType: EffectiveConnectionType;
  downlink: number;
  downlinkMax: number;
  saveData: boolean;
}

function populateNetworkInformation(): NetworkInformationData {
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

let networkInformation: NetworkInformationData = populateNetworkInformation();

function subscribe(callback: EventListener) {
  if ('connection' in navigator) {
    const onChange = (e: Event) => {
      networkInformation = populateNetworkInformation();
      callback(e);
    };

    const connection = navigator.connection;
    connection.addEventListener('change', onChange);
    return () => {
      connection.removeEventListener('change', onChange);
    };
  } else {
    return () => {};
  }
}

function getState() {
  return networkInformation;
}

export function useNavigatorConnection() {
  return useSyncExternalStore<NetworkInformationData>(subscribe, getState, getState);
}
