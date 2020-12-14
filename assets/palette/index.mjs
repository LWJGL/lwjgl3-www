import fs from 'fs/promises';
import path from 'path';
import chroma from 'chroma-js';
import { generateAdaptiveTheme } from '@adobe/leonardo-contrast-colors';
import { themes } from './themes.mjs';

/*
  1. Base Scale (background)
  2. Tones (neutral, critical, caution, positive, info, promote)
  3. Brand (primary)

  * Tones follow Braid Design System conventions:
  https://seek-oss.github.io/braid-design-system/foundations/tones

  * Color levels follow Tailwind conventions:
  50,100-900
  https://tailwindcss.com/docs/customizing-colors#default-color-palette

  * Ratios tuned by hand:
  run `node index.mjs --url` to inspect on https://leonardocolor.io/theme.html

  * Calculating a Contrast Ratio
  Contrast ratios can range from 1 to 21 (commonly written 1:1 to 21:1).
  (L1 + 0.05) / (L2 + 0.05), whereby:
  - L1 is the relative luminance of the lighter of the colors, and
  - L2 is the relative luminance of the darker of the colors.

  * Web Content Accessibility Guidelines (WCAG) 2.0
  Contrast (Minimum): The visual presentation of text and images of text has a contrast ratio of at least 4.5:1, except for the following: (Level AA)
  Large Text: Large-scale text and images of large-scale text have a contrast ratio of at least 3:1;

  * Enhanced Contrast Standards
  Contrast (Enhanced): The visual presentation of text and images of text has a contrast ratio of at least 7:1, except for the following: (Level AAA)
  Large Text: Large-scale text and images of large-scale text have a contrast ratio of at least 4.5:1;

  Incidental: Text or images of text that are part of an inactive user interface component, that are pure decoration, that are not visible to anyone, or that are part of a picture that contains significant other visual content, have no contrast requirement.
  Logotypes: Text that is part of a logo or brand name has no minimum contrast requirement.
*/

const argv = {};
let selectedTheme = 'default';

process.argv.slice(2).forEach(arg => {
  switch (arg) {
    case '--url':
      argv.url = true;
      return;
    case '--json':
      argv.json = true;
      return;
  }

  selectedTheme = arg;
});

const theme = themes[selectedTheme];

const config = {
  colorScales: Object.entries(theme.palette).map(([name, colorKeys]) => ({
    name,
    colorKeys,
    ratios: theme.ratios,
  })),
  // output: 'HSL',
  output: 'HEX',
  ...theme.settings,
  // colorSpace: 'HSLuv',
};

config.colorScales.unshift({
  name: 'text',
  colorKeys: [theme.text.color ?? theme.palette.primary[0]],
  ratios: theme.text.ratios,
});

if (!!argv.json) {
  process.stdout.write('\n');
  process.stdout.write(JSON.stringify(config, null, 2));
  process.exit(0);
}

if (!!argv.url) {
  console.log(`https://leonardocolor.io/theme.html?name=Theme&config=${encodeURIComponent(JSON.stringify(config))}`);
  process.exit(0);
}

// Generate palette
const targetPath = '../../client/theme/palettes';
const light = generateAdaptiveTheme(config);
const dark = generateAdaptiveTheme({ ...config, brightness: theme.dark.brightness, contrast: theme.dark.contrast });

await writeTheme(light, `${targetPath}/${selectedTheme}-light.ts`);
await writeTheme(dark, `${targetPath}/${selectedTheme}-dark.ts`);

async function writeTheme(theme, filePath) {
  const bg = theme[0].background;
  const text = theme[1].values[0];

  const lines = [
    `import { Hsl } from '~/theme/color';`,
    `type Tone = Readonly<[Hsl, Hsl, Hsl, Hsl, Hsl, Hsl, Hsl, Hsl, Hsl, Hsl]>;`,
    ``,
    `export const BG = ${renderColor({ value: bg })};`,
    `export const TEXT = ${renderColor(text)};`,
  ];

  theme.slice(2).forEach(color => {
    lines.push('');
    lines.push(`export const ${color.name.toUpperCase()}: Tone = [`);

    color.values.forEach((item, i) => {
      lines.push(`  ${renderColor(item)},`);
    });

    lines.push(`];`);
  });

  await fs.writeFile(path.resolve(filePath), lines.join('\n'));
}

function renderColor(color) {
  const parts = chroma(color.value)
    .hsl()
    .slice(0, 3)
    .map((part, i) => {
      if (isNaN(part)) {
        return '0';
      }
      if (i > 0) {
        part *= 100;
      }
      return part.toFixed(2).replace(/\.?0+$/, '');
    })
    .join(', ');

  return `new Hsl(${parts})`;
}
