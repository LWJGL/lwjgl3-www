// @flow
import * as React from 'react';
//$FlowFixMe
import { lazy, unstable_Suspense as Suspense } from 'react';
import { CircularProgress } from '../components/CircularProgress';

type ComponentImport = () => Promise<{ default: React.ComponentType<any> }>;

const LoadingPage = () => (
  <div className="text-center" style={{ padding: '5rem 0', minHeight: 'calc(100vh - 4rem)' }}>
    <CircularProgress size={128} thickness={2} />
  </div>
);

const getAsyncRoute = (loader: ComponentImport) => {
  const AsyncRoute = lazy(loader);

  class Route extends React.Component<any> {
    static preload() {
      loader();
    }

    render() {
      return (
        <Suspense maxDuration={750} fallback={<LoadingPage />}>
          <AsyncRoute {...this.props} />
        </Suspense>
      );
    }
  }

  return Route;
};

// Import causes routes to be code-split
// We have to specify each route name/path in order to be statically analyzed by webpack
export const Home = getAsyncRoute(() => import(/* webpackChunkName: "route-home" */ './home'));
export const Guide = getAsyncRoute(() => import(/* webpackChunkName: "route-guide" */ './guide'));
export const Download = getAsyncRoute(() => import(/* webpackChunkName: "route-download" */ './download'));
export const Customize = getAsyncRoute(() => import(/* webpackChunkName: "route-customize" */ './customize'));
export const Browse = getAsyncRoute(() => import(/* webpackChunkName: "route-browse" */ './browse'));
export const Source = getAsyncRoute(() => import(/* webpackChunkName: "route-source" */ './source'));
export const License = getAsyncRoute(() => import(/* webpackChunkName: "route-license" */ './license'));
