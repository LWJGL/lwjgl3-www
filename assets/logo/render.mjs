import path from 'node:path';
import fs from 'node:fs/promises';
import puppeteer from 'puppeteer-core';
import { parseArgs } from './parseArgs.mjs';

async function getDebuggerUrl() {
  const response = await fetch('http://localhost:9222/json/version');
  if (!response.ok) {
    throw new Error('Failed to communicate with Chromium');
  }

  const data = await response.json();
  return data.webSocketDebuggerUrl;
}

const { argv, positionals } = parseArgs({
  // args: process.argv.slice(2),
  demand: [2, 2],
  usage: `Usage:\n  node ./render.mjs <source.svg> <target.png> [options]`,
  options: {
    width: {
      short: 'w',
      type: 'string',
      description: 'target image width',
      cast: 'integer',
    },
    height: {
      short: 'h',
      type: 'string',
      description: 'target image height',
      cast: 'integer',
    },
    background: {
      type: 'string',
      description: 'target image background color',
    },
    safe: {
      short: 's',
      type: 'boolean',
      description: 'adds 2/5 (40%) safe zone padding',
    },
    padding: {
      short: 'p',
      type: 'string',
      description: 'adds padding to final image',
      cast: 'integer',
    },
    radius: {
      short: 'r',
      type: 'string',
      description: 'adds border-radius to background',
      cast: 'integer',
    },
    avatar: {
      short: 'a',
      type: 'boolean',
      description: 'fit graphic inside a circle that touches the edges',
    },
  },
  strict: true,
  allowPositionals: true,
});

// read source file
let source = await fs.readFile(path.resolve(import.meta.dirname, positionals[0]), { encoding: 'utf-8' });
const options = {
  type: 'png',
  omitBackground: argv.background === undefined || argv.radius !== undefined,
};

if (argv.safe) {
  // Because we don't know the ratio of the actual graphic
  // the best thing we can do is find the largest square that fits the safe zone circle

  // Compute safe zone radius (2/5 = 40%)
  const r = Math.min(argv.width, argv.height) * 0.4;

  // The square that fits the circle has a diagonal (D) equal to r * 2.
  // Use the Pythagorean to compute side length
  // A^2 + B^2 = D^2
  // Since it is a square, the other two sides (A, B) of the triangle have equal length
  // 2 * (A^2) = D^2
  // Since we know D, we can compute A
  // A = sqrt(D^2 / 2)
  const side = Math.sqrt(Math.pow(r * 2, 2) / 2);
  argv.padding = (Math.max(argv.width, argv.height) - side) / 2;
} else if (argv.avatar) {
  // Fit graphic inside a circle that touches the edges
  const d = Math.min(argv.width, argv.height);
  const side = Math.sqrt(Math.pow(d, 2) / 2);
  argv.padding = (Math.max(argv.width, argv.height) - side) / 2;
}

const style = ['display:flex;justify-content:center;align-items:center'];
style.push(`width:${argv.width}px`);
style.push(`height:${argv.height}px`);
if (argv.padding !== undefined) {
  style.push(`padding:${argv.padding}px`);
}
if (argv.background !== undefined) {
  style.push(`background-color:${argv.background}`);
}
if (argv.radius !== undefined) {
  style.push(`border-radius:${argv.radius}px`);
}

// prettier-ignore
source = `<!DOCTYPE html>
<html>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { background: transparent; }
    :root {${argv.var !== undefined ? argv.var : ''}}
  </style>
  <body>
    <div style="${style.join(';')}">
      ${source.replace(/<svg/, `<svg width="100%" height="100%"`)}
    </div>
  </body>
  </html>`;

// await fs.writeFile(path.resolve(import.meta.dirname, 'output.html'), source);

// Launch browser

const debuggerUrl = await getDebuggerUrl();
const browser = await puppeteer.connect({
  browserWSEndpoint: debuggerUrl,
  defaultViewport: {
    width: argv.w,
    height: argv.h,
  },
});

// Begin rendering
const page = await browser.newPage();
await page.setContent(source, { waitUntil: ['domcontentloaded', 'networkidle0'] });
const data = await page.screenshot(options);
await fs.writeFile(path.resolve(import.meta.dirname, positionals[1]), data);

// Cleanup
await page.close();
await browser.disconnect();
// await browser.close();
