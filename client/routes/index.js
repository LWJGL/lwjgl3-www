// @flow
import { getSuspenseRoute } from '../components/routes/getSuspenseRoute';
import { getAsyncRoute } from '../components/routes/getAsyncRoute';

// Import causes routes to be code-split
// We have to specify each route name/path in order to be statically analyzable (see Webpack's JSON output)

export const Home = getSuspenseRoute(() => import(/* webpackChunkName: "route-home" */ './home'));
export const Guide = getSuspenseRoute(() => import(/* webpackChunkName: "route-guide" */ './guide'));
export const Download = getSuspenseRoute(() => import(/* webpackChunkName: "route-download" */ './download'));
export const Customize = getSuspenseRoute(() => import(/* webpackChunkName: "route-customize" */ './customize'));
export const Browse = getAsyncRoute(() => import(/* webpackChunkName: "route-browse" */ './browse'));
export const Source = getSuspenseRoute(() => import(/* webpackChunkName: "route-source" */ './source'));
export const License = getSuspenseRoute(() => import(/* webpackChunkName: "route-license" */ './license'));
