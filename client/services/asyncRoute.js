import React from 'react';
import Loadable from 'react-loadable';
import nprogress from 'nprogress';
import LoadingComponent from '../components/LoadingPage';
import ErrorBoundary from '../components/ErrorBoundary';
import PageError from '../components/PageError';

type Module = { default: any };
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
  if (nprogress.status) {
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

const asyncRoute = (getComponent: PromiseReactModule) =>
  Loadable({
    loader: () => beginLoad(getComponent()).then(loadSuccess, loadErr),
    render: <Props: {}>(loaded: Class<React$Component<any, Props, any>>, props: Props) => {
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
