'use strict';
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const terser = require('terser');
// const minify = require('babel-minify');
const gzipSize = require('gzip-size');
const chalk = require('chalk');

const MINIFY = true;
// const MINIFY = false;

process.on('message', asset => {
  console.log(`Processing ${asset.name}`);
  let contents = asset.src;

  if (MINIFY) {
    // Process with terser
    const terserResult = terser.minify(contents, {
      compress: {
        defaults: false,
        arrows: true,
        arguments: false,
        booleans: true,
        collapse_vars: true,
        comparisons: true,
        computed_props: true,
        conditionals: true,
        dead_code: true,
        drop_console: true,
        drop_debugger: true,
        evaluate: true,
        expression: false,
        // global_defs: {},
        hoist_funs: true,
        hoist_props: true,
        hoist_vars: false,
        if_return: true,
        /*
      false -- same as 0
      0 -- disabled inlining
      1 -- inline simple functions
      2 -- inline functions with arguments
      3 -- inline functions with arguments and variables
      true -- same as 3
      */
        inline: 1,
        join_vars: true,
        keep_classnames: false,
        keep_fargs: false,
        keep_fnames: false,
        keep_infinity: true,
        loops: true,
        module: false,
        negate_iife: true,
        passes: 2,
        properties: true,
        pure_funcs: null,
        pure_getters: true,
        reduce_funcs: true,
        reduce_vars: true,
        sequences: true,
        side_effects: true,
        switches: true,
        toplevel: false,
        top_retain: null,
        typeofs: true,
        unsafe: false,
        unsafe_arrows: false,
        unsafe_comps: true,
        unsafe_Function: true,
        unsafe_math: false,
        unsafe_methods: false,
        unsafe_proto: true,
        unsafe_regexp: true,
        unsafe_undefined: false,
        unused: true,
        warnings: false,
      },
      mangle: true,
      sourceMap: false,
      ecma: 5,
      ie8: false,
      safari10: true,
      toplevel: true,
      warnings: 'verbose',
    });

    if (terserResult.error) {
      process.send({
        pid: process.pid,
        type: 'error',
        error: terserResult.error,
      });
      return;
    }
    contents = terserResult.code;
  }

  // // Process with babel-minify
  // try {
  //   const minified = minify(
  //     contents,
  //     {
  //       removeConsole: true,
  //       removeDebugger: true,
  //     },
  //     {
  //       sourceMaps: false,
  //     }
  //   );
  //   contents = minified.code;
  // } catch (err) {
  //   process.send({
  //     pid: process.pid,
  //     type: 'error',
  //     error: err.message,
  //   });
  //   return;
  // }

  // Compute hash
  const hash = crypto.createHash('MD5');
  hash.update(contents);
  asset.hash = hash.digest('hex');

  // Compute gzip size
  asset.size = Buffer.byteLength(contents, 'utf8');
  asset.gzipSize = gzipSize.sync(contents);

  if (asset.name === 'main') {
    asset.cdn = 'main.minified.js';
  } else if (asset.route === true || asset.name.indexOf('~') === -1) {
    asset.cdn = `${asset.name}.${asset.hash}.js`;
  } else {
    asset.cdn = `chunk.${asset.hash}.js`;
  }

  // Store to disk
  fs.writeFileSync(path.resolve(__dirname, '../public/js', asset.cdn), contents);

  // Done!
  console.log(chalk`{green Completed ${asset.name}}`);
  process.send({
    pid: process.pid,
    type: 'done',
    asset,
  });
});

process.on('error', error => {
  process.send({
    pid: process.pid,
    type: 'error',
    error,
  });
});

// process.on('disconnect', function() {
//  console.log(`disconnecting: ${process.pid}`);
// });
