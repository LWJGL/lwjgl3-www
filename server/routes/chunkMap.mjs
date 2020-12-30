export default function chunkMap(routes, path) {
  if (path === '/') {
    return routes.home;
  }

  const parts = path.split('/');
  if (routes[parts[1]] !== undefined) {
    return routes[parts[1]];
  }

  /*
  parts.shift();
  const route = parts.join('-');

  if (!route.length) {
    return routes.home;
  } else if (routes[route]) {
    return routes[route];
  } else if (routes[`${route}-home`]) {
    return routes[`${route}-home`];
  }
  */

  return null;
}
