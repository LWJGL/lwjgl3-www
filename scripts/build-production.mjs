import path from 'node:path';
import { opendir, unlink, writeFile } from 'node:fs/promises';
import webpack from 'webpack';
import config from '../webpack.config.js';

const buildPath = path.resolve(import.meta.dirname, '../public/js');

// Cleanup build directory
const buildDir = await opendir(buildPath);
for await (const entry of buildDir) {
  const ext = path.extname(entry.name);
  // Remove all JS files and webpack manifest. Keep everything else, including deploy.json
  if (ext === '.js' || (ext === '.json' && entry.name === 'webpack.manifest.json')) {
    await unlink(path.resolve(buildPath, entry.name));
  }
}

// console.log(`Compiling JS in ${process.env.NODE_ENV === 'production' ? 'production' : 'development'} mode...`);

// Build with webpack
config.plugins.push(new webpack.ProgressPlugin());
const compiler = webpack(config);
compiler.run((err, stats) => {
  compiler.close(async () => {
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
      process.exit(1);
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
        }),
      );
      process.exit(1);
    }

    if (stats.hasWarnings()) {
      console.error(
        stats.toString({
          colors: true,
          all: false,
          maxModules: 0,
          warnings: true,
        }),
      );
    }

    await writeFile(
      path.resolve(import.meta.dirname, '../public/js/webpack.manifest.json'),
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
        2,
      ),
      { encoding: 'utf8' },
    );
  });
});
