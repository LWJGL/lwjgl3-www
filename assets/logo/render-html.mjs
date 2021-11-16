import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer-core';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { fetch } from 'undici';

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
  .usage('Usage: $0 <source.html> <target.png> [options]')
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
  .option('scale', {
    alias: 's',
    type: 'number',
    default: 1,
    describe: 'device scale factor',
  })
  .option('background', {
    alias: 'bg',
    type: 'boolean',
    describe: 'render background color',
  }).argv;

async function main() {
  // Read source file
  let sourceHtml = await fs.readFile(path.resolve(__dirname, argv._[0]), { encoding: 'utf-8' });
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
  await fs.writeFile(path.resolve(__dirname, argv._[1]), data);

  // Cleanup
  await page.close();
  await browser.disconnect();
  // await browser.close();
}

main();
