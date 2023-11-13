import {
  createContext,
  use,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  isValidElement,
  // createElement,
  Fragment,
  Children,
} from 'react';
import { Action as NavigationType, parsePath } from 'history';
import type { History, Location, Path, To } from 'history';

///////////////////////////////////////////////////////////////////////////////
// CONTEXT
///////////////////////////////////////////////////////////////////////////////

/**
 * A Navigator is a "location changer"; it's how you get to different locations.
 *
 * Every history instance conforms to the Navigator interface, but the
 * distinction is useful primarily when it comes to the low-level <Router> API
 * where both the location and a navigator must be provided separately in order
 * to avoid "tearing" that may occur in a suspense-enabled app if the action
 * and/or location were to be read directly from the history instance.
 */
export type Navigator = Omit<History, 'action' | 'location' | 'back' | 'forward' | 'listen' | 'block'>;

interface NavigationContextObject {
  basename: string;
  navigator: Navigator;
  static: boolean;
  pending: boolean;
}

const NavigationContext = createContext<NavigationContextObject>(null!);

if (!FLAG_PRODUCTION) {
  NavigationContext.displayName = 'Navigation';
}

interface LocationContextObject {
  location: Location;
  navigationType: NavigationType;
}

const LocationContext = createContext<LocationContextObject>(null!);

if (!FLAG_PRODUCTION) {
  LocationContext.displayName = 'Location';
}

interface RouteContextObject {
  outlet: React.ReactElement | null;
  matches: RouteMatch[];
}

const RouteContext = createContext<RouteContextObject>({
  outlet: null,
  matches: [],
});

if (!FLAG_PRODUCTION) {
  RouteContext.displayName = 'Route';
}

///////////////////////////////////////////////////////////////////////////////
// COMPONENTS
///////////////////////////////////////////////////////////////////////////////

export interface OutletProps {}

/**
 * Renders the child route's element, if there is one.
 *
 * @see https://reactrouter.com/docs/en/v6/api#outlet
 */
export function Outlet(_props: OutletProps): React.ReactElement | null {
  return useOutlet();
}

export interface RouteProps {
  caseSensitive?: boolean;
  children?: React.ReactNode;
  element?: React.ReactElement | null;
  index?: boolean;
  path?: string;
}

export interface PathRouteProps {
  caseSensitive?: boolean;
  children?: React.ReactNode;
  element?: React.ReactElement | null;
  index?: false;
  path: string;
}

export interface LayoutRouteProps {
  children?: React.ReactNode;
  element?: React.ReactElement | null;
}

export interface IndexRouteProps {
  element?: React.ReactElement | null;
  index: true;
}

/**
 * Declares an element that should be rendered at a certain URL path.
 *
 * @see https://reactrouter.com/docs/en/v6/api#route
 */
export function Route(_props: PathRouteProps | LayoutRouteProps | IndexRouteProps): React.ReactElement | null {
  return null;
}

export interface RouterProps {
  basename?: string;
  children?: React.ReactNode;
  location: Partial<Location> | string;
  navigationType?: NavigationType;
  navigator: Navigator;
  static?: boolean;
  pending?: boolean;
}

/**
 * Provides location context for the rest of the app.
 *
 * Note: You usually won't render a <Router> directly. Instead, you'll render a
 * router that is more specific to your environment such as a <BrowserRouter>
 * in web browsers or a <StaticRouter> for server rendering.
 *
 * @see https://reactrouter.com/docs/en/v6/api#router
 */
export function Router({
  basename: basenameProp = '/',
  children = null,
  location: locationProp,
  navigationType = NavigationType.Pop,
  navigator,
  static: staticProp = false,
  pending = false,
}: RouterProps): React.ReactElement | null {
  let basename = normalizePathname(basenameProp);
  let navigationContext = useMemo(
    () => ({ basename, navigator, static: staticProp, pending }),
    [basename, navigator, staticProp, pending],
  );

  if (typeof locationProp === 'string') {
    locationProp = parsePath(locationProp);
  }

  let { pathname = '/', search = '', hash = '', state = null, key = 'default' } = locationProp;

  let location = useMemo(() => {
    let trailingPathname = stripBasename(pathname, basename);

    if (trailingPathname == null) {
      return null;
    }

    return {
      pathname: trailingPathname,
      search,
      hash,
      state,
      key,
    };
  }, [basename, pathname, search, hash, state, key]);

  if (location == null) {
    return null;
  }

  return (
    <NavigationContext.Provider value={navigationContext}>
      <LocationContext.Provider children={children} value={{ location, navigationType }} />
    </NavigationContext.Provider>
  );
}

export interface RoutesProps {
  children?: React.ReactNode;
  location?: Partial<Location> | string;
}

/**
 * A container for a nested tree of <Route> elements that renders the branch
 * that best matches the current location.
 *
 * @see https://reactrouter.com/docs/en/v6/api#routes
 */
export function Routes({ children, location }: RoutesProps): React.ReactElement | null {
  return useRoutes(createRoutesFromChildren(children), location);
}

///////////////////////////////////////////////////////////////////////////////
// HOOKS
///////////////////////////////////////////////////////////////////////////////

/**
 * Returns the full href for the given "to" value. This is useful for building
 * custom links that are also accessible and preserve right-click behavior.
 *
 * @see https://reactrouter.com/docs/en/v6/api#usehref
 */
export function useHref(to: To): string {
  let { basename, navigator } = use(NavigationContext);
  let { hash, pathname, search } = useResolvedPath(to);

  let joinedPathname = pathname;
  if (basename !== '/') {
    let toPathname = getToPathname(to);
    let endsWithSlash = toPathname != null && toPathname.endsWith('/');
    joinedPathname = pathname === '/' ? basename + (endsWithSlash ? '/' : '') : joinPaths([basename, pathname]);
  }

  return navigator.createHref({ pathname: joinedPathname, search, hash });
}

/**
 * Returns true if this component is a descendant of a <Router>.
 *
 * @see https://reactrouter.com/docs/en/v6/api#useinroutercontext
 */
export function useInRouterContext(): boolean {
  return use(LocationContext) != null;
}

/**
 * Returns the current location object, which represents the current URL in web
 * browsers.
 *
 * Note: If you're using this it may mean you're doing some of your own
 * "routing" in your app, and we'd like to know what your use case is. We may
 * be able to provide something higher-level to better suit your needs.
 *
 * @see https://reactrouter.com/docs/en/v6/api#uselocation
 */
export function useLocation(): Location {
  return use(LocationContext).location;
}

/**
 * Returns the current navigation action which describes how the router came to
 * the current location, either by a pop, push, or replace on the history stack.
 *
 * @see https://reactrouter.com/docs/en/v6/api#usenavigationtype
 */
export function useNavigationType(): NavigationType {
  return use(LocationContext).navigationType;
}

/**
 * Returns true if the router is pending a location update.
 */
export function useLocationPending(): boolean {
  return use(NavigationContext).pending;
}

/**
 * Returns true if the URL for the given "to" value matches the current URL.
 * This is useful for components that need to know "active" state, e.g.
 * <NavLink>.
 *
 * @see https://reactrouter.com/docs/en/v6/api#usematch
 */
export function useMatch<ParamKey extends string = string>(pattern: PathPattern | string): PathMatch<ParamKey> | null {
  return matchPath(pattern, useLocation().pathname);
}

/**
 * The interface for the navigate() function returned from useNavigate().
 */
export interface NavigateFunction {
  (to: To, options?: NavigateOptions): void;
  (delta: number): void;
}

export interface NavigateOptions {
  replace?: boolean;
  state?: any;
}

/**
 * Returns an imperative method for changing the location. Used by <Link>s, but
 * may also be used by other elements to change the location.
 *
 * @see https://reactrouter.com/docs/en/v6/api#usenavigate
 */
export function useNavigate(): NavigateFunction {
  let { basename, navigator } = use(NavigationContext);
  let { matches } = use(RouteContext);
  let { pathname: locationPathname } = useLocation();

  let routePathnamesJson = JSON.stringify(matches.map((match) => match.pathnameBase));

  let activeRef = useRef(false);
  useEffect(() => {
    activeRef.current = true;
  });

  let navigate: NavigateFunction = useCallback(
    (to: To | number, options: { replace?: boolean; state?: any } = {}) => {
      if (!activeRef.current) return;

      if (typeof to === 'number') {
        navigator.go(to);
        return;
      }

      let path = resolveTo(to, JSON.parse(routePathnamesJson), locationPathname);

      if (basename !== '/') {
        path.pathname = joinPaths([basename, path.pathname]);
      }

      (!!options.replace ? navigator.replace : navigator.push)(path, options.state);
    },
    [basename, navigator, routePathnamesJson, locationPathname],
  );

  return navigate;
}

/**
 * Returns the element for the child route at this level of the route
 * hierarchy. Used internally by <Outlet> to render child routes.
 *
 * @see https://reactrouter.com/docs/en/v6/api#useoutlet
 */
export function useOutlet(): React.ReactElement | null {
  return use(RouteContext).outlet;
}

/**
 * Returns an object of key/value pairs of the dynamic params from the current
 * URL that were matched by the route path.
 *
 * @see https://reactrouter.com/docs/en/v6/api#useparams
 */
export function useParams<Key extends string = string>(): Readonly<Params<Key>> {
  let { matches } = use(RouteContext);
  let routeMatch = matches[matches.length - 1];
  return routeMatch ? (routeMatch.params as any) : {};
}

/**
 * Resolves the pathname of the given `to` value against the current location.
 *
 * @see https://reactrouter.com/docs/en/v6/api#useresolvedpath
 */
export function useResolvedPath(to: To): Path {
  let { matches } = use(RouteContext);
  let { pathname: locationPathname } = useLocation();

  let routePathnamesJson = JSON.stringify(matches.map((match) => match.pathnameBase));

  return useMemo(
    () => resolveTo(to, JSON.parse(routePathnamesJson), locationPathname),
    [to, routePathnamesJson, locationPathname],
  );
}

/**
 * Returns the element of the route that matched the current location, prepared
 * with the correct context to render the remainder of the route tree. Route
 * elements in the tree must render an <Outlet> to render their child route's
 * element.
 *
 * @see https://reactrouter.com/docs/en/v6/api#useroutes
 */
export function useRoutes(routes: RouteObject[], locationArg?: Partial<Location> | string): React.ReactElement | null {
  let { matches: parentMatches } = use(RouteContext);
  let routeMatch = parentMatches[parentMatches.length - 1];
  let parentParams = routeMatch ? routeMatch.params : {};
  // let parentPathname = routeMatch ? routeMatch.pathname : '/';
  let parentPathnameBase = routeMatch ? routeMatch.pathnameBase : '/';
  // let parentRoute = routeMatch && routeMatch.route;

  let locationFromContext = useLocation();

  let location;
  if (locationArg) {
    let parsedLocationArg = typeof locationArg === 'string' ? parsePath(locationArg) : locationArg;

    location = parsedLocationArg;
  } else {
    location = locationFromContext;
  }

  let pathname = location.pathname || '/';
  let remainingPathname = parentPathnameBase === '/' ? pathname : pathname.slice(parentPathnameBase.length) || '/';
  let matches = matchRoutes(routes, { pathname: remainingPathname });

  return _renderMatches(
    matches &&
      matches.map((match) =>
        Object.assign({}, match, {
          params: Object.assign({}, parentParams, match.params),
          pathname: joinPaths([parentPathnameBase, match.pathname]),
          pathnameBase:
            match.pathnameBase === '/' ? parentPathnameBase : joinPaths([parentPathnameBase, match.pathnameBase]),
        }),
      ),
    parentMatches,
  );
}

///////////////////////////////////////////////////////////////////////////////
// UTILS
///////////////////////////////////////////////////////////////////////////////

/**
 * Creates a route config from a React "children" object, which is usually
 * either a `<Route>` element or an array of them. Used internally by
 * `<Routes>` to create a route config from its children.
 *
 * @see https://reactrouter.com/docs/en/v6/api#createroutesfromchildren
 */
export function createRoutesFromChildren(children: React.ReactNode): RouteObject[] {
  let routes: RouteObject[] = [];

  Children.forEach(children, (element) => {
    if (!isValidElement(element)) {
      // Ignore non-elements. This allows people to more easily inline
      // conditionals in their route config.
      return;
    }

    if (element.type === Fragment) {
      // Transparently support React.Fragment and its children.
      routes.push.apply(routes, createRoutesFromChildren(element.props.children));
      return;
    }

    let route: RouteObject = {
      caseSensitive: element.props.caseSensitive,
      element: element.props.element,
      index: element.props.index,
      path: element.props.path,
    };

    if (element.props.children) {
      route.children = createRoutesFromChildren(element.props.children);
    }

    routes.push(route);
  });

  return routes;
}

/**
 * The parameters that were parsed from the URL path.
 */
export type Params<Key extends string = string> = {
  readonly [key in Key]: string | undefined;
};

/**
 * A route object represents a logical route, with (optionally) its child
 * routes organized in a tree-like structure.
 */
export interface RouteObject {
  caseSensitive?: boolean;
  children?: RouteObject[];
  element?: React.ReactNode;
  index?: boolean;
  path?: string;
}

/**
 * Returns a path with params interpolated.
 *
 * @see https://reactrouter.com/docs/en/v6/api#generatepath
 */
export function generatePath(path: string, params: Params = {}): string {
  return path
    .replace(/:(\w+)/g, (_, key) => params[key]!)
    .replace(/\/*\*$/, (_) => (params['*'] == null ? '' : params['*'].replace(/^\/*/, '/')));
}

/**
 * A RouteMatch contains info about how a route matched a URL.
 */
export interface RouteMatch<ParamKey extends string = string> {
  /**
   * The names and values of dynamic parameters in the URL.
   */
  params: Params<ParamKey>;
  /**
   * The portion of the URL pathname that was matched.
   */
  pathname: string;
  /**
   * The portion of the URL pathname that was matched before child routes.
   */
  pathnameBase: string;
  /**
   * The route object that was used to match.
   */
  route: RouteObject;
}

/**
 * Matches the given routes to a location and returns the match data.
 *
 * @see https://reactrouter.com/docs/en/v6/api#matchroutes
 */
export function matchRoutes(
  routes: RouteObject[],
  locationArg: Partial<Location> | string,
  basename = '/',
): RouteMatch[] | null {
  let location = typeof locationArg === 'string' ? parsePath(locationArg) : locationArg;

  let pathname = stripBasename(location.pathname || '/', basename);

  if (pathname == null) {
    return null;
  }

  let branches = flattenRoutes(routes);
  rankRouteBranches(branches);

  let matches = null;
  for (let i = 0; matches == null && i < branches.length; ++i) {
    matches = matchRouteBranch(branches[i], routes, pathname);
  }

  return matches;
}

interface RouteMeta {
  relativePath: string;
  caseSensitive: boolean;
  childrenIndex: number;
}

interface RouteBranch {
  path: string;
  score: number;
  routesMeta: RouteMeta[];
}

function flattenRoutes(
  routes: RouteObject[],
  branches: RouteBranch[] = [],
  parentsMeta: RouteMeta[] = [],
  parentPath = '',
): RouteBranch[] {
  routes.forEach((route, index) => {
    let meta: RouteMeta = {
      relativePath: route.path || '',
      caseSensitive: route.caseSensitive === true,
      childrenIndex: index,
    };

    if (meta.relativePath.startsWith('/')) {
      meta.relativePath = meta.relativePath.slice(parentPath.length);
    }

    let path = joinPaths([parentPath, meta.relativePath]);
    let routesMeta = parentsMeta.concat(meta);

    // Add the children before adding this route to the array so we traverse the
    // route tree depth-first and child routes appear before their parents in
    // the "flattened" version.
    if (route.children && route.children.length > 0) {
      flattenRoutes(route.children, branches, routesMeta, path);
    }

    // Routes without a path shouldn't ever match by themselves unless they are
    // index routes, so don't add them to the list of possible branches.
    if (route.path == null && !route.index) {
      return;
    }

    branches.push({ path, score: computeScore(path, route.index), routesMeta });
  });

  return branches;
}

function rankRouteBranches(branches: RouteBranch[]): void {
  branches.sort((a, b) =>
    a.score !== b.score
      ? b.score - a.score // Higher score first
      : compareIndexes(
          a.routesMeta.map((meta) => meta.childrenIndex),
          b.routesMeta.map((meta) => meta.childrenIndex),
        ),
  );
}

const paramRe = /^:\w+$/;
const dynamicSegmentValue = 3;
const indexRouteValue = 2;
const emptySegmentValue = 1;
const staticSegmentValue = 10;
const splatPenalty = -2;
const isSplat = (s: string) => s === '*';

function computeScore(path: string, index: boolean | undefined): number {
  let segments = path.split('/');
  let initialScore = segments.length;
  if (segments.some(isSplat)) {
    initialScore += splatPenalty;
  }

  if (index) {
    initialScore += indexRouteValue;
  }

  return segments
    .filter((s) => !isSplat(s))
    .reduce(
      (score, segment) =>
        score + (paramRe.test(segment) ? dynamicSegmentValue : segment === '' ? emptySegmentValue : staticSegmentValue),
      initialScore,
    );
}

function compareIndexes(a: number[], b: number[]): number {
  let siblings = a.length === b.length && a.slice(0, -1).every((n, i) => n === b[i]);

  return siblings
    ? // If two routes are siblings, we should try to match the earlier sibling
      // first. This allows people to have fine-grained control over the matching
      // behavior by simply putting routes with identical paths in the order they
      // want them tried.
      a[a.length - 1] - b[b.length - 1]
    : // Otherwise, it doesn't really make sense to rank non-siblings by index,
      // so they sort equally.
      0;
}

function matchRouteBranch<ParamKey extends string = string>(
  branch: RouteBranch,
  // TODO: attach original route object inside routesMeta so we don't need this arg
  routesArg: RouteObject[],
  pathname: string,
): RouteMatch<ParamKey>[] | null {
  let routes = routesArg;
  let { routesMeta } = branch;

  let matchedParams = {};
  let matchedPathname = '/';
  let matches: RouteMatch[] = [];
  for (let i = 0; i < routesMeta.length; ++i) {
    let meta = routesMeta[i];
    let end = i === routesMeta.length - 1;
    let remainingPathname = matchedPathname === '/' ? pathname : pathname.slice(matchedPathname.length) || '/';
    let match = matchPath({ path: meta.relativePath, caseSensitive: meta.caseSensitive, end }, remainingPathname);

    if (!match) return null;

    Object.assign(matchedParams, match.params);

    let route = routes[meta.childrenIndex];

    matches.push({
      params: matchedParams,
      pathname: joinPaths([matchedPathname, match.pathname]),
      pathnameBase: joinPaths([matchedPathname, match.pathnameBase]),
      route,
    });

    if (match.pathnameBase !== '/') {
      matchedPathname = joinPaths([matchedPathname, match.pathnameBase]);
    }

    routes = route.children!;
  }

  return matches;
}

/**
 * Renders the result of `matchRoutes()` into a React element.
 */
export function renderMatches(matches: RouteMatch[] | null): React.ReactElement | null {
  return _renderMatches(matches);
}

function _renderMatches(matches: RouteMatch[] | null, parentMatches: RouteMatch[] = []): React.ReactElement | null {
  if (matches == null) return null;

  return matches.reduceRight(
    (outlet, match, index) => {
      // const children = match.route.element ? (
      //   isValidElement(match.route.element) ? (
      //     match.route.element
      //   ) : (
      //     //@ts-expect-error
      //     createElement(match.route.element)
      //   )
      // ) : (
      //   <Outlet />
      // );

      return (
        <RouteContext.Provider
          children={match.route.element !== undefined ? match.route.element : <Outlet />}
          value={{
            outlet,
            matches: parentMatches.concat(matches.slice(0, index + 1)),
          }}
        />
      );
    },
    null as React.ReactElement | null,
  );
}

/**
 * A PathPattern is used to match on some portion of a URL pathname.
 */
export interface PathPattern {
  /**
   * A string to match against a URL pathname. May contain `:id`-style segments
   * to indicate placeholders for dynamic parameters. May also end with `/*` to
   * indicate matching the rest of the URL pathname.
   */
  path: string;
  /**
   * Should be `true` if the static portions of the `path` should be matched in
   * the same case.
   */
  caseSensitive?: boolean;
  /**
   * Should be `true` if this pattern should match the entire URL pathname.
   */
  end?: boolean;
}

/**
 * A PathMatch contains info about how a PathPattern matched on a URL pathname.
 */
export interface PathMatch<ParamKey extends string = string> {
  /**
   * The names and values of dynamic parameters in the URL.
   */
  params: Params<ParamKey>;
  /**
   * The portion of the URL pathname that was matched.
   */
  pathname: string;
  /**
   * The portion of the URL pathname that was matched before child routes.
   */
  pathnameBase: string;
  /**
   * The pattern that was used to match.
   */
  pattern: PathPattern;
}

type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

/**
 * Performs pattern matching on a URL pathname and returns information about
 * the match.
 *
 * @see https://reactrouter.com/docs/en/v6/api#matchpath
 */
export function matchPath<ParamKey extends string = string>(
  pattern: PathPattern | string,
  pathname: string,
): PathMatch<ParamKey> | null {
  if (typeof pattern === 'string') {
    pattern = { path: pattern, caseSensitive: false, end: true };
  }

  let [matcher, paramNames] = compilePath(pattern.path, pattern.caseSensitive, pattern.end);

  let match = pathname.match(matcher);
  if (!match) return null;

  let matchedPathname = match[0];
  let pathnameBase = matchedPathname.replace(/(.)\/+$/, '$1');
  let captureGroups = match.slice(1);
  let params: Params = paramNames.reduce<Mutable<Params>>((memo, paramName, index) => {
    // We need to compute the pathnameBase here using the raw splat value
    // instead of using params["*"] later because it will be decoded then
    if (paramName === '*') {
      let splatValue = captureGroups[index] || '';
      pathnameBase = matchedPathname.slice(0, matchedPathname.length - splatValue.length).replace(/(.)\/+$/, '$1');
    }

    memo[paramName] = safelyDecodeURIComponent(captureGroups[index] || '', paramName);
    return memo;
  }, {});

  return {
    params,
    pathname: matchedPathname,
    pathnameBase,
    pattern,
  };
}

function compilePath(path: string, caseSensitive = false, end = true): [RegExp, string[]] {
  let paramNames: string[] = [];
  let regexpSource =
    '^' +
    path
      .replace(/\/*\*?$/, '') // Ignore trailing / and /*, we'll handle it below
      .replace(/^\/*/, '/') // Make sure it has a leading /
      .replace(/[\\.*+^$?{}|()[\]]/g, '\\$&') // Escape special regex chars
      .replace(/:(\w+)/g, (_: string, paramName: string) => {
        paramNames.push(paramName);
        return '([^\\/]+)';
      });

  if (path.endsWith('*')) {
    paramNames.push('*');
    regexpSource +=
      path === '*' || path === '/*'
        ? '(.*)$' // Already matched the initial /, just match the rest
        : '(?:\\/(.+)|\\/*)$'; // Don't include the / in params["*"]
  } else {
    regexpSource += end
      ? '\\/*$' // When matching to the end, ignore trailing slashes
      : // Otherwise, at least match a word boundary. This restricts parent
        // routes to matching only their own words and nothing more, e.g. parent
        // route "/home" should not match "/home2".
        '(?:\\b|$)';
  }

  let matcher = new RegExp(regexpSource, caseSensitive ? undefined : 'i');

  return [matcher, paramNames];
}

function safelyDecodeURIComponent(value: string, paramName: string) {
  try {
    return decodeURIComponent(value);
  } catch (error) {
    return value;
  }
}

/**
 * Returns a resolved path object relative to the given pathname.
 *
 * @see https://reactrouter.com/docs/en/v6/api#resolvepath
 */
export function resolvePath(to: To, fromPathname = '/'): Path {
  let { pathname: toPathname, search = '', hash = '' } = typeof to === 'string' ? parsePath(to) : to;

  let pathname = toPathname
    ? toPathname.startsWith('/')
      ? toPathname
      : resolvePathname(toPathname, fromPathname)
    : fromPathname;

  return {
    pathname,
    search: normalizeSearch(search),
    hash: normalizeHash(hash),
  };
}

function resolvePathname(relativePath: string, fromPathname: string): string {
  let segments = fromPathname.replace(/\/+$/, '').split('/');
  let relativeSegments = relativePath.split('/');

  relativeSegments.forEach((segment) => {
    if (segment === '..') {
      // Keep the root "" segment so the pathname starts at /
      if (segments.length > 1) segments.pop();
    } else if (segment !== '.') {
      segments.push(segment);
    }
  });

  return segments.length > 1 ? segments.join('/') : '/';
}

function resolveTo(toArg: To, routePathnames: string[], locationPathname: string): Path {
  let to = typeof toArg === 'string' ? parsePath(toArg) : toArg;
  let toPathname = toArg === '' || to.pathname === '' ? '/' : to.pathname;

  // If a pathname is explicitly provided in `to`, it should be relative to the
  // route context. This is explained in `Note on `<Link to>` values` in our
  // migration guide from v5 as a means of disambiguation between `to` values
  // that begin with `/` and those that do not. However, this is problematic for
  // `to` values that do not provide a pathname. `to` can simply be a search or
  // hash string, in which case we should assume that the navigation is relative
  // to the current location's pathname and *not* the route pathname.
  let from: string;
  if (toPathname == null) {
    from = locationPathname;
  } else {
    let routePathnameIndex = routePathnames.length - 1;

    if (toPathname.startsWith('..')) {
      let toSegments = toPathname.split('/');

      // Each leading .. segment means "go up one route" instead of "go up one
      // URL segment".  This is a key difference from how <a href> works and a
      // major reason we call this a "to" value instead of a "href".
      while (toSegments[0] === '..') {
        toSegments.shift();
        routePathnameIndex -= 1;
      }

      to.pathname = toSegments.join('/');
    }

    // If there are more ".." segments than parent routes, resolve relative to
    // the root / URL.
    from = routePathnameIndex >= 0 ? routePathnames[routePathnameIndex] : '/';
  }

  let path = resolvePath(to, from);

  // Ensure the pathname has a trailing slash if the original to value had one.
  if (toPathname && toPathname !== '/' && toPathname.endsWith('/') && !path.pathname.endsWith('/')) {
    path.pathname += '/';
  }

  return path;
}

function getToPathname(to: To): string | undefined {
  // Empty strings should be treated the same as / paths
  return to === '' || (to as Path).pathname === ''
    ? '/'
    : typeof to === 'string'
    ? parsePath(to).pathname
    : to.pathname;
}

function stripBasename(pathname: string, basename: string): string | null {
  if (basename === '/') return pathname;

  if (!pathname.toLowerCase().startsWith(basename.toLowerCase())) {
    return null;
  }

  let nextChar = pathname.charAt(basename.length);
  if (nextChar && nextChar !== '/') {
    // pathname does not start with basename/
    return null;
  }

  return pathname.slice(basename.length) || '/';
}

const joinPaths = (paths: string[]): string => paths.join('/').replace(/\/\/+/g, '/');

const normalizePathname = (pathname: string): string => pathname.replace(/\/+$/, '').replace(/^\/*/, '/');

const normalizeSearch = (search: string): string =>
  !search || search === '?' ? '' : search.startsWith('?') ? search : '?' + search;

const normalizeHash = (hash: string): string => (!hash || hash === '#' ? '' : hash.startsWith('#') ? hash : '#' + hash);
