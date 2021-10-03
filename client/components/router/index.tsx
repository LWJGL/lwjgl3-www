import {
  createContext,
  useContext,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  isValidElement,
  createElement,
  Fragment,
  Children,
} from 'react';
import { Action, parsePath } from 'history';
import type { Blocker, History, Location, Path, State, To, Transition } from 'history';

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
export type Navigator = Omit<History, 'action' | 'location' | 'back' | 'forward' | 'listen'>;

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
  action: Action;
  location: Location;
}

const LocationContext = createContext<LocationContextObject>(null!);

if (!FLAG_PRODUCTION) {
  LocationContext.displayName = 'Location';
}

const RouteContext = createContext<RouteContextObject>({
  outlet: null,
  params: {},
  pathname: '/',
  route: null,
});

interface RouteContextObject<ParamKey extends string = string> {
  outlet: React.ReactElement | null;
  params: Readonly<Params<ParamKey>>;
  pathname: string;
  route: RouteObject | null;
}

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
 * @see https://reactrouter.com/api/Outlet
 */
export function Outlet(_props: OutletProps): React.ReactElement | null {
  return useOutlet();
}

export interface RouteProps {
  caseSensitive?: boolean;
  children?: React.ReactNode;
  element?: React.ReactElement | React.ComponentType | null;
  index?: boolean;
  path?: string;
}

/**
 * Declares an element that should be rendered at a certain URL path.
 *
 * @see https://reactrouter.com/api/Route
 */
export function Route(_props: RouteProps): React.ReactElement | null {
  return null;
}

export interface RouterProps {
  action?: Action;
  basename?: string;
  children?: React.ReactNode;
  location: Partial<Location> | string;
  navigator: Navigator;
  pending?: boolean;
  static?: boolean;
}

/**
 * Provides location context for the rest of the app.
 *
 * Note: You usually won't render a <Router> directly. Instead, you'll render a
 * router that is more specific to your environment such as a <BrowserRouter>
 * in web browsers or a <StaticRouter> for server rendering.
 *
 * @see https://reactrouter.com/api/Router
 */
export function Router({
  action = Action.Pop,
  basename: basenameProp = '/',
  children = null,
  location: locationProp,
  navigator,
  pending = false,
  static: staticProp = false,
}: RouterProps): React.ReactElement | null {
  let basename = normalizePathname(basenameProp);
  let navigationContext = useMemo(
    () => ({ basename, navigator, pending, static: staticProp }),
    [basename, navigator, pending, staticProp]
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
      <LocationContext.Provider children={children} value={{ action, location }} />
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
 * @see https://reactrouter.com/api/Routes
 */
export function Routes({ children, location }: RoutesProps): React.ReactElement | null {
  return useRoutes(createRoutesFromChildren(children), location);
}

///////////////////////////////////////////////////////////////////////////////
// HOOKS
///////////////////////////////////////////////////////////////////////////////

/**
 * Blocks all navigation attempts. This is useful for preventing the page from
 * changing until some condition is met, like saving form data.
 *
 * @see https://reactrouter.com/api/useBlocker
 */
export function useBlocker(blocker: Blocker, when = true): void {
  let { navigator } = useContext(NavigationContext);

  useEffect(() => {
    if (!when) return;

    let unblock = navigator.block((tx: Transition) => {
      let autoUnblockingTx = {
        ...tx,
        retry() {
          // Automatically unblock the transition so it can play all the way
          // through before retrying it. TODO: Figure out how to re-enable
          // this block if the transition is cancelled for some reason.
          unblock();
          tx.retry();
        },
      };

      blocker(autoUnblockingTx);
    });

    return unblock;
  }, [navigator, blocker, when]);
}

/**
 * Returns the full href for the given "to" value. This is useful for building
 * custom links that are also accessible and preserve right-click behavior.
 *
 * @see https://reactrouter.com/api/useHref
 */
export function useHref(to: To): string {
  let { basename, navigator } = useContext(NavigationContext);
  let path = useResolvedPath(to);

  if (basename !== '/') {
    let toPathname = getToPathname(to);
    let endsWithSlash = toPathname != null && toPathname.endsWith('/');
    path.pathname =
      path.pathname === '/' ? basename + (endsWithSlash ? '/' : '') : joinPaths([basename, path.pathname]);
  }

  return navigator.createHref(path);
}

/**
 * Returns true if this component is a descendant of a <Router>.
 *
 * @see https://reactrouter.com/api/useInRouterContext
 */
export function useInRouterContext(): boolean {
  return useContext(LocationContext) != null;
}

/**
 * Returns the current location object, which represents the current URL in web
 * browsers.
 *
 * Note: If you're using this it may mean you're doing some of your own
 * "routing" in your app, and we'd like to know what your use case is. We may
 * be able to provide something higher-level to better suit your needs.
 *
 * @see https://reactrouter.com/api/useLocation
 */
export function useLocation(): Location {
  return useContext(LocationContext).location as Location;
}

/**
 * Returns true if the router is pending a location update.
 */
export function useLocationPending(): boolean {
  return useContext(NavigationContext).pending;
}

/**
 * Returns true if the URL for the given "to" value matches the current URL.
 * This is useful for components that need to know "active" state, e.g.
 * <NavLink>.
 *
 * @see https://reactrouter.com/api/useMatch
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
  state?: State;
}

/**
 * Returns an imperative method for changing the location. Used by <Link>s, but
 * may also be used by other elements to change the location.
 *
 * @see https://reactrouter.com/api/useNavigate
 */
export function useNavigate(): NavigateFunction {
  let { basename, navigator } = useContext(NavigationContext);
  let { pathname: routePathname } = useContext(RouteContext);
  let { pathname: locationPathname } = useLocation();

  let activeRef = useRef(false);
  useEffect(() => {
    activeRef.current = true;
  });

  let navigate: NavigateFunction = useCallback(
    (to: To | number, options: { replace?: boolean; state?: State } = {}) => {
      if (!activeRef.current) return;

      if (typeof to === 'number') {
        navigator.go(to);
        return;
      }

      let path = resolveTo(to, routePathname, locationPathname);

      if (basename !== '/') {
        path.pathname = joinPaths([basename, path.pathname]);
      }

      (!!options.replace ? navigator.replace : navigator.push)(path, options.state);
    },
    [basename, navigator, routePathname, locationPathname]
  );

  return navigate;
}

/**
 * Returns the element for the child route at this level of the route
 * hierarchy. Used internally by <Outlet> to render child routes.
 *
 * @see https://reactrouter.com/api/useOutlet
 */
export function useOutlet(): React.ReactElement | null {
  return useContext(RouteContext).outlet;
}

/**
 * Returns an object of key/value pairs of the dynamic params from the current
 * URL that were matched by the route path.
 *
 * @see https://reactrouter.com/api/useParams
 */
export function useParams<Key extends string = string>(): Readonly<Params<Key>> {
  return useContext(RouteContext).params;
}

/**
 * Resolves the pathname of the given `to` value against the current location.
 *
 * @see https://reactrouter.com/api/useResolvedPath
 */
export function useResolvedPath(to: To): Path {
  let { pathname: locationPathname } = useLocation();
  let { pathname: routePathname } = useContext(RouteContext);

  return useMemo(() => resolveTo(to, routePathname, locationPathname), [to, routePathname, locationPathname]);
}

/**
 * Returns the element of the route that matched the current location, prepared
 * with the correct context to render the remainder of the route tree. Route
 * elements in the tree must render an <Outlet> to render their child route's
 * element.
 *
 * @see https://reactrouter.com/api/useRoutes
 */
export function useRoutes(routes: RouteObject[], locationArg?: Partial<Location> | string): React.ReactElement | null {
  let { params: parentParams, pathname: parentPathname } = useContext(RouteContext);

  let locationFromContext = useLocation();
  let location = locationArg
    ? typeof locationArg === 'string'
      ? parsePath(locationArg)
      : locationArg
    : locationFromContext;
  let pathname = location.pathname || '/';

  let parentPathnameStart = getPathnameStart(parentPathname, parentParams);
  let remainingPathname = parentPathnameStart === '/' ? pathname : pathname.slice(parentPathnameStart.length);
  let matches = matchRoutes(routes, { pathname: remainingPathname });

  return renderMatches(
    matches &&
      matches.map((match) =>
        Object.assign({}, match, {
          pathname: joinPaths([parentPathnameStart, match.pathname]),
        })
      )
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
 * @see https://reactrouter.com/api/createRoutesFromChildren
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
      path: element.props.path,
      caseSensitive: element.props.caseSensitive,
      index: element.props.index,
      element: element.props.element,
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
  element?: React.ReactNode | React.ComponentType<any>;
  index?: boolean;
  path?: string;
}

/**
 * Returns a path with params interpolated.
 *
 * @see https://reactrouter.com/api/generatePath
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
   * The route object that was used to match.
   */
  route: RouteObject;
}

/**
 * Matches the given routes to a location and returns the match data.
 *
 * @see https://reactrouter.com/api/matchRoutes
 */
export function matchRoutes(
  routes: RouteObject[],
  locationArg: Partial<Location> | string,
  basename = '/'
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
  parentPath = ''
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

    branches.push({ path, score: computeScore(path), routesMeta });
  });

  return branches;
}

function rankRouteBranches(branches: RouteBranch[]): void {
  branches.sort((a, b) =>
    a.score !== b.score
      ? b.score - a.score // Higher score first
      : compareIndexes(
          a.routesMeta.map((meta) => meta.childrenIndex),
          b.routesMeta.map((meta) => meta.childrenIndex)
        )
  );
}

const paramRe = /^:\w+$/;
const dynamicSegmentValue = 2;
const emptySegmentValue = 1;
const staticSegmentValue = 10;
const splatPenalty = -2;
const isSplat = (s: string) => s === '*';

function computeScore(path: string): number {
  let segments = path.split('/');
  let initialScore = segments.length;
  if (segments.some(isSplat)) {
    initialScore += splatPenalty;
  }

  return segments
    .filter((s) => !isSplat(s))
    .reduce(
      (score, segment) =>
        score + (paramRe.test(segment) ? dynamicSegmentValue : segment === '' ? emptySegmentValue : staticSegmentValue),
      initialScore
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
  routesArg: RouteObject[],
  pathname: string
): RouteMatch<ParamKey>[] | null {
  let routes = routesArg;
  let { routesMeta } = branch;

  let matchedParams = {};
  let matchedPathname = '/';
  let matches: RouteMatch[] = [];
  for (let i = 0; i < routesMeta.length; ++i) {
    let meta = routesMeta[i];
    let trailingPathname = matchedPathname === '/' ? pathname : pathname.slice(matchedPathname.length) || '/';
    let match = matchPath(
      {
        path: meta.relativePath,
        caseSensitive: meta.caseSensitive,
        end: i === routesMeta.length - 1,
      },
      trailingPathname
    );

    if (!match) return null;

    Object.assign(matchedParams, match.params);

    let route = routes[meta.childrenIndex];

    matches.push({
      params: matchedParams,
      pathname: match.pathname === '/' ? matchedPathname : joinPaths([matchedPathname, match.pathname]),
      route,
    });

    let pathnameStart = getPathnameStart(match.pathname, match.params);
    if (pathnameStart !== '/') {
      // Add only the portion of the match.pathname that comes before the * to
      // the matchedPathname. This allows child routes to match against the
      // portion of the pathname that was matched by the *.
      matchedPathname = joinPaths([matchedPathname, pathnameStart]);
    }

    routes = route.children!;
  }

  return matches;
}

/**
 * Renders the result of `matchRoutes()` into a React element.
 */
export function renderMatches(matches: RouteMatch[] | null): React.ReactElement | null {
  if (matches == null) return null;

  return matches.reduceRight((outlet, match) => {
    const children = match.route.element ? (
      isValidElement(match.route.element) ? (
        match.route.element
      ) : (
        //@ts-expect-error
        createElement(match.route.element)
      )
    ) : (
      <Outlet />
    );

    return (
      <RouteContext.Provider
        children={children}
        value={{
          outlet,
          params: match.params,
          pathname: match.pathname,
          route: match.route,
        }}
      />
    );
  }, null as React.ReactElement | null);
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
 * @see https://reactrouter.com/api/matchPath
 */
export function matchPath<ParamKey extends string = string>(
  pattern: PathPattern | string,
  pathname: string
): PathMatch<ParamKey> | null {
  if (typeof pattern === 'string') {
    pattern = { path: pattern, caseSensitive: false, end: true };
  }

  let [matcher, paramNames] = compilePath(pattern.path, pattern.caseSensitive, pattern.end);

  let match = pathname.match(matcher);
  if (!match) return null;

  let matchedPathname = match[0];
  let values = match.slice(1);
  let params: Params = paramNames.reduce<Mutable<Params>>((memo, paramName, index) => {
    memo[paramName] = safelyDecodeURIComponent(values[index] || '', paramName);
    return memo;
  }, {});

  return { params, pathname: matchedPathname, pattern };
}

function compilePath(path: string, caseSensitive = false, end = true): [RegExp, string[]] {
  let keys: string[] = [];
  let source =
    '^' +
    path
      .replace(/\/?\*?$/, '') // Ignore trailing / and /*, we'll handle it below
      .replace(/^\/*/, '/') // Make sure it has a leading /
      .replace(/[\\.*+^$?{}|()[\]]/g, '\\$&') // Escape special regex chars
      .replace(/:(\w+)/g, (_: string, key: string) => {
        keys.push(key);
        return '([^\\/]+)';
      });

  if (path.endsWith('*')) {
    if (path.endsWith('/*')) {
      source += '(?:\\/(.+)|\\/?)$'; // Don't include the / in params['*']
    } else {
      source += '(.*)$';
    }
    keys.push('*');
  } else if (end) {
    // When matching to the end, ignore trailing slashes.
    source += '\\/?$';
  } else {
    // If not matching to the end (as parent routes do), at least match a word
    // boundary. This restricts a parent route to matching only its own words
    // and nothing more, e.g. parent route "/home" should not match "/home2".
    source += '(?:\\b|$)';
  }

  let matcher = new RegExp(source, caseSensitive ? undefined : 'i');

  return [matcher, keys];
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
 * @see https://reactrouter.com/api/resolvePath
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

function resolveTo(to: To, routePathname: string, locationPathname: string): Path {
  return resolvePath(
    to,
    // If a pathname is explicitly provided in `to`, it should be
    // relative to the route context. This is explained in `Note on
    // `<Link to>` values` in our migration guide from v5 as a means of
    // disambiguation between `to` values that begin with `/` and those
    // that do not. However, this is problematic for `to` values that do
    // not provide a pathname. `to` can simply be a search or hash
    // string, in which case we should assume that the navigation is
    // relative to the current location's pathname and *not* the
    // route pathname.
    getToPathname(to) == null ? locationPathname : routePathname
  );
}

function getToPathname(to: To): string | undefined {
  // Empty strings should be treated the same as / paths
  return to === '' || (to as Path).pathname === ''
    ? '/'
    : typeof to === 'string'
    ? parsePath(to).pathname
    : to.pathname;
}

function getPathnameStart(pathname: string, params: Params): string {
  let splat = params['*'];
  if (!splat) return pathname;
  let pathnameStart = pathname.slice(0, -splat.length);
  if (splat.startsWith('/')) return pathnameStart;
  let index = pathnameStart.lastIndexOf('/');
  if (index > 0) return pathnameStart.slice(0, index);
  return '/';
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
