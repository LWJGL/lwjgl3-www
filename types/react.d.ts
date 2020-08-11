import * as react from 'react';

// Declare missing types for @types/react/experimental
declare module 'react' {
  export function unstable_useOpaqueIdentifier(): string;
}
