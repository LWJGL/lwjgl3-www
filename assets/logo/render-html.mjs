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
  demand: [2, 2],
  usage: `Usage:\n  node ./render.mjs <source.html> <target.png> [options]`,
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
    scale: {
      short: 's',
      type: 'string',
      description: 'device scale factor',
      cast: 'float',
    },
    background: {
      type: 'boolean',
      description: 'render background color',
    },
  },
  strict: true,
  allowPositionals: true,
});

// Read source file
let sourceHtml = await fs.readFile(path.resolve(import.meta.dirname, positionals[0]), { encoding: 'utf-8' });
const screenshotOptions = {
  type: 'png',
  omitBackground: argv.background === undefined,
};

// Launch browser
const debuggerUrl = await getDebuggerUrl();
const browser = await puppeteer.connect({
  browserWSEndpoint: debuggerUrl,
  defaultViewport: {
    width: argv.w,
    height: argv.h,
    deviceScaleFactor: argv.scale,
  },
});

// Begin rendering
const page = await browser.newPage();
await page.setContent(sourceHtml, { waitUntil: ['domcontentloaded', 'networkidle0'] });
const data = await page.screenshot(screenshotOptions);
await fs.writeFile(path.resolve(import.meta.dirname, positionals[1]), data);

// Cleanup
await page.close();
await browser.disconnect();
// await browser.close();
