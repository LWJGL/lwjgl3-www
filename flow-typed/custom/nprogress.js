declare module 'nprogress' {
  declare type NProgressConfiguration = {
    minimum?: number,
    template?: string,
    easing?: string,
    speed?: number,
    trickle?: boolean,
    trickeSpeed?: number,
    showSpinner?: boolean,
    barSelector?: string,
    positionUsing?: string,
    parent?: HTMLElement | string,
  };

  declare type NProgress = {
    start: () => NProgress,
    isStarted: () => boolean,
    isRendered: () => boolean,
    status: number | null,
    done: (?true) => NProgress,
    set: (n: number) => NProgress,
    inc: (n?: number) => NProgress,
    configure: NProgressConfiguration => NProgress,
    trickle: () => NProgress,
    remove: () => void,
    getPositioningCSS: () => string,
  };

  declare export default NProgress
}
