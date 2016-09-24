/* eslint-disable no-console */

// Server
import fs from 'fs'
import path from 'path'
import express from 'express'
import favicon from 'serve-favicon'
import {argv} from 'yargs'
import chalk from 'chalk'

// Server-side rendering
import React from 'react'
import {renderToString} from 'react-dom/server'
import { ServerRouter, createServerRenderContext } from 'react-router'
import Helmet from 'react-helmet'
import {StyleSheetServer} from 'aphrodite/no-important'
import Layout from '../client/app/ui/Layout'
const reactCache = {};
let chunks = '{}';

// Routes & helpers
import teamcity from './teamcity';  // For proxying requests to TeamCity
import getDevice from './getDevice';

// ------------------------------------------------------------------------------
// Initialize & Configure Application
// ------------------------------------------------------------------------------

const PRODUCT = 'lwjgl.org';
const app = module.exports = express();
const config = require('../config.json');

app.set('port', config.server.port);
app.set('case sensitive routing', true);
app.set('strict routing', true);
app.set('x-powered-by', false);
app.set('trust proxy', 'loopback');
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

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

app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));

if ( app.locals.development ) {

  const webpack = require('webpack');
  const webpackConfig = require('../webpack.config');
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
  app.locals.css = 'layout.css';

  // Device type detection
  // On production we rely on Cloudfront to get this information for free
  const device = require('express-device');
  app.use(device.capture());

} else {

  chunks = fs.readFileSync(path.join(__dirname, '../public/js', 'manifest.json'));
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

// React server-side rendering
app.get('*', (req, res, next) => {

  if ( req.accepts('html','*/*') !== 'html' ) {
    // Return 404 to avoid rendering React for invalid requests
    next(null);
    return;
  }

  // The only reason we need this is to avoid rendering the homepage video in mobile devices
  let bodyClass = getDevice(req);

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
        {({ location }) => <Layout location={location} />}
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
  head = Helmet.rewind();

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

  if ( req.accepts('html','*/*') === 'html' ) {
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
// eslint-disable-next-line
app.use((err, req, res, next) => {
  res.status(500);

  // HTML
  if ( req.accepts('html','*/*') === 'html' ) {
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

process.on('uncaughtException', function (err) {
  console.error(err.stack);
  shutdown(1);
});
