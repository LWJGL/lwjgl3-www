import chalk from 'chalk';
import prettyBytes from './prettyBytes.mjs';

const kB = 1000;
const warnFileSizes = [10, 150, 250];
const warnFileSizesGzipped = [5, 75, 150];
const warnFileSizesRoot = [200, 400, 600];
const warnFileSizesRootGzipped = [100, 150, 250];
const warnFileSizesCSS = [25, 75, 100];
const warnFileSizesCSSGzipped = [10, 30, 60];

export default function formatSize(size, isGzip, isRoot, isCss) {
  let limits;

  if (isGzip) {
    if (isCss) {
      limits = warnFileSizesCSSGzipped;
    } else {
      limits = isRoot ? warnFileSizesRootGzipped : warnFileSizesGzipped;
    }
  } else {
    if (isCss) {
      limits = warnFileSizesCSS;
    } else {
      limits = isRoot ? warnFileSizesRoot : warnFileSizes;
    }
  }

  if (size >= limits[2] * kB) {
    return chalk`{red ${prettyBytes(size)}}`;
  } else if (size >= limits[1] * kB) {
    return chalk`{yellow ${prettyBytes(size)}}`;
  } else if (size <= limits[0] * kB) {
    return chalk`{green ${prettyBytes(size)}}`;
  }

  return prettyBytes(size);
}
