import * as React from 'react';

declare module '@reach/router' {
  declare export type RouterLocation = {
    key: string,
    state: {},
    ...Location,
  };

  declare export class Router extends React.Component<{
    basepath?: string,
    primary?: boolean,
    location?: RouterLocation,
  }> {}

  declare export class Link extends React.Component<{
    to: string,
    replace?: boolean,
    getProps?: ({
      isCurrent: boolean,
      isPartiallyCurrent: boolean,
      href: string,
      location: RouterLocation,
    }) => {} | null,
    state?: {},
  }> {}

  declare export type NavigateOptions = {
    state?: {},
    replace?: boolean,
  };

  declare export function navigate(to: string, opts: ?NavigateOptions): void;

  declare export type RouteProps = {
    path: string,
    children?: React.Node,
    default: boolean,
    location: RouterLocation,
    navigate: typeof navigate,
    uri: string,
    [string]: string,
  };

  declare export class Redirect extends React.Component<{
    from: string,
    to: string,
    noThrow?: boolean,
  }> {}

  declare export type MatchProps = {
    match: {
      uri: string,
      path: string,
    },
    location: RouterLocation,
    navigate: typeof navigate,
  };

  declare export class Match extends React.Component<{
    path: string,
    children?: MatchProps => React.Node,
  }> {}

  declare export type LocationProps = {
    location: RouterLocation,
    navigate: typeof navigate,
  };

  declare export class Location extends React.Component<{
    children?: LocationProps => React.Node,
  }> {}
}
