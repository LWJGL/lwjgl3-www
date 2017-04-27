declare module 'nprogress' {
  declare type NProgressConfiguration = {
    minimum?: number,
    template?: string,
    easing?: string,
    speed?: number,
    trickle?: boolean,
    trickeSpeed?: number,
    showSpinner?: boolean,
    parent?: HTMLElement | string,
  };

  declare export default {
    start: () => void,
    done: (?true) => void,
    set: (n: number) => void,
    inc: (n?: number) => void,
    configure: (NProgressConfiguration) => void,
  }
}
