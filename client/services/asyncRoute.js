// @flow
import * as React from 'react';
import Loadable from 'react-loadable';
import nprogress from 'nprogress';
import LoadingComponent from '../components/LoadingPage';
import ErrorBoundary from '../components/ErrorBoundary';
import PageError from '../components/PageError';

type Module = { default: React.ComponentType<any> };
type PromiseModule = Promise<Module>;
type PromiseReactModule = () => PromiseModule;

let routesLoaded: number = 0;

const beginLoad = (promise: Promise<Module>): Promise<Module> => {
  if (routesLoaded > 0) {
    nprogress.start();
  }

  return promise;
};

const endLoad = (): void => {
  routesLoaded += 1;

  // Hide loading bar
  if (nprogress.isStarted()) {
    nprogress.done();
  }
};

const loadErr = (err: Error) => {
  endLoad();
  throw err;
};

const loadSuccess = (Module: Module) => {
  endLoad();
  return Module.default;
};

const asyncRoute = <InputProps: {}>(getComponent: PromiseReactModule): React.ComponentType<InputProps> =>
  Loadable({
    loader: () => beginLoad(getComponent()).then(loadSuccess, loadErr),
    render: (loaded: React.ComponentType<InputProps>, props: InputProps) => {
      const Component = loaded;
      if (process.env.NODE_ENV === 'production') {
        return (
          <ErrorBoundary render={PageError}>
            <Component {...props} />
          </ErrorBoundary>
        );
      } else {
        return <Component {...props} />;
      }
    },
    delay: 2000,
    timeout: 30000,
    loading: LoadingComponent,
  });

export default asyncRoute;
