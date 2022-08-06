import { useSyncExternalStore } from 'react';
import { createStore } from '~/services/createStore';

interface Visibility {
  hidden: boolean;
  visibilityState: DocumentVisibilityState;
}

function getVisibility(): Visibility {
  return {
    hidden: document?.hidden ?? false,
    visibilityState: document?.visibilityState ?? 'visible',
  };
}

const store = createStore<Visibility>(getVisibility(), (setState) => {
  function handler() {
    setState((prev) => getVisibility());
  }

  document.addEventListener('visibilitychange', handler);

  return () => {
    document.removeEventListener('visibilitychange', handler);
  };
});

function getServerSnapshot(): Visibility {
  return {
    hidden: false,
    visibilityState: 'visible',
  };
}

export function useDocumentHidden(): Visibility {
  return useSyncExternalStore<Visibility>(store.subscribe, store.getState, getServerSnapshot);
}
