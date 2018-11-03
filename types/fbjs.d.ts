declare module 'fbjs/lib/Keys' {
  export const BACKSPACE: 8;
  export const TAB: 9;
  export const RETURN: 13;
  export const ALT: 18;
  export const ESC: 27;
  export const SPACE: 32;
  export const PAGE_UP: 33;
  export const PAGE_DOWN: 34;
  export const END: 35;
  export const HOME: 36;
  export const LEFT: 37;
  export const UP: 38;
  export const RIGHT: 39;
  export const DOWN: 40;
  export const DELETE: 46;
  export const COMMA: 188;
  export const PERIOD: 190;
  export const A: 65;
  export const Z: 90;
  export const ZERO: 48;
  export const NUMPAD_0: 96;
  export const NUMPAD_9: 105;
}

declare module 'fbjs/lib/areEqual' {
  export default function(a: any, b: any): boolean;
}

declare module 'fbjs/lib/shallowEqual' {
  export default function(objA: any, objB: any): boolean;
}

declare module 'fbjs/lib/isEmail' {
  export default function(value: string): boolean;
}
