'use strict';
const prettyBytes = num => `${(num / 1000).toFixed(2)} kB`;

module.exports = prettyBytes;
