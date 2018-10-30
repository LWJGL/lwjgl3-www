import * as React from 'react';

declare module 'react-transition-group' {
  declare type TransitionStatus = 'entering' | 'entered' | 'exiting' | 'exited' | 'unmounted';

  declare type TransitionTimeoutConfig = {
    appear?: number,
    enter?: number,
    exit?: number,
  };

  declare type TransitionTimeout = number | TransitionTimeoutConfig;

  declare type TransitionName =
    | string
    | {
        enter: string,
        exit: string,
        appear: string,
      }
    | {
        enter: string,
        enterActive: string,
        exit: string,
        exitActive: string,
        appear: string,
        appearActive: string,
      };

  declare type TransitionEventCallback = (node: HTMLElement, isAppearing: boolean) => mixed;

  declare type TransitionProps = {
    children?: React.Node | ((status: TransitionStatus) => React.Node),
    in?: boolean,
    mountOnEnter?: boolean,
    unmountOnExit?: boolean,
    appear?: boolean,
    enter?: boolean,
    exit?: boolean,
    timeout?: TransitionTimeout,
    addEndListener?: (node: HTMLElement, done: boolean) => mixed,
    onEnter?: TransitionEventCallback,
    onEntering?: TransitionEventCallback,
    onEntered?: TransitionEventCallback,
    onExit?: TransitionEventCallback,
    onExiting?: TransitionEventCallback,
    onExited?: TransitionEventCallback,
  };

  declare type CSSTransitionProps = TransitionProps & {
    classNames?: TransitionName,
  };

  declare type TransitionGroupProps = {
    component?: React.ElementType,
    children?: React.Node,
    className?: string,
    appear?: boolean,
    enter?: boolean,
    exit?: boolean,
  };

  declare var Transition: React.ComponentType<TransitionProps>;
  declare var TransitionGroup: React.ComponentType<TransitionGroupProps>;
  declare var CSSTransition: React.ComponentType<CSSTransitionProps>;
}
