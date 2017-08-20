// @flow
'use strict';
const chalk = require('chalk');
const prettyBytes = require('./prettyBytes');

/*::
type SIZES = [number, number, number];
*/

const kB /*: number */ = 1000;
const warnFileSizes /*: SIZES */ = [10, 150, 250];
const warnFileSizesGzipped /*: SIZES */ = [5, 75, 150];
const warnFileSizesRoot /*: SIZES */ = [200, 400, 600];
const warnFileSizesRootGzipped /*: SIZES */ = [100, 150, 250];
const warnFileSizesCSS /*: SIZES */ = [25, 75, 100];
const warnFileSizesCSSGzipped /*: SIZES */ = [10, 30, 60];

const formatSize = (size /*: number*/, isGzip /*: boolean*/, isRoot /*: boolean*/, isCss /*: boolean*/) => {
  let limits /*: SIZES */;

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
};

module.exports = formatSize;
