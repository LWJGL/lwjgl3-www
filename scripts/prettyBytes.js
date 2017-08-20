// @flow
'use strict';
const prettyBytes = (num /*:number*/) => `${(num / 1000).toFixed(2)} kB`;

module.exports = prettyBytes;
