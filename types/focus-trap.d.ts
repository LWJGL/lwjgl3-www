declare module 'focus-trap' {
  export interface FocusTrapDeactivateOptions {
    returnFocus?: boolean;
    onDeactivate?: (() => any) | null | false;
  }

  export interface FocusTrap {
    activate(): any;
    deactivate(opt?: FocusTrapDeactivateOptions): any;
    pause(): any;
    unpause(): any;
  }

  type FocusTrapTarget = HTMLElement | string | (() => HTMLElement | null);

  export interface FocusTrapCreateOptions {
    onActivate?: () => any;
    onDeactivate?: () => any;
    initialFocus?: FocusTrapTarget;
    fallbackFocus?: FocusTrapTarget;
    escapeDeactivates?: boolean;
    clickOutsideDeactivates?: boolean;
    returnFocusOnDeactivate?: boolean;
  }

  export default function(element: HTMLElement | string, createOptions?: FocusTrapCreateOptions): FocusTrap;
}
