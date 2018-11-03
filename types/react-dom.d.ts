import * as ReactDOM from 'react-dom';

declare module 'react-dom' {
  type RootOptions = {
    hydrate?: boolean;
  };

  class ReactRoot {
    constructor(container: HTMLElement, isConcurrent: boolean, hydrate: boolean);
    render(children: React.ReactNode, callback?: () => any): any;
    unmount(callback?: () => any): any;
  }

  function createRoot(rootElement: HTMLElement, options?: RootOptions): ReactRoot;
}
