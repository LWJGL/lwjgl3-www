import { lazy } from 'react';
// import { delay } from '../services/delay';

function $R(fn: () => Promise<any>) {
  if (FLAG_PRODUCTION) {
    return lazy(fn);
  } else {
    const Element = lazy(fn);
    return function AsyncRoute() {
      return <Element />;
    };
  }
}

// Import causes routes to be code-split
// We have to specify each route name/path in order to be statically analyzable (see Webpack's JSON output)

export const Home = $R(() => import(/* webpackChunkName: "route-home" */ './home'));
export const Guide = $R(() => import(/* webpackChunkName: "route-guide" */ './guide'));
export const Download = $R(() => import(/* webpackChunkName: "route-download" */ './download'));
export const CustomizePreload = () => import(/* webpackChunkName: "route-customize" */ './customize');
export const Customize = $R(CustomizePreload);
export const BrowsePreload = () => import(/* webpackChunkName: "route-browse" */ './browse');
export const Browse = $R(BrowsePreload);
export const Source = $R(() => import(/* webpackChunkName: "route-source" */ './source'));
export const License = $R(() => import(/* webpackChunkName: "route-license" */ './license'));
export const Sponsors = $R(() => import(/* webpackChunkName: "route-sponsors" */ './sponsors'));
export const Frameworks = $R(() => import(/* webpackChunkName: "route-frameworks" */ './frameworks'));

// // Simulate network delay
// export const Download = lazy(() => {
//   return Promise.all([import(/* webpackChunkName: "route-download" */ './download'), delay(5000)]).then(
//     (values) => values[0]
//   );
// });
