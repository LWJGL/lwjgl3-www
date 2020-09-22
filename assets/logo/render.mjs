import path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer-core';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import fetch from 'node-fetch';

const filePath = fileURLToPath(import.meta.url);
const __dirname = path.dirname(filePath);

async function getDebuggerUrl() {
  const response = await fetch('http://localhost:9222/json/version');
  if (!response.ok) {
    throw new Error('Failed to communicate with Chromium');
  }

  const data = await response.json();
  return data.webSocketDebuggerUrl;
}

const argv = yargs(hideBin(process.argv))
  .usage('Usage: $0 <source.svg> <target.png> [options]')
  .demandCommand(2, 2)
  .option('width', {
    alias: 'w',
    type: 'number',
    required: true,
    describe: 'target image width',
  })
  .option('height', {
    alias: 'h',
    type: 'number',
    required: true,
    describe: 'target image height',
  })
  .option('background', {
    alias: 'bg',
    type: 'string',
    describe: 'target image background color',
  })
  .option('safe', {
    alias: 's',
    type: 'boolean',
    describe: 'adds 2/5 (40%) safe zone padding',
  })
  .option('padding', {
    alias: 'p',
    type: 'number',
    describe: 'add padding to final image',
  })
  .option('radius', {
    alias: 'r',
    type: 'number',
    describe: 'add border-radius to background',
  }).argv;

async function main() {
  // read source file
  let source = await fs.readFile(path.resolve(__dirname, argv._[0]), { encoding: 'utf-8' });
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

  // await fs.writeFile(path.resolve(__dirname, 'output.html'), source);

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
  await fs.writeFile(path.resolve(__dirname, argv._[1]), data);

  // Cleanup
  await page.close();
  await browser.disconnect();
  // await browser.close();
}

main();
