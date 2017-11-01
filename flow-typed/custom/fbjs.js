declare module 'fbjs/lib/Keys' {
  declare var BACKSPACE: 8;
  declare var TAB: 9;
  declare var RETURN: 13;
  declare var ALT: 18;
  declare var ESC: 27;
  declare var SPACE: 32;
  declare var PAGE_UP: 33;
  declare var PAGE_DOWN: 34;
  declare var END: 35;
  declare var HOME: 36;
  declare var LEFT: 37;
  declare var UP: 38;
  declare var RIGHT: 39;
  declare var DOWN: 40;
  declare var DELETE: 46;
  declare var COMMA: 188;
  declare var PERIOD: 190;
  declare var A: 65;
  declare var Z: 90;
  declare var ZERO: 48;
  declare var NUMPAD_0: 96;
  declare var NUMPAD_9: 105;
}

declare module 'fbjs/lib/areEqual' {
  declare export default (a: any, b: any) => boolean
}

declare module 'fbjs/lib/isEmail' {
  declare export default (value: string) => boolean
}
