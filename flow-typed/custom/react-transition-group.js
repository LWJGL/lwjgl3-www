type TransitionStatus = 'entering' | 'entered' | 'exiting' | 'exited' | 'unmounted';

type TransitionTimeoutConfig = {
  appear?: number,
  enter?: number,
  exit?: number,
};

type TransitionTimeout = number | TransitionTimeoutConfig;

type TransitionName =
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

type TransitionEventCallback = (node: HTMLElement, isAppearing: boolean) => mixed;

type TransitionProps = {
  children: React.Children | ((status: TransitionStatus) => React.Children),
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

type TransitionDefaultProps = {
  in: boolean,
  unmountOnExit: boolean,
  appear: boolean,
  enter: boolean,
  exit: boolean,
};

type CSSTransitionProps = TransitionProps & {
  classNames?: TransitionName,
};

type TransitionComponent = string | Class<React$Component<*, *, *>>;

type TransitionGroupProps = {
  component?: TransitionComponent,
  children?: React.Children,
  className?: string,
  appear?: boolean,
  enter?: boolean,
  exit?: boolean,
};

type TransitionGroupDefaultProps = {
  component: TransitionComponent,
};

declare module 'react-transition-group' {
  declare var Transition: Class<React$Component<TransitionDefaultProps, TransitionProps, void>>;
  declare var TransitionGroup: Class<React$Component<TransitionGroupDefaultProps, TransitionGroupProps, void>>;
  declare var CSSTransition: Class<React$Component<void, CSSTransitionProps, void>>;
}
