"use strict";

// Server
const fs = require('fs');
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const favicon = require('serve-favicon');
const { argv } = require('yargs');
const chalk = require('chalk');

// AWS
const AWS = require('aws-sdk');
AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: 'default'});
AWS.config.update({region: 'us-east-1'});

// Lib
const getDevice = require('./getDevice');

// ------------------------------------------------------------------------------
// Initialize & Configure Application
// ------------------------------------------------------------------------------

const PRODUCT = 'lwjgl.org';
const app = express();
const config = require('../config.json');

app.set('port', config.server.port);
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

app.enable('case sensitive routing');
app.enable('strict routing');
app.disable('x-powered-by');

app.set('trust proxy', [
  'loopback',
  'linklocal',
  'uniquelocal',
  // Cloudfront subnets
  '13.32.0.0/15',
  '52.46.0.0/18',
  '52.84.0.0/15',
  '52.222.128.0/17',
  '54.182.0.0/16',
  '54.192.0.0/16',
  '54.230.0.0/16',
  '54.239.128.0/18',
  '54.239.192.0/19',
  '54.240.128.0/18',
  '204.246.164.0/22',
  '204.246.168.0/22',
  '204.246.174.0/23',
  '204.246.176.0/20',
  '205.251.192.0/19',
  '205.251.249.0/24',
  '205.251.250.0/23',
  '205.251.252.0/23',
  '205.251.254.0/24',
  '216.137.32.0/19'
]);

app.locals.development = app.get('env') === 'development';
app.locals.production = !app.locals.development;

// View options
app.locals.doctype = 'html';
app.locals.pretty = app.locals.development || argv.pretty ? '  ' : false;
app.locals.compileDebug = false;
app.locals.cache = app.locals.production && argv.nocache === undefined;

if ( app.locals.development ) {
  console.log(chalk.yellow(`Starting ${PRODUCT} in ${app.get('env')} mode`));
}

// ------------------------------------------------------------------------------
// Middleware
// ------------------------------------------------------------------------------
//noinspection JSUnusedGlobalSymbols
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: [
        "'self'",
        "build.lwjgl.org",
        '*.google-analytics.com',
      ],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        '*.google-analytics.com',
        'cdnjs.cloudflare.com',
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        '*.google-analytics.com',
        'cdnjs.cloudflare.com',
      ],
      imgSrc: [
        "'self'",
        'data:',
        '*.google-analytics.com',
        'api.travis-ci.org',
        'travis-ci.org'
      ],
      frameAncestors: ["'none'"],
      objectSrc: ["'none'"]
    }
  },
  dnsPrefetchControl: {
    allow: false
  },
  frameguard: {
    action: 'deny'
  },
  hidePoweredBy: false,
  /*
  hpkp: {
    maxAge: 7 * 24 * 60 * 60,
    sha256s: [
      // https://www.amazontrust.com/repository/
      new Buffer('2b071c59a0a0ae76b0eadb2bad23bad4580b69c3601b630c2eaf0613afa83f92').toString('base64'),
      new Buffer('f7ecded5c66047d28ed6466b543c40e0743abe81d109254dcf845d4c2c7853c5').toString('base64'),
      new Buffer('36abc32656acfc645c61b71613c4bf21c787f5cabbee48348d58597803d7abc9').toString('base64'),
      new Buffer('7f4296fc5b6a4e3b35d3c369623e364ab1af381d8fa7121533c9d6c633ea2461').toString('base64'),
      new Buffer('fbe3018031f9586bcbf41727e417b7d1c45c2f47f93be372a17b96b50757d5a2').toString('base64'),
    ],
    includeSubDomains: false,
    setIf: (req, res) => app.locals.production && req.hostname === 'www.lwjgl.org'
  },
  */
  hsts: {
    maxAge: 365 * 24 * 60 * 60,
    includeSubDomains: false,
    // TODO: includeSubDomains must be true for preloading to be approved
    preload: true,
    setIf: (req, res) => app.locals.production && req.hostname === 'www.lwjgl.org'
  },
  ieNoOpen: false,
  noSniff: true,
  referrerPolicy: false,
  xssFilter: true
}));

app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));

if ( app.locals.development ) {
  const webpack = require('webpack');
  const webpackConfig = require('../webpack.js.config');
  const webpackCompiler = webpack(webpackConfig);

  app.use(require('webpack-dev-middleware')(webpackCompiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
    stats: {
      colors: true,
      reasons: false,
    }
  }));

  app.use(require('webpack-hot-middleware')(webpackCompiler, {
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000,
  }));

  app.locals.bundle = 'main.js';
  app.locals.css = 'styles.css';

  // Device type detection
  // On production we rely on Cloudfront to get this information for free
  const device = require('express-device');
  app.use(device.capture());
} else {
  app.locals.inline = true;
  app.locals.bundle = fs.readFileSync(`./public/js/${config.manifest.js}`);
  app.locals.css = fs.readFileSync(`./public/css/${config.manifest.css}`);
}

// ------------------------------------------------------------------------------
// Routing
// ------------------------------------------------------------------------------

app.use((req, res, next) =>
{
  if ( req.hostname === 'lwjgl.org' )
  {
    res.redirect(301, `https://www.lwjgl.org${req.originalUrl}`);
    return;
  }
  next();
});

// Static Assets
//noinspection JSUnusedGlobalSymbols
app.use(express.static(path.join(__dirname, '../public'), {
  index: false,
  setHeaders: res => {
    // Send immutable Cache-Control flag
    // https://bitsup.blogspot.com/2016/05/cache-control-immutable.html
    res.set('Cache-Control', 'public,max-age=31536000,immutable');
  }
}));

// Teamcity proxy
app.get('/teamcity', require('./teamcity'));

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

// React server-side rendering
app.get('*', (req, res) => {
  let chunk;

  if ( app.locals.production ) {
    // Get code-split chunk's relative path for this path
    // @see ./process-manifest.js to see how we populate config -- not clean, but it works
    chunk = config.routes[req.path];
  }

  res.render('index', {
    // Load polyfills (blocking) for IE
    ie: req.get('user-agent').indexOf('MSIE') > -1,
    // The only reason we need this is to avoid rendering the homepage video in mobile devices
    bodyClass: getDevice(req),
    chunk
  });
});

// Page not found

// eslint-disable-next-line
app.use((req, res) => {
  res.status(404);

  if ( req.accepts('html', '*/*') === 'html' ) {
    res.render('404');
    return;
  }

  if ( req.accepts('json', '*/*') === 'json' ) {
    res.send({error: 'Not found'});
    return;
  }

  res.type('txt').send();
});

// Error handling
//noinspection JSUnusedLocalSymbols
app.use((err, req, res, next) => {
  res.status(500);

  if ( req.accepts('html', '*/*') === 'html' ) {
    // HTML
    res.render('500', {error: err});
  } else if ( req.accepts('json', '*/*') === 'json' ) {
    // JSON
    if ( err instanceof Error ) {
      if ( req.app.locals.development ) {
        const errorResponse = {};

        Object.getOwnPropertyNames(err).forEach(key => {
          errorResponse[key] = err[key];
        });

        res.json({error: errorResponse});
      } else {
        // Only keep message in production because Error() may contain sensitive information
        res.json({error: {message: err.message}});
      }
    } else {
      res.send({error: err});
    }
  } else {
    // default to plain-text.
    // keep only message
    res.type('txt').send(err.message);
  }
});

// ------------------------------------------------------------------------------
// Launch Server
// ------------------------------------------------------------------------------

const server = app.listen(app.get('port'), () => {
  let host = server.address().address;
  let port = server.address().port;

  console.log(chalk.blue(`${PRODUCT} listening at http://${host}:${port}`));
});

server.on('error', (err) => {
  if ( err.code === 'EADDRINUSE' ) {
    console.error(chalk.red(`${PRODUCT} address in use, exiting...`));
    process.exit(0);
  } else {
    console.error(err.stack);
    throw err;
  }
});

function shutdown(code) {
  console.log(chalk.blue(`shutting down ${PRODUCT}`));
  server.close();
  process.exit(code || 0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

process.on('uncaughtException', function(err) {
  console.error(err.stack);
  shutdown(1);
});
