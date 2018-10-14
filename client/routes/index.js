// @flow
import { getAsyncRoute } from './getAsyncRoute';

// Import causes routes to be code-split
// We have to specify each route name/path in order to be statically analyzable (see Webpack's JSON output)

export const Home = getAsyncRoute(() => import(/* webpackChunkName: "route-home" */ './home'));
export const Guide = getAsyncRoute(() => import(/* webpackChunkName: "route-guide" */ './guide'));
export const Download = getAsyncRoute(() => import(/* webpackChunkName: "route-download" */ './download'));
export const Customize = getAsyncRoute(() => import(/* webpackChunkName: "route-customize" */ './customize'));
export const Browse = getAsyncRoute(() => import(/* webpackChunkName: "route-browse" */ './browse'));
export const Source = getAsyncRoute(() => import(/* webpackChunkName: "route-source" */ './source'));
export const License = getAsyncRoute(() => import(/* webpackChunkName: "route-license" */ './license'));
