'use strict';

const chunkMap = (routes, path) => {
  let parts = path.split('/');
  parts.shift();

  const route = parts.join('-');

  if (!route.length) {
    return [routes.home];
  } else if (routes[route]) {
    return [routes[route]];
  } else if (routes[`${route}-home`]) {
    return [routes[`${route}-home`]];
  }

  return [];
};

module.exports = chunkMap;
