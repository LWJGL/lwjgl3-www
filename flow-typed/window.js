type EventOptions =
  | boolean
  | {
      capture?: boolean,
      once?: boolean,
      passive?: boolean,
    };

type MediaQueryListListener = (media: string) => mixed;

declare var window: {
  +document: Document,
  +devicePixelRatio: number,
  +pageXOffset: number,
  +pageYOffset: number,
  +scrollX: number,
  +scrollY: number,
  +scroll: (posX: number, posY: number) => void,
  +scrollTo: (posX: number, posY: number) => void,
  +innerHeight: number,
  +innerWidth: number,
  +history: {
    length: number,
    pushState: (state: {} | void, title?: string, url?: string) => void,
    replaceState: (state: {} | void, title?: string, url?: string) => void,
    go: (step?: number) => void,
    back: () => void,
    forward: () => void,
    scrollRestoration: 'manual' | 'auto',
  },
  +addEventListener: (type: string, listener: (event: Event) => mixed, optionsOrUseCapture?: EventOptions) => void,
  +removeEventListener: (type: string, listener: (event: Event) => mixed, optionsOrUseCapture?: EventOptions) => void,
  +matchMedia: (
    mediaQueryString: string
  ) => {
    +matches: boolean,
    media: string,
    addListener: (mediaQueryListListener: MediaQueryListListener) => void,
    removeListener: (mediaQueryListListener: MediaQueryListListener) => void,
  },
  +__REDUX_DEVTOOLS_EXTENSION_COMPOSE__: () => mixed,
  +MSStream?: {},
  GoogleAnalyticsObject: string,
  ga: (command: string, ...fields: Array<any>) => void,
  webpackManifest: {},
};
