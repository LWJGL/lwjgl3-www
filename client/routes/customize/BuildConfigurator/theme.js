// @flow
import { hsl, setLightness } from '~/theme/color';

// Colors
export const COLOR_RELEASE = hsl(120, 60, 30);
export const COLOR_STABLE = hsl(200, 90, 30);
export const COLOR_NIGHTLY = hsl(0, 5, 30);
export const COLOR_RELEASE_LIGHT = setLightness(COLOR_RELEASE, 97);
export const COLOR_STABLE_LIGHT = setLightness(COLOR_STABLE, 97);
export const COLOR_NIGHTLY_LIGHT = setLightness(COLOR_NIGHTLY, 97);

// Typography
export const SMALL_FONT_SIZE = '80%';

// Borders
export const BORDER_RADIUS = '4px';
