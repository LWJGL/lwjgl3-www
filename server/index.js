import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import favicon from 'serve-favicon';
import yargs from 'yargs';
import chalk from 'chalk';
import request from 'request-promise-native';

import { fileExists } from './fileExists.js';
import { subnets } from './cloudfront-subnets.js';
import { chunkMap } from './chunkMap.js';
import { helmetConfig } from './helmetConfig.js';

import routeBin from './bin.js';
import routeBuild from './build.js';
import routeBrowse from './browse.js';

import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const filePath = fileURLToPath(import.meta.url);
const __dirname = path.dirname(filePath);
// const __filename = path.parse(filePath).base;
const argv = yargs.argv;
const require = createRequire(import.meta.url);

// ------------------------------------------------------------------------------
// Initialize & Configure Application
// ------------------------------------------------------------------------------

const configFile = path.resolve(__dirname, '../config.json');
const config = fileExists(configFile) ? JSON.parse(fs.readFileSync(configFile)) : {};

const PRODUCT = 'lwjgl.org';
const PORT = config.port || parseInt(process.env.PORT, 10) || 80;
const HOST = config.host || process.env.HOST || '0.0.0.0';

const app = express();

app.locals.development = app.get('env') === 'development';
app.locals.production = !app.locals.development;

const CSS_MODE = app.locals.development && argv.css ? 'HMR' : 'LINK';
let manifest = {};
let serviceWorkerCache = null;

// View options
app.locals.pretty = app.locals.development || argv.pretty ? '  ' : false;
app.locals.cache = app.locals.production && argv.nocache === undefined;

app.set('port', PORT);
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

app.enable('case sensitive routing');
app.enable('strict routing');
app.disable('x-powered-by');
app.use(compression());

app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal', ...subnets]);

// ------------------------------------------------------------------------------
// Configure Content-Type
// ------------------------------------------------------------------------------
express.static.mime.define(
  {
    'text/javascript; charset=utf-8': ['js'],
    'application/json; charset=utf-8': ['json'],
    'application/manifest+json; charset=utf-8': ['webmanifest'],
  },
  true
);

// ------------------------------------------------------------------------------
// Middleware
// ------------------------------------------------------------------------------
if (app.locals.development) {
  const webpack = require('webpack');
  const webpackConfig = require('../webpack.config.cjs');
  const webpackCompiler = webpack(webpackConfig);
  const wdm = require('webpack-dev-middleware').default;

  app.use(
    wdm(webpackCompiler, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    })
  );

  if (argv.nohmr === undefined) {
    app.use(
      require('webpack-hot-middleware')(webpackCompiler, {
        path: '/__webpack_hmr',
        heartbeat: 10 * 1000,
        noInfo: false,
        quiet: false,
      })
    );
  }
}

if (app.locals.development || argv.s3proxy) {
  /*
    In production we handle photos and downloads at the CDN level.
    In development these paths will hit Node, therefore we need to handle them.
    CAUTION: Internet connection is required!
  */
  const { createProxyMiddleware } = require('http-proxy-middleware');

  // Proxy photos from S3
  app.use('/img', createProxyMiddleware({ target: 'http://cdn.lwjgl.org.s3.amazonaws.com', changeOrigin: true }));
  app.use('/svg', createProxyMiddleware({ target: 'http://cdn.lwjgl.org.s3.amazonaws.com', changeOrigin: true }));
}

// ------------------------------------------------------------------------------
// Routing
// ------------------------------------------------------------------------------

// Redirect requests from http://lwjgl.org/* to https://www.lwjgl.org/
// TODO: Use a reverse-proxy for this
app.use((req, res, next) => {
  if (req.hostname === 'lwjgl.org') {
    res.redirect(301, `https://www.lwjgl.org${req.originalUrl}`);
    return;
  }
  next();
});

// Static Assets
// TODO: Use a reverse-proxy for these
app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));
app.use(
  express.static(path.join(__dirname, '../public'), {
    index: false,
    etag: true,
    immutable: true,
    lastModified: true,
    maxAge: 365 * 24 * 60 * 60 * 1000,
    setHeaders: (res, path, stat) => {
      if (app.locals.development) {
        res.set('Access-Control-Allow-Origin', '*');
      }
      switch (res.req.url) {
        case '/manifest.webmanifest':
        case '/sitemap.xml':
        case '/browserconfig.xml':
          res.set({
            'Cache-Control': 'private, max-age=0',
            Expires: '-1',
          });
          break;
        default:
          res.set('Cache-Control', 'public,max-age=31536000,immutable');
      }
    },
  })
);

if (app.locals.development) {
  // Allow source access in development
  // Required for Sass source maps to be resolved by browsers when HMR is off
  app.use(
    '/client',
    express.static(path.join(__dirname, '../client'), {
      index: false,
      etag: true,
      immutable: false,
      lastModified: true,
      maxAge: -1,
    })
  );
  app.use(
    '/node_modules',
    express.static(path.join(__dirname, '../node_modules'), {
      index: false,
      etag: true,
      immutable: false,
      lastModified: true,
      maxAge: -1,
    })
  );
}

let applyHelmet;

app.use((req, res, next) => {
  if (!applyHelmet) {
    applyHelmet = helmet(helmetConfig(app.locals.production, req.hostname === 'www.lwjgl.org'));
  }
  applyHelmet(req, res, next);
});

// Redownloads and parses JS manifest from S3
app.get('/dev/reload', (req, res) => {
  // Update manifest
  downloadManifest(() => {
    // Reset service worker cache so it gets rebuilt on next request
    // If a single byte has changed, clients should update their cache
    serviceWorkerCache = null;

    res.type('text').status(200).send('Manifest has been updated.');
  });
});

// Retrieval of artifacts dir/file structure
app.get('/bin/:build', routeBin);
app.get('/bin/:build/:version', routeBin);

// S3 bucket listing
app.get('/list', routeBrowse);

// S3 build information
app.get('/build/:build', routeBuild);
app.get('/build/:build/:version', routeBuild);

// Legacy re-directs
app.get('/license.php', (req, res) => res.redirect(301, '/license'));
app.get('/demos.php', (req, res) => {
  res.redirect(302, 'http://legacy.lwjgl.org/demos.php.html');
});
app.get('/download.php', (req, res) => res.redirect(301, '/download'));
app.get('/credits.php', (req, res) => res.redirect(301, '/#credits'));
app.get('/projects.php', (req, res) => {
  res.redirect(302, 'http://legacy.lwjgl.org/projects.php.html');
});
app.get('/links.php', (req, res) => {
  res.redirect(302, 'http://wiki.lwjgl.org/wiki/Links_and_Resources.html');
});
app.get('/forum/*', (req, res) => {
  res.redirect(302, `http://forum.lwjgl.org${req.originalUrl.replace(/^\/forum/, '')}`);
});
app.get('/wiki/*', (req, res) => {
  res.redirect(302, `http://wiki.lwjgl.org${req.originalUrl.replace(/^\/wiki/, '')}`);
});

// Service Worker
app.get('/sw.js', async (req, res) => {
  if (serviceWorkerCache === null) {
    let swJS;

    // Read service worker source code
    if (argv.test || app.locals.development) {
      swJS = await fs.promises.readFile(path.join(__dirname, '../client', 'sw.js'));
    } else {
      swJS = await request.get('http://s3.amazonaws.com/cdn.lwjgl.org/js/sw.js');
    }

    // Append manifest as JS object
    swJS = swJS.toString().replace(/manifest = {}/, `manifest = ${JSON.stringify(manifest)}`);

    // Hash SW code and set it as VERSION
    const MD5 = crypto.createHash('MD5');
    MD5.update(swJS);
    swJS = swJS.replace(/VERSION/, MD5.digest('hex'));

    // Store SW script source so we can serve from memory
    serviceWorkerCache = swJS;
  }

  res.type('text/javascript').send(serviceWorkerCache);
});

// App
app.get('*', (req, res, next) => {
  const renderOptions = {
    // ga: globals.google_analytics_id,
  };

  if (app.locals.production) {
    renderOptions.entry = manifest.assets[manifest.entry];
    renderOptions.css = manifest.assets.css;

    // Asset preloading
    // These headers may be picked by supported CDNs or other reverse-proxies and push the assets via HTTP/2
    // To disable PUSH, append "; nopush"
    // More details: https://blog.cloudflare.com/announcing-support-for-http-2-server-push-2/

    // Push entries, we need to start loading as soon as possible
    const preload = [
      `\</js/${renderOptions.entry}\>; rel=preload; as=script`,
      `\</css/${manifest.assets.css}\>; rel=preload; as=style`,
    ];

    // Append chunk of important routes to the preload list
    // Logic can be customized as needed. Can get complicated for recursive routes
    // or routes deep in site's hierarchy, so not always worth it
    const routes = chunkMap(manifest.routes, req.path);
    if (routes !== null) {
      preload.push(...routes.map(id => `\</js/${manifest.assets[id]}\>; rel=preload; as=script`));
    }

    preload.push(`\<https://unpkg.com/\>; rel=preconnect`);
    res.set('Link', preload);
  } else {
    renderOptions.entry = 'main.js';
    if (CSS_MODE === 'LINK') {
      renderOptions.css = 'core-dev.css';
    }
  }

  res
    .set({
      'Cache-Control': 'no-cache, no-store, no-transform, max-age=0',
      'Content-Language': 'en',
      Expires: '-1',
    })
    .render('index', renderOptions);
});

// Page not found
app.use((req, res) => {
  res
    .set({
      'Cache-Control': 'no-transform, max-age=30',
    })
    .status(404);

  if (req.is('json')) {
    res.json({ error: 'Not found' });
    return;
  }

  res.render('404');
});

// Error handling
app.use((err, req, res, next) => {
  res
    .set({
      'Cache-Control': 'no-transform, max-age=5',
    })
    .status(500);

  if (req.is('json')) {
    // JSON
    if (err instanceof Error) {
      if (req.app.locals.development) {
        const errorResponse = {};

        Object.getOwnPropertyNames(err).forEach(key => {
          errorResponse[key] = err[key];
        });

        res.json({ error: errorResponse });
      } else {
        // Only keep message in production because Error() may contain sensitive information
        res.json({ error: { message: err.message } });
      }
    } else {
      res.send({ error: err });
    }
  } else if (req.is('text/plain')) {
    // default to plain-text.
    // keep only message
    res.type('text/plain').send(err.message);
  }

  // HTML
  res.render('500', { error: err });
});

// ------------------------------------------------------------------------------
// JS Manifest
// ------------------------------------------------------------------------------
const downloadManifest = async cb => {
  if (app.locals.development) {
    cb();
    return;
  }
  if (argv.test) {
    manifest = require('../public/js/manifest.json');
    cb();
    return;
  }

  // Load manifest from S3
  if (app.locals.development) {
    console.log('Downloading manifest');
  }

  try {
    manifest = JSON.parse(await request.get('http://s3.amazonaws.com/cdn.lwjgl.org/js/manifest.json'));
  } catch (err) {
    console.error(chalk`{red failed to download manifest files: ${err.message}}`);
    process.exit(1);
  }
  cb();
};

// ------------------------------------------------------------------------------
// Launch Server
// ------------------------------------------------------------------------------

const launchServer = () => {
  console.log(chalk`{yellow Starting {green.bold ${PRODUCT}} in ${app.get('env')} mode}`);

  const server = app.listen(PORT, HOST, () => {
    let host = server.address().address;
    let port = server.address().port;

    console.log(chalk`{green.bold ${PRODUCT}} {yellow listening at http://${host}:${port}}`);
  });

  server.on('error', err => {
    if (err.code === 'EADDRINUSE') {
      console.error(chalk`{red {green.bold ${PRODUCT}} address in use, exiting...}`);
      process.exit(1);
    } else {
      console.error(err.stack);
      throw err;
    }
  });

  function shutdown(code) {
    console.log(chalk`{red Shutting down} {green.bold ${PRODUCT}}`);
    server.close();
    process.exit(code || 0);
  }

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

  process.on('uncaughtException', function (err) {
    console.error(err.stack);
    shutdown(1);
  });
};

downloadManifest(launchServer);
