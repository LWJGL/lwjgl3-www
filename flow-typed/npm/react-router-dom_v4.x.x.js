import * as React from 'react';

declare module 'react-router-dom' {
  declare export type GetUserConfirmation = (message: string, callback: (confirmed: boolean) => void) => void;

  declare export type Location = {
    pathname: string,
    search: string,
    hash: string,
    state?: any,
    key?: string,
  };

  declare export type LocationShape = {
    pathname?: string,
    search?: string,
    hash?: string,
    state?: any,
  };

  declare export type HistoryAction = 'PUSH' | 'REPLACE' | 'POP';

  declare export type BrowserRouterProps = {
    basename?: string,
    forceRefresh?: boolean,
    getUserConfirmation?: GetUserConfirmation,
    keyLength?: number,
    children?: React.Node,
  };

  declare export var BrowserRouter: Class<React$Component<BrowserRouterProps>>;

  declare export type HashRouterProps = {
    basename?: string,
    getUserConfirmation?: GetUserConfirmation,
    hashType?: 'slash' | 'noslash' | 'hashbang',
    children?: React.Node,
  };
  declare export var HashRouter: Class<React$Component<HashRouterProps>>;

  declare export type LinkProps = {
    to: string | LocationShape,
    replace?: boolean,
    children?: React.Node,
  };
  declare export var Link: Class<React$Component<LinkProps>>;

  declare export type NavLinkProps = {
    to: string | LocationShape,
    activeClassName?: string,
    className?: string,
    activeStyle?: {},
    style?: {},
    isActive?: (match: Match, location: Location) => boolean,
    children?: React.Node,
    exact?: boolean,
    strict?: boolean,
  };
  declare export var NavLink: Class<React$Component<NavLinkProps>>;

  // NOTE: Below are duplicated from react-router. If updating these, please
  // update the react-router and react-router-native types as well.
  declare export type RouterHistory = {
    length: number,
    location: Location,
    action: HistoryAction,
    listen(callback: (location: Location, action: HistoryAction) => void): () => void,
    push(path: string | LocationShape, state?: any): void,
    replace(path: string | LocationShape, state?: any): void,
    go(n: number): void,
    goBack(): void,
    goForward(): void,
    canGo?: (n: number) => boolean,
    block(callback: (location: Location, action: HistoryAction) => boolean): void,
    // createMemoryHistory
    index?: number,
    entries?: Array<Location>,
  };

  declare export type Match = {
    params: {},
    isExact: boolean,
    path: string,
    url: string,
  };

  declare export type ContextRouter = {
    history: RouterHistory,
    location: Location,
    match: Match,
  };

  declare export type StaticRouterContext = {
    url?: string,
  };

  declare export type StaticRouterProps = {
    basename?: string,
    location?: string | Location,
    context: StaticRouterContext,
    children?: React.Node,
  };
  declare export var StaticRouter: Class<React$Component<StaticRouterProps>>;

  declare export type MemoryRouterProps = {
    initialEntries?: Array<LocationShape | string>,
    initialIndex?: number,
    getUserConfirmation?: GetUserConfirmation,
    keyLength?: number,
    children?: React.Node,
  };
  declare export var MemoryRouter: Class<React$Component<MemoryRouterProps>>;

  declare export type RouterProps = {
    history: RouterHistory,
    children?: React.Node,
  };
  declare export var Router: Class<React$Component<RouterProps>>;

  declare export type PromptProps = {
    message: string | ((location: Location) => string | true),
    when?: boolean,
  };
  declare export var Prompt: Class<React$Component<PromptProps>>;

  declare export type RedirectProps = {
    to: string | LocationShape,
    push?: boolean,
  };
  declare export var Redirect: Class<React$Component<RedirectProps>>;

  declare export type RouteProps = {
    component?: React.ComponentType<any>,
    render?: (router: ContextRouter) => React.Element<any>,
    children?: (router: ContextRouter) => React.Element<any>,
    path?: string,
    exact?: boolean,
    strict?: boolean,
  };
  declare export var Route: Class<React$Component<RouteProps>>;

  declare export type SwitchProps = {
    children?: React.Node,
  };
  declare export var Switch: Class<React$Component<SwitchProps>>;

  declare export function withRouter<P>(Component: React.ComponentType<P>): React.ComponentType<P & ContextRouter>;

  declare type MatchPathOptions = {
    path: string,
    exact?: boolean,
    strict?: boolean,
  };
  declare export function matchPath(pathname: string, options: MatchPathOptions): null | Match;
}
