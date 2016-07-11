import path from 'path'
import express from 'express'
import favicon from 'serve-favicon'
import config from '../config'
import fs from 'fs'
import { argv } from 'yargs'
import chalk from 'chalk'

import React from 'react'
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router'
import Routes from '../client/app/routes/Routes'
import Helmet from 'react-helmet'
import { StyleSheetServer } from 'aphrodite'

// ------------------------------------------------------------------------------
// Initialize & Configure Application
// ------------------------------------------------------------------------------

const PRODUCT = 'lwjgl.org';
const app = module.exports = express();

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

  const logger = require('morgan');

  app.use(logger('dev'));

  const webpack = require('webpack');
  const webpackConfig = require('../webpack.config');
  const webpackCompiler = webpack(webpackConfig);

  app.use(require('webpack-dev-middleware')(webpackCompiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
  }));

  app.use(require('webpack-hot-middleware')(webpackCompiler));

  app.locals.bundle = 'bundle.js';
  app.locals.css = '';

} else {

  app.locals.bundle = require('../manifest-js.json').assetsByChunkName.main;
  app.locals.css = fs.readFileSync(path.join(__dirname, '../public/css/' + require('../manifest-css.json')['layout.css']), {encoding: 'utf8'})

}

// Static Assets
app.use(express.static(path.join(__dirname, '../public'), {
  maxage: '365 days'
}));

// ------------------------------------------------------------------------------
// Routing
// ------------------------------------------------------------------------------

app.get('/teamcity', (req, res, next) => {
  res.render('teamcity', {
    buildId: req.query.id,
  });
});

app.get('*', (req, res, next) => {
  match({ routes: Routes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (error) {

      res.status(500).render('500', {
        errorMsg: error.message
      });

    } else if (redirectLocation) {

      res.redirect(302, redirectLocation.pathname + redirectLocation.search)

    } else if (renderProps) {

      // https://github.com/Khan/aphrodite
      const {html, css} = StyleSheetServer.renderStatic(() => renderToString(React.createElement(RouterContext, renderProps)));

      // https://github.com/nfl/react-helmet#server-usage
      const head = Helmet.rewind();

      res.render('index', {
        html,
        head,
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
  if (req.accepts('html')) return res.render('404');
  if (req.accepts('json')) return res.send({error: 'Not found'});
  res.type('txt').send('Not found');
});

app.use((err, req, res, next) => {
  res.status(500);

  // HTML
  if ( req.accepts('html') ) {
    return res.render('500', {error:err});
  }

  // JSON
  if ( req.accepts('json') ) {
    if ( err instanceof Error ) {
      if ( req.app.locals.development ) {
        const errorResponse = {};

        Object.getOwnPropertyNames(err).forEach(key => {
          errorResponse[key] = err[key];
        });

        return res.json({error:errorResponse});
      } else {
        // Only keep message in production because Error() may contain sensitive information
        return res.json({error:{message:err.message}});
      }
    } else {
      return res.send({error:err});
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
