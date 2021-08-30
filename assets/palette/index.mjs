import fs from 'node:fs/promises';
import path from 'node:path';
import chroma from 'chroma-js';
// import { Theme, Color, BackgroundColor } from '@adobe/leonardo-contrast-colors';
import { Theme, Color, BackgroundColor } from './contrast-colors/index.js';
import { candidates, candidatesDark } from './candidates.mjs';
import * as radix from '@radix-ui/colors';
import { transform } from './util.mjs';

let accentColor = '';

// const argv = {};
process.argv.slice(2).forEach(arg => {
  // switch (arg) {
  //   case '--dark':
  //     argv.dark = true;
  //     return;
  //   case '--alpha':
  //     argv.alpha = true;
  //     return;
  //   case '--url':
  //     argv.url = true;
  //     return;
  // }

  accentColor = arg;
});

if (!accentColor.length) {
  console.error('Please provide an accent color');
  process.exit(1);
}

let bg = new BackgroundColor({
  name: 'white',
  colorKeys: ['#ffffff'],
  ratios: [1],
});

const accentChroma = chroma(accentColor);

let pos = 0;
const closest = candidates.reduce((prev, curr, currentIndex) => {
  const prevDist = chroma.deltaE(accentChroma, prev[8], 0.1, 1);
  const currDist = chroma.deltaE(accentChroma, curr[8], 0.1, 1);
  if (prevDist < currDist) {
    return prev;
  } else {
    pos = currentIndex;
    return curr;
  }
});
const closestDark = candidatesDark[pos];

const ratios = closest.map(color => chroma.contrast(color, '#fff'));
const ratiosDark = closestDark.map(color => chroma.contrast(color, '#fff'));

const accent = new Color({ name: 'accent', colorKeys: [accentColor], colorspace: 'CAM02', ratios });
const accentDark = new Color({ name: 'accent', colorKeys: [accentColor], colorspace: 'CAM02', ratios: ratiosDark });

const theme = new Theme({ colors: [accent], backgroundColor: bg, lightness: 100, contrast: 1, output: 'HEX' });
const themeDark = new Theme({ colors: [accentDark], backgroundColor: bg, lightness: 100, contrast: 1, output: 'HEX' });

// if (!!argv.url) {
//   const config = {
//     baseScale: 'BG',
//     colorScales: [
//       { name: 'BG', colorKeys: ['#ffffff'], colorspace: 'CAM02', ratios: [1] },
//       {
//         name: 'Accent',
//         colorKeys: [accentColor],
//         colorspace: 'CAM02',
//         ratios,
//       },
//     ],
//     brightness: '100',
//     contrast: '1',
//   };

//   console.log(`https://leonardocolor.io/theme.html?name=Theme&config=${encodeURIComponent(JSON.stringify(config))}`);
//   process.exit(0);
// }

const lines = [];

function pushRadix(tone, color, suffix = '') {
  lines.push(`export const ${tone}${suffix} = {`);
  Object.keys(radix[color]).forEach((scale, i) => {
    // lines.push(`  ${tone}${i + 1}: '${radix[`${color}${suffix}`][scale]}',`);
    const c = chroma(transform(radix[`${color}${suffix}`][scale]));
    lines.push(`  ${tone}${i + 1}: '${c.hex()}',`);
  });
  lines.push(`};`);
  lines.push('');
}

lines.push(`export const accent = {`);
theme.contrastColors[1].values.forEach((color, i) => {
  lines.push(`  accent${i + 1}: '${color.value}',`);
});
lines.push(`};`);
lines.push('');
pushRadix('neutral', 'slate');
pushRadix('positive', 'grass');
pushRadix('info', 'indigo');
pushRadix('caution', 'yellow');
pushRadix('critical', 'red');

lines.push(`export const accentDark = {`);
themeDark.contrastColors[1].values.forEach((color, i) => {
  lines.push(`  accent${i + 1}: '${color.value}',`);
});
lines.push(`};`);
lines.push('');
pushRadix('neutral', 'slate', 'Dark');
pushRadix('positive', 'grass', 'Dark');
pushRadix('info', 'indigo', 'Dark');
pushRadix('caution', 'yellow', 'Dark');
pushRadix('critical', 'red', 'Dark');

await fs.writeFile(path.resolve('../../client/theme', 'palette.ts'), lines.join('\n'));
