import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { NotFound } from '../routes/error/NotFound';
// import { delay } from '../services/delay';

function $R(fn: () => Promise<any>) {
  if (FLAG_PRODUCTION) {
    return lazy(fn);
  } else {
    // ! If we don't wrap the route, all chunks are loaded on mount
    const Element = lazy(fn);
    function AsyncRoute() {
      return <Element />;
    }
    return AsyncRoute;
  }
}

// Import causes routes to be code-split
// We have to specify each route name/path in order to be statically analyzable (see Webpack's JSON output)
const Home = $R(() => import(/* webpackChunkName: "route-home" */ './home'));
const Guide = $R(() => import(/* webpackChunkName: "route-guide" */ './guide'));
const Download = $R(() => import(/* webpackChunkName: "route-download" */ './download'));
export const CustomizePreload = () => import(/* webpackChunkName: "route-customize" */ './customize');
export const BrowsePreload = () => import(/* webpackChunkName: "route-browse" */ './browse');
const Customize = $R(CustomizePreload);
const Browse = $R(BrowsePreload);
const Source = $R(() => import(/* webpackChunkName: "route-source" */ './source'));
const License = $R(() => import(/* webpackChunkName: "route-license" */ './license'));
const Sponsors = $R(() => import(/* webpackChunkName: "route-sponsors" */ './sponsors'));
const Frameworks = $R(() => import(/* webpackChunkName: "route-frameworks" */ './frameworks'));

// // Simulate network delay
// export const Download = lazy(() =>
//   Promise.all([import(/* webpackChunkName: "route-download" */ './download'), delay(5000)]).then((values) => values[0])
// );

export const RouterConfig: React.FC<{}> = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/guide" element={<Guide />} />
      <Route path="/download" element={<Download />} />
      <Route path="/customize" element={<Customize />} />
      <Route path="/browse/*" element={<Browse />} />
      <Route path="/source" element={<Source />} />
      <Route path="/frameworks" element={<Frameworks />} />
      <Route path="/sponsors" element={<Sponsors />} />
      <Route path="/license" element={<License />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
