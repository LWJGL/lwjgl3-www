'use strict';
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const config = require('../webpack.config.js');
config.plugins.push(new webpack.ProgressPlugin());

const compiler = webpack(config);

compiler.run((err, stats) => {
  if (err) {
    console.error(err.stack || err);
    if (err.details) {
      console.error(err.details);
    }
    return;
  }

  if (stats.hasErrors()) {
    console.error(
      stats.toString({
        colors: true,
        all: false,
        maxModules: 0,
        errors: true,
        errorDetails: true,
        warnings: false,
      })
    );
    return;
  }

  if (stats.hasWarnings()) {
    console.error(
      stats.toString({
        colors: true,
        all: false,
        maxModules: 0,
        warnings: true,
      })
    );
  }

  fs.writeFileSync(
    path.resolve(__dirname, '../public/js/webpack.manifest.json'),
    JSON.stringify(
      stats.toJson({
        colors: false,
        // all: false,
        all: true,
        entrypoints: true,
        assets: true,
        chunkGroups: true,
      }),
      null,
      2
    )
  );

  compiler.close(() => {
    // all done
  });
});
