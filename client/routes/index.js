// @flow
import * as React from 'react';
import loadable from 'loadable-components';
import type { ReactComponentModulePromise, Loadable } from 'loadable-components';
import { LoadingPage /*, LOADING_TIMEOUT*/ } from '../components/LoadingPage';
// import { timeout } from 'promise-timeout';

const loadableOptions = {
  render: ({ Component, error, loading, ownProps }) => {
    if (loading || error) {
      return <LoadingPage error={error} />;
    }
    return <Component {...ownProps} />;
  },
};

const AsyncRoute = (loader: ReactComponentModulePromise): Loadable =>
  loadable(
    // timeout(loader, LOADING_TIMEOUT)
    loader,
    loadableOptions
  );

// Import causes routes to be code-split
// We have to specify each route name/path in order to be statically analyzed by webpack
export const Home = AsyncRoute(() => import(/* webpackChunkName: "route-home" */ './home'));
export const Guide = AsyncRoute(() => import(/* webpackChunkName: "route-guide" */ './guide'));
export const Download = AsyncRoute(() => import(/* webpackChunkName: "route-download" */ './download'));
export const Customize = AsyncRoute(() => import(/* webpackChunkName: "route-customize" */ './customize'));
export const Browse = AsyncRoute(() => import(/* webpackChunkName: "route-browse" */ './browse'));
export const Source = AsyncRoute(() => import(/* webpackChunkName: "route-source" */ './source'));
export const License = AsyncRoute(() => import(/* webpackChunkName: "route-license" */ './license'));
