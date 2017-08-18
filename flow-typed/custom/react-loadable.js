import * as React from 'react';

declare module 'react-loadable' {
  declare export type LoadingComponentProps = {
    isLoading: boolean,
    timedOut: boolean,
    pastDelay: boolean,
    error: Error | null,
  };

  declare export type LoadingComponent = React.ComponentType<LoadingComponentProps>;

  declare type ReactLoadable = <Props: {}>(opts: {
    loader: () => Promise<React.ComponentType<Props>>,
    loading: LoadingComponent,
    render?: (loaded: React.ComponentType<Props>, props: Props) => React.Element<any>,
    delay?: number,
    timeout?: number,
  }) => React.ComponentType<Props>;

  declare export default ReactLoadable
}
