import { lazy } from 'react';

function getLazy(loader: ComponentImport) {
  const LazyRoute = lazy(loader);

  // // Simulate network latency
  // const LazyRoute = lazy(async () => {
  //   await delay(1000);
  //   return await loader();
  // });

  //@ts-ignore
  LazyRoute.preload = loader;
  return LazyRoute;
}

// Import causes routes to be code-split
// We have to specify each route name/path in order to be statically analyzable (see Webpack's JSON output)

export const Home = getLazy(() => import(/* webpackChunkName: "route-home" */ './home'));
export const Guide = getLazy(() => import(/* webpackChunkName: "route-guide" */ './guide'));
export const Download = getLazy(() => import(/* webpackChunkName: "route-download" */ './download'));
export const Customize = getLazy(() => import(/* webpackChunkName: "route-customize" */ './customize'));
export const Browse = getLazy(() => import(/* webpackChunkName: "route-browse" */ './browse'));
export const Source = getLazy(() => import(/* webpackChunkName: "route-source" */ './source'));
export const License = getLazy(() => import(/* webpackChunkName: "route-license" */ './license'));
