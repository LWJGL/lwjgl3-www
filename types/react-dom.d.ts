import { unstable_createRoot, unstable_createSyncRoot } from 'react-dom';

// Fix @types/react-dom definitions for react-dom@experimental
declare module 'react-dom' {
  export const createSyncRoot: typeof unstable_createSyncRoot;
  export const createRoot: typeof unstable_createRoot;
}
