import { lazy } from 'react';

// Import causes routes to be code-split
// We have to specify each route name/path in order to be statically analyzable (see Webpack's JSON output)

export const Home = lazy(() => import(/* webpackChunkName: "route-home" */ './home'));
export const Guide = lazy(() => import(/* webpackChunkName: "route-guide" */ './guide'));
export const Download = lazy(() => import(/* webpackChunkName: "route-download" */ './download'));
export const CustomizePreload = () => import(/* webpackChunkName: "route-customize" */ './customize');
export const Customize = lazy(CustomizePreload);
export const BrowsePreload = () => import(/* webpackChunkName: "route-browse" */ './browse');
export const Browse = lazy(BrowsePreload);
export const Source = lazy(() => import(/* webpackChunkName: "route-source" */ './source'));
export const License = lazy(() => import(/* webpackChunkName: "route-license" */ './license'));
