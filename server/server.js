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
import routeChunk from './routeChunk'

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

} else {

  app.locals.bundle = config.manifest.js;
  app.locals.css = config.manifest.css;

}

// Static Assets
app.use(express.static(path.join(__dirname, '../public'), {
  maxage: '365 days'
}));

// ------------------------------------------------------------------------------
// Routing
// ------------------------------------------------------------------------------

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

      // https://github.com/Khan/aphrodite
      const {html, css} = StyleSheetServer.renderStatic(() =>
        renderToString(
          <RouterContext {...renderProps} />
        )
      );

      // https://github.com/nfl/react-helmet#server-usage
      const head = Helmet.rewind();

      // Add route chunk to preload
      let chunk = null;
      if ( routeChunk.name !== null && config.routes[routeChunk.name] !== undefined ) {
        chunk = config.routes[routeChunk.name];
      }

      res.render('index', {
        html,
        head,
        chunk,
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
  if ( req.accepts('html') ) return res.render('404');
  if ( req.accepts('json') ) return res.send({error: 'Not found'});
  res.type('txt').send('Not found');
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
