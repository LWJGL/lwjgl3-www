// @flow
import { Hsl } from './Hsl';
export { Hsl } from './Hsl';
export { mediaBreakpointUp, mediaBreakpointDown, breakpoints } from './media';

export function hsl(hue: number, saturation: number, lightness: number, alpha?: number): Hsl {
  return new Hsl(hue, saturation, lightness, alpha);
}

export const COLOR_PRIMARY: Hsl = hsl(191, 17, 13);

// Bootstrap 4 Variables

export const COLOR_WHITE: Hsl = hsl(0, 0, 100); // #fff
export const COLOR_GRAY100: Hsl = hsl(210, 17, 98); // #f8f9fa
export const COLOR_GRAY200: Hsl = hsl(210, 16, 93); // #e9ecef
export const COLOR_GRAY300: Hsl = hsl(210, 14, 89); // #dee2e6
export const COLOR_GRAY400: Hsl = hsl(210, 14, 83); // #ced4da
export const COLOR_GRAY500: Hsl = hsl(210, 11, 71); // #adb5bd
export const COLOR_GRAY600: Hsl = hsl(208, 7, 46); // #6c757d
export const COLOR_GRAY700: Hsl = hsl(210, 9, 31); // #495057
export const COLOR_GRAY800: Hsl = hsl(210, 10, 23); // #343a40
export const COLOR_GRAY900: Hsl = hsl(210, 11, 15); // #212529
export const COLOR_BLACK: Hsl = hsl(0, 0, 0); // #000

export const COLOR_CUSTOM_CONTROL_INDICATOR_BG = COLOR_GRAY300;
