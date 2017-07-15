'use strict';

// Server
const fs = require('fs');
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const favicon = require('serve-favicon');
const { argv } = require('yargs');
const chalk = require('chalk');
const proxy = require('http-proxy-middleware');

// AWS
const AWS = require('aws-sdk');
AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile: 'default' });
AWS.config.update({ region: 'us-east-1' });

// Lib
const cloudFrontSubnets = require('./cloudfront-subnets.json');
const chunkMap = require('./chunkMap');
const helmetConfig = require('./helmetConfig');

// ------------------------------------------------------------------------------
// Initialize & Configure Application
// ------------------------------------------------------------------------------

const PRODUCT = 'lwjgl.org';
const app = express();
const config = require('../config.json');

app.locals.development = app.get('env') === 'development';
app.locals.production = !app.locals.development;

let manifest = {};

// View options
app.locals.pretty = app.locals.development || argv.pretty ? '  ' : false;
app.locals.cache = app.locals.production && argv.nocache === undefined;

app.set('port', config.port || 80);
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

app.enable('case sensitive routing');
app.enable('strict routing');
app.disable('x-powered-by');

app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal', ...cloudFrontSubnets]);

// ------------------------------------------------------------------------------
// Middleware
// ------------------------------------------------------------------------------
app.use(helmet(helmetConfig(app.locals.production)));
app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));

if (app.locals.development) {
  const webpack = require('webpack');
  const webpackConfig = require('../webpack.config');
  const webpackCompiler = webpack(webpackConfig);

  app.use(
    require('webpack-dev-middleware')(webpackCompiler, {
      noInfo: true,
      publicPath: webpackConfig.output.publicPath,
      stats: {
        colors: true,
        reasons: false,
      },
    })
  );

  if (argv.nohmr === undefined) {
    app.use(
      require('webpack-hot-middleware')(webpackCompiler, {
        path: '/__webpack_hmr',
        heartbeat: 10 * 1000,
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

  // Proxy photos from S3
  app.use('/img', proxy({ target: 'http://cdn.lwjgl.org.s3.amazonaws.com', changeOrigin: true }));
  app.use('/svg', proxy({ target: 'http://cdn.lwjgl.org.s3.amazonaws.com', changeOrigin: true }));
}

// ------------------------------------------------------------------------------
// Routing
// ------------------------------------------------------------------------------

app.use((req, res, next) => {
  if (req.hostname === 'lwjgl.org') {
    res.redirect(301, `https://www.lwjgl.org${req.originalUrl}`);
    return;
  }
  next();
});

// Static Assets
app.use(
  express.static(path.join(__dirname, '../public'), {
    index: false,
    setHeaders: res => {
      // Send immutable Cache-Control flag
      // https://bitsup.blogspot.com/2016/05/cache-control-immutable.html
      res.set('Cache-Control', 'public,max-age=31536000,immutable');
    },
  })
);

// Redownloads and parses JS manifest from S3
app.get('/dev/reload', (req, res) => {
  downloadManifest(() => {
    res.type('text').status(200).send('Manifest has been updated.');
  });
});

// Retrieval of artifacts dir/file structure
const routeBin = require('./bin');
app.get('/bin/:build', routeBin);
app.get('/bin/:build/:version', routeBin);

// S3 bucket browsing
app.get('/browse', require('./browse'));

// S3 build information
const routeBuild = require('./build');
app.get('/build/:build', routeBuild);
app.get('/build/:build/:version', routeBuild);

// Legacy re-directs
app.get('/license.php', (req, res) => res.redirect(301, '/license'));

// App
app.get('*', (req, res, next) => {
  if (req.accepts('html', '*/*') !== 'html') {
    next();
    return;
  }

  let preloadScripts;
  let entry;
  let webpackManifest;

  if (app.locals.production) {
    // Set entry point
    entry = manifest.entry;

    // Webpack manifest (pre-generated script ready for injection, see above)
    webpackManifest = manifest.chunksSerialized;

    preloadScripts = [
      // Push entry script first, we need to start loading as soon as possible
      // because we need it immediately
      entry,

      // Append chunk of important routes to the preload list
      // Logic can be customized as needed. Can get complicated for recursive routes
      // or routes deep in site's hierarchy, so not always worth it
      ...chunkMap(manifest.routes, req.path),
    ];
  } else {
    entry = 'main.js';
    preloadScripts = ['vendor.js', entry];
  }

  // Asset preloading
  // These headers may be picked by supported CDNs or other reverse-proxies and push the assets via HTTP/2
  // To disable PUSH, append "; nopush"
  // More details: https://blog.cloudflare.com/announcing-support-for-http-2-server-push-2/
  const linkHeaders = [...preloadScripts.map(script => `\</js/${script}\>; rel=preload; as=script`)];

  // Append Link headers
  res.set('Link', linkHeaders);

  res.render('index', {
    webpackManifest,
    entry,
  });
});

// Page not found
app.use((req, res) => {
  res.status(404);

  if (req.accepts('html', '*/*') === 'html') {
    res.render('404');
    return;
  }

  if (req.accepts('json', '*/*') === 'json') {
    res.send({ error: 'Not found' });
    return;
  }

  res.type('txt').send();
});

// Error handling
app.use((err, req, res, next) => {
  res.status(500);

  if (req.accepts('html', '*/*') === 'html') {
    // HTML
    res.render('500', { error: err });
  } else if (req.accepts('json', '*/*') === 'json') {
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
  } else {
    // default to plain-text.
    // keep only message
    res.type('txt').send(err.message);
  }
});

// ------------------------------------------------------------------------------
// JS Manifest
// ------------------------------------------------------------------------------
const processManifest = () => {
  // Convert chunks object to JSON so we can inject it in the page as <script>
  if (manifest.chunks) {
    manifest.chunksSerialized = JSON.stringify(manifest.chunks);
  }
};

const downloadManifest = cb => {
  if (app.locals.development) {
    cb();
    return;
  }
  if (argv.test) {
    manifest = require('../public/js/manifest.json');
    processManifest();
    cb();
    return;
  }

  // Load manifest from S3
  console.log('Downloading manifest');
  request.get('http://s3.amazonaws.com/cdn.lwjgl.org/js/manifest.json', function(err, response, body) {
    if (err) {
      throw new Error(err);
    }
    if (response.statusCode !== 200) {
      throw new Error(`Error while trying to download manifest.json ${response.statusCode}`);
    }
    manifest = JSON.parse(body);
    processManifest();
    cb();
  });
};

// ------------------------------------------------------------------------------
// Launch Server
// ------------------------------------------------------------------------------

const launchServer = () => {
  console.log(chalk`{yellow Starting {green.bold ${PRODUCT}} in ${app.get('env')} mode}`);

  const server = app.listen(app.get('port'), () => {
    let host = server.address().address;
    let port = server.address().port;

    console.log(chalk`{green.bold ${PRODUCT}} {yellow listening at http://${host}:${port}}`);
  });

  server.on('error', err => {
    if (err.code === 'EADDRINUSE') {
      console.error(chalk`{red {green.bold ${PRODUCT}} address in use, exiting...}`);
      process.exit(0);
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

  process.on('uncaughtException', function(err) {
    console.error(err.stack);
    shutdown(1);
  });
};

downloadManifest(launchServer);
