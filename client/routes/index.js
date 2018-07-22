// @flow
import * as React from 'react';
import { renderAsync, type ComponentImport, type AsyncRenderOptions } from '../services/renderAsync';
import { LoadingPage } from '../components/LoadingPage';

const render = ({ Component, error, loading, ownProps }: AsyncRenderOptions): React.Node => {
  if (Component !== null) {
    return <Component {...ownProps} />;
  }
  return <LoadingPage error={error} />;
};

const AsyncRoute = (loader: ComponentImport) => renderAsync(loader, render);

// Import causes routes to be code-split
// We have to specify each route name/path in order to be statically analyzed by webpack
export const Home = AsyncRoute(() => import(/* webpackChunkName: "route-home" */ './home'));
export const Guide = AsyncRoute(() => import(/* webpackChunkName: "route-guide" */ './guide'));
export const Download = AsyncRoute(() => import(/* webpackChunkName: "route-download" */ './download'));
export const Customize = AsyncRoute(() => import(/* webpackChunkName: "route-customize" */ './customize'));
export const Browse = AsyncRoute(() => import(/* webpackChunkName: "route-browse" */ './browse'));
export const Source = AsyncRoute(() => import(/* webpackChunkName: "route-source" */ './source'));
export const License = AsyncRoute(() => import(/* webpackChunkName: "route-license" */ './license'));
