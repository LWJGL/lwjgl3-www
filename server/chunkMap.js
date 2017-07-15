'use strict';

const chunkMap = (routes, path) => {
  let parts = path.split('/');
  parts.splice(0, 2);

  let route = parts.join('-');

  if (!route.length) {
    // home page
    return [routes.home];
  } else if (routes[route]) {
    // e.g. /features/columns
    return [routes[route]];
  } else if (routes[`${route}-home`]) {
    // e.g. /features
    return [routes[`${route}-home`]];
  }

  return [];
};

module.exports = chunkMap;
