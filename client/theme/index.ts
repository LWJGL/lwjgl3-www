// import { createContext, useContext } from 'react';
import { hsl } from './color';
// export { mediaBreakpointUp, mediaBreakpointDown } from './media';
// export { cc } from './cc';

// const ThemeContext = createContext();
// export const useTheme = () => useContext(ThemeContext);

// For Bootstrap 4 variables see https://github.com/twbs/bootstrap/blob/v4-dev/scss/_variables.scss

export const COLOR_WHITE = hsl(0, 0, 100); // #fff
export const COLOR_BLACK = hsl(0, 0, 0); // #000

export const COLOR_GRAY_100 = hsl(210, 17, 98); // #f8f9fa
export const COLOR_GRAY_200 = hsl(210, 16, 93); // #e9ecef
export const COLOR_GRAY_300 = hsl(210, 14, 89); // #dee2e6
export const COLOR_GRAY_400 = hsl(210, 14, 83); // #ced4da
export const COLOR_GRAY_500 = hsl(210, 11, 71); // #adb5bd
export const COLOR_GRAY_600 = hsl(208, 7, 46); // #6c757d
export const COLOR_GRAY_700 = hsl(210, 9, 31); // #495057
export const COLOR_GRAY_800 = hsl(210, 10, 23); // #343a40
export const COLOR_GRAY_900 = hsl(210, 11, 15); // #212529

export const COLOR_GRAY = COLOR_GRAY_600;
export const COLOR_GRAY_DARK = COLOR_GRAY_800;

export const COLOR_BLUE = hsl(211, 100, 50); // #007bff
export const COLOR_INDIGO = hsl(263, 90, 51); // #6610f2
export const COLOR_PURPLE = hsl(261, 51, 51); // #6f42c1
export const COLOR_PINK = hsl(332, 79, 58); // #e83e8c
export const COLOR_RED = hsl(354, 70, 54); // #dc3545
export const COLOR_ORANGE = hsl(27, 98, 54); // #fd7e14
export const COLOR_YELLOW = hsl(45, 100, 51); // #ffc107
export const COLOR_GREEN = hsl(134, 61, 41); // #28a745
export const COLOR_TEAL = hsl(162, 73, 46); // #20c997
export const COLOR_CYAN = hsl(188, 78, 41); // #17a2b8

// export const COLOR_PRIMARY = COLOR_BLUE;
export const COLOR_PRIMARY = hsl(191, 17, 13);
export const COLOR_SECONDARY = COLOR_GRAY_600;
export const COLOR_SUCCESS = COLOR_GREEN;
export const COLOR_INFO = COLOR_CYAN;
export const COLOR_WARNING = COLOR_YELLOW;
export const COLOR_DANGER = COLOR_RED;
export const COLOR_LIGHT = COLOR_GRAY_100;
export const COLOR_DARK = COLOR_GRAY_800;

// Set a specific jump point for requesting color jumps
export const COLOR_INTERVAL = 0.08; // 8%

// The YIQ lightness value that determines when the lightness of color changes from "dark" to "light".
// Acceptable values are between 0 and 255.
export const YIQ_CONTRASTED_THRESHOLD = 150;

// Customize the light and dark text colors for use in our YIQ color contrast function.
export const YIQ_TEXT_DARK = COLOR_GRAY_900;
export const YIQ_TEXT_LIGHT = COLOR_WHITE;

// Quickly modify global styling by enabling or disabling optional features.

export const ENABLE_ROUNDED = false;

// export const ENABLE_SHADOWS = false;
export const ENABLE_SHADOWS = true;

export const ENABLE_GRADIENTS = true;

// export const ENABLE_TRANSITIONS = true;
export const ENABLE_TRANSITIONS = false;

// export const ENABLE_HOVER_MEDIA_QUERY = false;
export const ENABLE_HOVER_MEDIA_QUERY = true;

// export const ENABLE_GRID_CLASSES = false;
export const ENABLE_GRID_CLASSES = true;

// export const ENABLE_CARET = true;
export const ENABLE_CARET = false;

// export const ENABLE_PRINT_STYLES = true;
export const ENABLE_PRINT_STYLES = false;

// Spacing

export const SPACER = '1rem';
export const SPACER_0 = '0';
export const SPACER_1 = '.25rem';
export const SPACER_2 = '.5rem';
export const SPACER_3 = SPACER;
export const SPACER_4 = '1.5rem';
export const SPACER_5 = '3rem';

// Body

export const COLOR_BODY_BG = COLOR_WHITE;
export const COLOR_BODY_COLOR = COLOR_GRAY_900;

// Custom Controls

export const COLOR_CUSTOM_CONTROL_INDICATOR_BG = COLOR_GRAY_300;
export const COLOR_CUSTOM_CONTROL_INDICATOR_CHECKED_COLOR = COLOR_WHITE;
export const COLOR_CUSTOM_CONTROL_INDICATOR_CHECKED_BG = COLOR_BLUE;

// Z-Index

export const ZINDEX_DROPDOWN = 1000;
export const ZINDEX_STICKY = 1020;
export const ZINDEX_FIXED = 1030;
export const ZINDEX_MODAL_BACKDROP = 1040;
export const ZINDEX_MODAL = 1050;
export const ZINDEX_POPOVER = 1060;
export const ZINDEX_TOOLTIP = 1070;
