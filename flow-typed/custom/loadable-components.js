import * as React from 'react';

declare module 'loadable-components' {
  declare export type ReactComponentModulePromise = () => Promise<{ default: React.ComponentType<any> }>;

  declare export type LoadingError = Error | null;

  declare export type LoadingComponentProps = {
    error: LoadingError,
  };

  declare export type Loadable = (
    getComponent: ReactComponentModulePromise,
    options: {
      ErrorComponent?: React.ComponentType<{ error: Error | null, ownProps: any }>,
      LoadingComponent?: React.ComponentType<any>,
      render?: ({
        loading: boolean,
        error: LoadingError,
        ownProps: any,
        Component: React.ComponentType<any>,
      }) => React.Node,
    }
  ) => React.ComponentType<any>;

  declare export default Loadable;
}
