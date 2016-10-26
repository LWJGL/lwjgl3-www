// Server
import path from 'path'
import express from 'express'
import helmet from 'helmet'
import favicon from 'serve-favicon'
import { argv } from 'yargs'
import chalk from 'chalk'

// Server-side rendering
import React from 'react'
import { renderToString } from 'react-dom/server'
import { ServerRouter, createServerRenderContext } from 'react-router'
import ReactHelmet from 'react-helmet'
import { StyleSheetServer } from 'aphrodite/no-important'
import configureStore from '../client/store/configureStore'
import Layout from '../client/containers/Layout'

const store = configureStore();
const reactCache = {};
let chunks = '{}';

// Routes & helpers
import teamcity from './teamcity';  // For proxying requests to TeamCity
import bin from './bin';  // For returning S3 {build}/bin folder structure
import browse from './browse';  // For browsing S3 bucket
import getDevice from './getDevice';

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
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: [
        "'self'",
        "'unsafe-inline'",
        'build.lwjgl.org',
        '*.google-analytics.com',
        'cdnjs.cloudflare.com',
        'travis-ci.org',
        'api.travis-ci.org'
      ],
      imgSrc: ["'self'", 'data:', '*.google-analytics.com', 'api.travis-ci.org', 'travis-ci.org'],
      objectSrc: [],
      reflectedXss: ['block']
    }
  },
  dnsPrefetchControl: {
    allow: false
  },
  frameguard: {
    action: 'sameorigin'
  },
  hidePoweredBy: false,
  /*
  hpkp: {
    maxAge: 7776000,
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
    maxAge: 31536000,
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

  chunks = JSON.stringify(config.manifest.chunks);
  app.locals.bundle = config.manifest.js;
  app.locals.css = config.manifest.css;

}

// ------------------------------------------------------------------------------
// Routing
// ------------------------------------------------------------------------------

// Static Assets
app.use(express.static(path.join(__dirname, '../public'), {
  index: false,
  setHeaders: res => {
    // Send immutable Cache-Control flag
    // Set s-maxage to 1 month because JS/CSS are updated often, no reason to keep them in CloudFront
    // https://bitsup.blogspot.com/2016/05/cache-control-immutable.html
    res.set('Cache-Control', 'public,max-age=31536000,s-maxage=2592000,immutable');
  }
}));

// Teamcity proxy
app.get('/teamcity', teamcity);

app.get('/bin/:build', bin);
app.get('/bin/:build/:version', bin);

app.get('/browse', browse);

// React server-side rendering
app.get('*', (req, res, next) => {

  // The only reason we need this is to avoid rendering the homepage video in mobile devices
  let bodyClass = getDevice(req);

  // Uncomment to skip server-side rendering
  // res.render('index', {
  //   bodyClass,
  //   ie: req.get('user-agent').indexOf('MSIE') > -1,
  // });
  // return;

  let html, css, head, chunk;

  if ( reactCache[req.path] !== undefined ) {
    // We have already server-side rendered, get data from the cache
    ({html, css, head, chunk} = reactCache[req.path]);

    // We're done, render the view
    res.render('index', {
      html,
      head,
      chunks,
      chunk,
      bodyClass,
      aphrodite: css,
      ie: req.get('user-agent').indexOf('MSIE') > -1,
    });
    return;
  }

  const context = createServerRenderContext();
  ({html, css} = StyleSheetServer.renderStatic( // https://github.com/Khan/aphrodite
    () => renderToString( // https://react-router.now.sh/ServerRouter
      <ServerRouter
        location={req.url}
        context={context}
      >
        {({action, location, router}) => <Layout router={router} action={action} location={location} store={store} />}
      </ServerRouter>
    )
  ));
  const result = context.getResult();

  if ( result.redirect ) {
    res.redirect(302, result.redirect.pathname);
    return;
  }

  if ( result.missed ) {
    // We could re-render here, for the Miss component to pickup the 404.
    // Instead, let the client do the hard work
    // NOTE: It is unfortunate that we have to server-side render for invalid URLs
    res.status(404).render('index', {
      head: {
        title: '<title>Page not found</title>'
      }
    });
    return;
  }

  // https://github.com/nfl/react-helmet#server-usage
  head = ReactHelmet.rewind();

  if ( app.locals.production ) {
    // Get code-split chunk's relative path for this path
    // @see ./process-manifest.js to see how we populate config -- not clean, but it works
    if ( config.routes[req.path] !== undefined ) {
      chunk = config.routes[req.path];
    }
  }

  // OK, cache view data
  reactCache[req.path] = {
    html,
    css,
    head,
    chunk,
  };

  // We're done, render the view
  res.render('index', {
    html,
    head,
    chunks,
    chunk,
    bodyClass,
    aphrodite: css,
    ie: req.get('user-agent').indexOf('MSIE') > -1,
  });

});

// Page not found

// eslint-disable-next-line
app.use((req, res, next) => {
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

// Error page
app.use((err, req, res, next) => {
  res.status(500);

  // HTML
  if ( req.accepts('html', '*/*') === 'html' ) {
    res.render('500', {error: err});
    return;
  }

  // JSON
  if ( req.accepts('json', '*/*') === 'json' ) {
    if ( err instanceof Error ) {
      if ( req.app.locals.development ) {
        const errorResponse = {};

        Object.getOwnPropertyNames(err).forEach(key => {
          errorResponse[key] = err[key];
        });

        return res.json({error: errorResponse});
      } else {
        // Only keep message in production because Error() may contain sensitive information
        return res.json({error: {message: err.message}});
      }
    } else {
      return res.send({error: err});
    }
  }

  // default to plain-text.
  // keep only message
  res.type('txt').send(err.message);
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
