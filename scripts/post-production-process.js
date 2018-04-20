'use strict';
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const uglify = require('uglify-es');
// const minify = require('babel-minify');
const gzipSize = require('gzip-size');
const chalk = require('chalk');

// We'll us this to detect route chunks
const routeRegExp = new RegExp('^route[-][a-z][a-z-_/]+$');

process.on('message', chunk => {
  const chunkName = chunk.names[0];
  const chunkFilename = chunk.files[0];
  console.log(`Processing ${chunkName}`);

  const originalPath = path.resolve(__dirname, '../public/js', chunkFilename);

  const report = {
    originalName: chunkFilename,
    name: chunkFilename,
    hash: '',
    isEntry: false,
    isRoute: false,
    originalSize: fs.statSync(originalPath).size,
    size: 0,
    gzipSize: 0,
  };

  // Read contents
  let contents = fs.readFileSync(originalPath, { encoding: 'utf-8' });

  if (chunkName === 'runtime~main') {
    // Replace chunk filenames
    chunk.chunkFileMap.forEach(item => {
      contents = contents.replace(item.name, item.hashed);
    });
  }

  // Process with uglify-es
  const uglifyResult = uglify.minify(contents, {
    compress: {
      drop_console: true,
      inline: true,
      keep_fargs: false,
      keep_infinity: true,
      passes: 2,
      pure_getters: true,
      unsafe_comps: true,
      unsafe_Function: true,
      unsafe_proto: true,
      unsafe_regexp: true,
    },
    mangle: true,
    sourceMap: false,
    ecma: 5,
    ie8: false,
    safari10: true,
    toplevel: true,
    warnings: 'verbose',
  });

  if (uglifyResult.error) {
    process.send({
      pid: process.pid,
      type: 'error',
      error: uglifyResult.error,
    });
    return;
  }
  contents = uglifyResult.code;

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
  report.hash = hash.digest('hex');

  // Compute gzip size
  report.size = Buffer.byteLength(contents, 'utf8');
  report.gzipSize = gzipSize.sync(contents);
  report.name = `${chunkName}.${report.hash}.js`;

  // Store reference so we can deploy later
  process.send({
    type: 'manifest-file',
    name: report.name,
  });

  if (chunkName === 'main') {
    report.isEntry = true;
    process.send({
      type: 'manifest-entry',
      name: report.name,
    });
  } else if (chunkName === 'runtime~main') {
    process.send({
      type: 'manifest-webpack',
      name: report.name,
    });
  } else {
    // Detect route
    const route = chunkName.match(routeRegExp);
    if (route !== null) {
      report.isRoute = true;
      process.send({
        type: 'manifest-route',
        route: chunkName.substr('route-'.length),
        name: report.name,
      });
    }
  }

  // Push to chunkFileMap
  if (chunkName !== 'runtime~main') {
    process.send({
      type: 'manifest-chunk',
      file: {
        id: chunk.id,
        name: chunkName,
        hashed: `${chunkName}.${report.hash}`,
      },
    });
  }

  // Store to disk
  fs.writeFileSync(path.resolve(__dirname, '../public/js', report.name), contents);

  // Done!
  console.log(chalk`{green Completed ${chunkName}}`);
  process.send({
    pid: process.pid,
    type: 'done',
    report,
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
