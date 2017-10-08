// @flow
import * as React from 'react';
import Loadable from 'react-loadable';
import LoadingPage from '../components/LoadingPage';
import ErrorBoundary from '../components/ErrorBoundary';
import PageError from '../components/PageError';

type Module = { default: React.ComponentType<any> };
type PromiseModule = Promise<Module>;
type PromiseReactModule = () => PromiseModule;

const loadErr = (err: Error) => {
  throw err;
};

const loadSuccess = (Module: Module) => {
  return Module.default;
};

const asyncRoute = <InputProps: {}>(getComponent: PromiseReactModule): React.ComponentType<InputProps> =>
  Loadable({
    loader: () => getComponent().then(loadSuccess, loadErr),
    render: (Component: React.ComponentType<InputProps>, props: InputProps) => {
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
    loading: LoadingPage,
  });

export default asyncRoute;
