import { Component, lazy } from 'react';
import { Routes, Route } from '~/components/router/client';
import { ErrorBoundary } from '~/components/system/ErrorBoundary';
import { PageError } from './PageError';
import { PageNotFound } from './PageNotFound';
// import { delay } from '../services/delay';

// function $R(fn: () => Promise<{ default: React.ComponentType<any> }>) {
//   const RouteChunk = lazy(fn);
//   return function AsyncRoute() {
//     return (
//       <ErrorBoundary fallback={PageError}>
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
        <ErrorBoundary fallback={PageError}>
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
export const Customize = $R(() => import(/* webpackChunkName: "route-customize" */ './customize'));
export const Browse = $R(() => import(/* webpackChunkName: "route-browse" */ './browse'));
export const Source = $R(() => import(/* webpackChunkName: "route-source" */ './source'));
export const License = $R(() => import(/* webpackChunkName: "route-license" */ './license'));
export const Sponsors = $R(() => import(/* webpackChunkName: "route-sponsors" */ './sponsors'));
export const Frameworks = $R(() => import(/* webpackChunkName: "route-frameworks" */ './frameworks'));

export const RouterConfig: React.FC<{}> = () => {
  return (
    <Routes>
      <Route path="/" element={Home} />
      <Route path="/guide" element={Guide} />
      <Route path="/download" element={Download} />
      <Route path="/customize" element={Customize} />
      <Route path="/browse/*" element={Browse} />
      <Route path="/source" element={Source} />
      <Route path="/frameworks" element={Frameworks} />
      <Route path="/sponsors" element={Sponsors} />
      <Route path="/license" element={License} />
      <Route path="*" element={PageNotFound} />
    </Routes>
  );
};
