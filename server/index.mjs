import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import favicon from 'serve-favicon';
import chalk from 'chalk';
import request from 'request-promise-native';

import { fileExists } from './fileExists.mjs';
import { chunkMap } from './chunkMap.mjs';

import routeBin from './bin.mjs';
import routeBrowse from './browse.mjs';

import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const filePath = fileURLToPath(import.meta.url);
const __dirname = path.dirname(filePath);
// const __filename = path.parse(filePath).base;
const require = createRequire(import.meta.url);

// ------------------------------------------------------------------------------
// Arguments
// ------------------------------------------------------------------------------

const argv = {};

process.argv.slice(2).forEach(arg => {
  switch (arg) {
    case '--pretty':
      argv.pretty = true;
      break;
    case '--nocache':
      argv.nocache = true;
      break;
    case '--nohmr':
      argv.nohmr = true;
      break;
    case '--s3proxy':
      argv.s3proxy = true;
      break;
    case '--test':
      argv.test = true;
      break;
  }
});

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

let manifest = {};
let serviceWorkerCache = null;

// View options
app.locals.pretty = app.locals.development || argv.pretty === true ? '  ' : false;
app.locals.cache = app.locals.production && argv.nocache === undefined;

if (app.locals.production) {
  const styles = await import('./styles.mjs');
  app.locals.css = styles.css;
}

app.set('port', PORT);
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

app.enable('case sensitive routing');
app.enable('strict routing');
app.disable('x-powered-by');
app.use(compression());

// app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal', ...subnets]);

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
  const webpackConfig = require('../webpack.config.js');
  const webpackCompiler = webpack(webpackConfig);
  const wdm = require('webpack-dev-middleware');

  app.use(
    wdm(webpackCompiler, {
      index: false,
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
        overlay: false, // broken on webpack@5
        noInfo: false,
        quiet: false,
      })
    );
  }
}

if (app.locals.development || argv.s3proxy === true) {
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
// Static Routing
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

// ------------------------------------------------------------------------------
// Helmet
// ------------------------------------------------------------------------------
const referrerPolicy = {
  policy: 'no-referrer-when-downgrade',
};

const frameguard = {
  action: 'sameorigin',
};

const hsts = {
  maxAge: 365 * 24 * 60 * 60,
  includeSubDomains: false, // * no because we have non-ssl subdomains (e.g. legacy.lwjgl.org)
  preload: false, // ! includeSubDomains must be true for preloading to be approved
};

/*
app.use((req, res, next) => {
  if (!req.accepts('html')) {
    next();
    return;
  }

  app.locals.nonce = crypto.randomBytes(16).toString('base64');

  // https://csp-evaluator.withgoogle.com/
  helmet.contentSecurityPolicy({
    directives: {
      // defaultSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'unpkg.com'],
      defaultSrc: ["'unsafe-eval'", `'nonce-${app.locals.nonce}'`, "'strict-dynamic'"],
      blockAllMixedContent: [],
      upgradeInsecureRequests: [],
      // requireTrustedTypesFor: ["'script'"],
      frameSrc: ['*'],
      imgSrc: ['*', 'data:'],
    },
  })(req, res, next);
});
*/
// app.use(helmet.dnsPrefetchControl());
// app.use(helmet.expectCt());
app.use(helmet.frameguard(frameguard));
// app.use(helmet.hidePoweredBy());
if (app.locals.production) {
  app.use((req, res, next) => {
    if (req.hostname === 'www.lwjgl.org') {
      helmet.hsts(hsts)(req, res, next);
    } else {
      next();
    }
  });
}
// app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
// app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy(referrerPolicy));
app.use(helmet.xssFilter());

// ------------------------------------------------------------------------------
// Dynamic Routing & Rewrites
// ------------------------------------------------------------------------------

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
    if (argv.test === true || app.locals.development) {
      swJS = await fs.promises.readFile(path.join(__dirname, '../client', 'sw.js'));
    } else {
      swJS = await request.get('http://s3.amazonaws.com/cdn.lwjgl.org/js/sw.js');
    }

    // Append manifest as JS object
    swJS = swJS.toString().replace(/manifest = {}/, `manifest = ${JSON.stringify(manifest)}`);

    // Hash SW code and set it as VERSION
    const MD5 = crypto.createHash('MD5');
    MD5.update(swJS);
    // Also version based on global CSS content
    if (app.locals.css !== undefined) {
      MD5.update(app.locals.css);
    }
    // TODO: we need to also include the HTML content in MD5
    // TODO: Maybe read and use pug files
    // MD5.update(html);
    swJS = swJS.replace(/VERSION/, MD5.digest('hex'));

    // Store SW script source so we can serve from memory
    serviceWorkerCache = swJS;
  }

  res.type('text/javascript').send(serviceWorkerCache);
});

// Return 404 for file requests that not match above
// ! This is required for HMR to keep working after bad compilations
app.get(/[.][a-zA-Z]{2,4}$/, (req, res) => {
  res
    .set({
      'Cache-Control': 'no-transform, max-age=30',
    })
    .sendStatus(404);
});

// Handle everything else client-side
app.get('*', (req, res, next) => {
  const renderOptions = {
    // ga: globals.google_analytics_id,
  };

  if (app.locals.production) {
    renderOptions.entry = manifest.assets[manifest.entry];

    // Asset preloading
    // These headers may be picked by supported CDNs or other reverse-proxies and push the assets via HTTP/2
    // To disable PUSH, append "; nopush"
    // More details: https://blog.cloudflare.com/announcing-support-for-http-2-server-push-2/

    // Push entries, we need to start loading as soon as possible
    const preload = [`\</js/${renderOptions.entry}\>; rel=preload; as=script`];

    // Append chunk of important routes to the preload list
    // Logic can be customized as needed. Can get complicated for recursive routes
    // or routes deep in site's hierarchy, so not always worth it
    const routes = chunkMap(manifest.routes, req.path);
    if (routes !== null) {
      preload.push(...routes.map(id => `\</js/${manifest.assets[id]}\>; rel=preload; as=script`));
    }

    switch (req.path) {
      case '/':
      case '/guide':
        preload.push(`\<https://unpkg.com\>; rel=preconnect`);
        break;
      case '/source':
        preload.push(`\<https://api.travis-ci.org\>; rel=preconnect`);
        preload.push(`\<https://ci.appveyor.com\>; rel=preconnect`);
        preload.push(`\<https://travis-ci.org\>; rel=preconnect`);
        break;
    }

    res.set('Link', preload);
  } else {
    renderOptions.entry = 'main.js';
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

  if (req.accepts('json')) {
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
  } else if (req.accepts('text/plain')) {
    // default to plain-text.
    // keep only message
    res.type('text/plain').send(err.message);
  } else {
    // HTML
    res.render('500', { error: err });
  }
});

// ------------------------------------------------------------------------------
// JS Manifest
// ------------------------------------------------------------------------------
const downloadManifest = async cb => {
  if (app.locals.development) {
    cb();
    return;
  }
  if (argv.test === true) {
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
