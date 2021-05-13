import * as react from 'react';
import * as ReactDOM from 'react-dom';

declare module 'react-dom' {
  interface HydrationOptions {
    onHydrated?(suspenseInstance: Comment): void;
    onDeleted?(suspenseInstance: Comment): void;
    mutableSources?: any[];
  }

  interface RootOptions {
    hydrate?: boolean;
    hydrationOptions?: HydrationOptions;
    unstable_strictMode?: boolean;
    unstable_concurrentUpdatesByDefault?: boolean;
  }

  interface Root {
    render(children: React.ReactChild | React.ReactNodeArray, callback?: () => void): void;
    unmount(callback?: () => void): void;
  }

  function createRoot(container: Element | Document | DocumentFragment | Comment, options?: RootOptions): Root;

  function unstable_batchedUpdates<A, R>(fn: (a: A) => R, a: A): R;
  function unstable_flushControlled(callback: () => void): void;
  // function unstable_renderSubtreeIntoContainer();
  function unstable_scheduleHydration(target: Element | Document | DocumentFragment | Comment): void;
}
