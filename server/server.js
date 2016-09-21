// Server
import path from 'path'
import express from 'express'
import favicon from 'serve-favicon'
import {argv} from 'yargs'
import chalk from 'chalk'

// Server-side rendering
import React from 'react'
import {renderToString} from 'react-dom/server'
import {match, RouterContext} from 'react-router'
import Routes from '../client/app/routes/Routes'
import Helmet from 'react-helmet'
import {StyleSheetServer} from 'aphrodite/no-important'
const reactCache = {};

// For proxying requests to TeamCity
import request from 'request';

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

  app.locals.bundle = 'bundle.js';
  app.locals.css = 'layout.css';

  // Device type detection
  // On production we rely on Cloudfront to get this information for free
  const device = require('express-device');
  app.use(device.capture());

} else {

  app.locals.bundle = config.manifest.js;
  app.locals.css = config.manifest.css;

}

// ------------------------------------------------------------------------------
// Routing
// ------------------------------------------------------------------------------

// Static Assets
app.use(express.static(path.join(__dirname, '../public'), {
  maxage: '365 days',
  index: false,
  setHeaders: res => {
    res.set('Cache-Control', 'public,max-age=31536000,s-maxage=2592000,immutable');
  }
}));

// Teamcity proxy
app.get('/teamcity', (req, res, next) => {
  request(
    {
      method: 'GET',
      baseUrl: 'http://teamcity.lwjgl.org',
      url: '/httpAuth/app/rest/builds/',
      qs: {
        locator: `running:false,count:1,buildType:${req.query.build}`
      },
      headers: {
        'Accept': 'application/json'
      },
      auth: {
        'user': config.teamcity.username,
        'pass': config.teamcity.password
      },
      gzip: true,
      followRedirect: false,
      timeout: 5000
    },
    (error, response, data) => {
      if ( error ) {
        res.status(500).json({error: error.message});
        return;
      }

      if ( response.statusCode !== 200 ) {
        res.status(response.statusCode).json({error: 'Invalid response'});
        return;
      }

      res.json(JSON.parse(data));
    }
  );
});

app.get('*', (req, res, next) => {
  match({routes: Routes, location: req.url}, (error, redirectLocation, renderProps) => {
    if ( error ) {

      res.status(500).render('500', {
        errorMsg: error.message
      });

    } else if ( redirectLocation ) {

      res.redirect(302, redirectLocation.pathname + redirectLocation.search)

    } else if ( renderProps ) {

      let chunk = null;
      let bodyClass = "desktop";

      if ( app.locals.production ) {

        // Add route chunk to preload
        if ( config.routes[renderProps.location.pathname] !== undefined ) {
          chunk = config.routes[renderProps.location.pathname];
        }

        // Device detection

        const isMobile = req.get('cloudfront-is-mobile-viewer');
        const isTablet = req.get('cloudfront-is-tablet-viewer');

        if ( isTablet === 'true' ) {
          bodyClass = "tablet mobile";
        } else if ( isMobile === 'true' ) {
          bodyClass = "mobile";
        }

      } else {

        // Device detection
        switch ( req.device.type ) {
          case "phone":
            bodyClass = "mobile";
            break;
          case "tablet":
          case "car":
            bodyClass = "tablet mobile";
            break;
        }

      }

      let html, css, head;

      if ( typeof reactCache[renderProps.location.pathname] === 'undefined' ) {
        // https://github.com/Khan/aphrodite
        ({html, css} = StyleSheetServer.renderStatic(() =>
          renderToString(
            <RouterContext {...renderProps} />
          )
        ));

        // https://github.com/nfl/react-helmet#server-usage
        head = Helmet.rewind();

        reactCache[renderProps.location.pathname] = {
          html,
          css,
          head
        }
      } else {
        ({html, css, head} = reactCache[renderProps.location.pathname]);
      }

      res.render('index', {
        html,
        head,
        chunk,
        bodyClass,
        aphrodite: css
      });

    } else {

      // 404
      next(null);

    }
  })
});

app.use((req, res, next) => {
  res.status(404);
  if ( req.accepts('html','*/*') === 'html' ) {
    return res.render('404');
  }
  if ( req.accepts('json', '*/*') === 'json' ) {
    return res.send({error: 'Not found'});
  }

  res.type('txt').send();
});

app.use((err, req, res, next) => {
  res.status(500);

  // HTML
  if ( req.accepts('html') ) {
    return res.render('500', {error: err});
  }

  // JSON
  if ( req.accepts('json') ) {
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
