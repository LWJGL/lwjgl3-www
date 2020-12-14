import chroma from 'chroma-js';
import { tailwind } from './tailwind.mjs';

const defaultSettings = {
  baseScale: 'primary',
  brightness: 100,
  colorSpace: 'CAM02',
  contrast: 1,
};

const defaultRatios = {
  ratios: [1.05, 1.18, 1.4, 1.9, 2.6, 3.8, 5, 7, 10, 13],
};

const defaultTextSettings = {
  ratios: [14],
};

const defaultDarkModeSettings = {
  brightness: 9,
  contrast: 1,
};

function expandPalette(color) {
  const c = chroma(color);
  return [color, c.set('hsl.s', 0.5).hex(), c.set('hsl.l', 0.5).hex(), c.set('hsl.l', 0.5).set('hsl.s', 0.5).hex()];
}

const tones = {
  neutral: Object.values(tailwind.coolGray),
  critical: Object.values(tailwind.red),
  caution: Object.values(tailwind.yellow),
  positive: Object.values(tailwind.green),
  info: Object.values(tailwind.indigo),
};

export const themes = {
  default: {
    ...defaultRatios,
    settings: {
      ...defaultSettings,
    },
    dark: {
      ...defaultDarkModeSettings,
    },
    text: {
      ...defaultTextSettings,
    },
    palette: {
      primary: expandPalette('#4e789d'), // Classic LWJGL logo
      // accent: expandPalette('#ffff00'), // Yellow
      ...tones,
    },
  },
};
