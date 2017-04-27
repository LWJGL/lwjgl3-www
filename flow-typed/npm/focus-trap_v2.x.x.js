declare module 'focus-trap' {
  declare export type FocusTrapDeactivateOptions = {
    returnFocus?: boolean,
    onDeactivate?: (() => any) | null | false,
  };

  declare export type FocusTrap = {
    activate: () => any,
    deactivate: (?FocusTrapDeactivateOptions) => any,
    pause: () => any,
    unpause: () => any,
  };

  declare export type FocusTrapCreateOptions = {
    onActivate?: () => any,
    onDeactivate?: () => any,
    initialFocus?: HTMLElement | string | (() => HTMLElement),
    fallbackFocus?: HTMLElement | string | (() => HTMLElement),
    escapeDeactivates?: boolean,
    clickOutsideDeactivates?: boolean,
    returnFocusOnDeactivate?: boolean,
  };

  declare export default (element: HTMLElement | string, createOptions?: FocusTrapCreateOptions) => FocusTrap
}
