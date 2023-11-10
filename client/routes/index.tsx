import { Component, lazy } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { PageError } from './PageError';
import { setUserAgentData } from '~/services/userAgentData';
// import { sleep } from '../services/sleep';

// function $R(fn: () => Promise<{ default: React.ComponentType<any> }>) {
//   const RouteChunk = lazy(fn);
//   return function AsyncRoute() {
//     return (
//       <ErrorBoundary FallbackComponent={PageError}>
//         <RouteChunk />
//       </ErrorBoundary>
//     );
//   };
// }

function $R(fn: () => Promise<{ default: React.ComponentType<any> }>) {
  const RouteChunk = lazy(fn);
  // // Simulate network delay
  // const RouteChunk = lazy(() => Promise.all([fn, delay(5000)]).then((values) => values[0]));

  return class AsyncRoute extends Component {
    render() {
      return (
        <ErrorBoundary FallbackComponent={PageError}>
          <RouteChunk />
        </ErrorBoundary>
      );
    }

    static preload() {
      fn();
    }
  };
}

// Import causes routes to be code-split
// We have to specify each route name/path in order to be statically analyzable (see Webpack's JSON output)
export const Home = $R(() => import(/* webpackChunkName: "route-home" */ './home'));
export const Guide = $R(() => import(/* webpackChunkName: "route-guide" */ './guide'));
export const Download = $R(() => import(/* webpackChunkName: "route-download" */ './download'));
export const Customize = $R(() =>
  setUserAgentData().then(() => import(/* webpackChunkName: "route-customize" */ './customize')),
);
export const Browse = $R(() => import(/* webpackChunkName: "route-browse" */ './browse'));
export const Source = $R(() => import(/* webpackChunkName: "route-source" */ './source'));
export const License = $R(() => import(/* webpackChunkName: "route-license" */ './license'));
export const Contributors = $R(() => import(/* webpackChunkName: "route-contributors" */ './contributors'));
export const Frameworks = $R(() => import(/* webpackChunkName: "route-frameworks" */ './frameworks'));
// export const Dev = $R(() => import(/* webpackChunkName: "route-dev" */ './dev'));
