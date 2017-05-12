import Loadable from 'react-loadable';
import nprogress from 'nprogress';
import LoadingComponent from 'components/LoadingPage';

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
    LoadingComponent,
  });

export default asyncRoute;
