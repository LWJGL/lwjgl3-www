import path from 'path';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import fastify from 'fastify';
import fastifyAccepts from 'fastify-accepts';
import fastifyHealthcheck from 'fastify-healthcheck';
import fastifyStatic from 'fastify-static';
import fastifyEtag from 'fastify-etag';
import fastifyPointOfView from 'point-of-view';
import helmet from 'fastify-helmet';
// import { mime } from 'send';
import pug from 'pug';

import chunkMap from './routes/chunkMap.mjs';
import routeBin from './routes/bin.mjs';
import routeBrowse from './routes/browse.mjs';

const filePath = fileURLToPath(import.meta.url);
const __dirname = path.dirname(filePath);
const require = createRequire(import.meta.url);

const PRODUCTION = process.env.NODE_ENV === 'production';
const DEVELOPMENT = !PRODUCTION;
const PORT = parseInt(process.env.PORT, 10) || 80;
const HOST = process.env.HOST || '0.0.0.0';

// ------------------------------------------------------------------------------
// CLI ARGS
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
// PRELOAD FILES
// ------------------------------------------------------------------------------

if (PRODUCTION) {
  global.manifest = JSON.parse(
    await readFile(path.resolve(__dirname, '../public/manifest.json'), {
      encoding: 'utf-8',
    })
  );

  global.globalCss = await readFile(path.resolve(__dirname, '../public/global.min.css'), {
    encoding: 'utf-8',
  });
}

// ------------------------------------------------------------------------------
// CREATE SERVER
// ------------------------------------------------------------------------------

export const app = fastify({
  connectionTimeout: 0,
  keepAliveTimeout: 5000,
  maxParamLength: 100,
  // bodyLimit: 1024 * 1024 * 1, // 1MB
  bodyLimit: 256 * 1024 * 1, // 256KB
  caseSensitive: true,
  ignoreTrailingSlash: false,
  disableRequestLogging: PRODUCTION,
  return503OnClosing: true,
  logger: {
    // level: PRODUCTION ? 'error' : 'info',
    // level: 'info',
    level: 'error',
  },
  onProtoPoisoning: 'error',
  onConstructorPoisoning: 'error',
  trustProxy: ['127.0.0.0/8', '10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16'],
});

// Body content-type parsing
// https://www.fastify.io/docs/latest/ContentTypeParser/
app.addContentTypeParser('*', function (request, payload, done) {
  // pipe-it directly, we don't care for it
  done();
});

// ! `send` package still depends on older `mime`
// mime.define(
//   {
//     'text/javascript; charset=utf-8': ['js'],
//     'application/json; charset=utf-8': ['json'],
//     'application/manifest+json; charset=utf-8': ['webmanifest'],
//   },
//   true
// );

// ------------------------------------------------------------------------------
// Graceful shutdown
// ------------------------------------------------------------------------------

let terminating = false;
let terminationTimeout;
function gracefulShutdown() {
  if (terminating) {
    return;
  }
  terminating = true;

  function forceShutdown() {
    app.log.error('Termination timeout. Forcing shutdown...');
    process.exit(1);
  }

  terminationTimeout = setTimeout(forceShutdown, PRODUCTION ? 5000 : 1000);
  app.log.info('Shutting down...');
  app.close().then(() => {
    clearTimeout(terminationTimeout);
    process.exit(0);
  });
}

// Comment-out events below when using `node --cpu-prof`
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// ------------------------------------------------------------------------------
// PLUGINS
// ------------------------------------------------------------------------------

app.register(fastifyEtag);
app.register(fastifyAccepts);

// Helmet config
// Defaults are commented out
app.register(helmet, {
  contentSecurityPolicy: false,
  dnsPrefetchControl: false,
  expectCt: false,
  // frameguard: {
  //   action: 'sameorigin',
  // },
  hidePoweredBy: false,
  hsts:
    PRODUCTION && !argv.test
      ? {
          maxAge: 365 * 24 * 60 * 60,
          includeSubDomains: false, // * no because we have non-ssl subdomains (e.g. legacy.lwjgl.org)
          preload: false, // ! includeSubDomains must be true for preloading to be approved
        }
      : false,
  ieNoOpen: false,
  // noSniff
  permittedCrossDomainPolicies: false,
  referrerPolicy: {
    policy: 'no-referrer-when-downgrade',
  },
  // xssFilter:
});

// Template
app.register(fastifyPointOfView, {
  engine: { pug },
  root: path.join(__dirname, 'views'),
  options: {
    pretty: DEVELOPMENT || argv.pretty === true ? '  ' : false,
    cache: PRODUCTION && argv.nocache === undefined,
  },
});

if (PRODUCTION) {
  // Health checks
  app.register(fastifyHealthcheck, {
    healthcheckUrl: '/health',
  });
}

// Static files
app.register(fastifyStatic, {
  root: path.resolve(__dirname, '../public'),
  wildcard: false,
  acceptRanges: true,
  cacheControl: false,
  // dotfiles
  etag: true,
  extensions: false,
  immutable: false,
  index: false,
  lastModified: true,
  // maxAge: 3600 * 24 * 365,
  setHeaders: (res, filepath, stat) => {
    switch (path.basename(filepath)) {
      case 'favicon.ico':
        res.setHeader(
          'Cache-Control',
          `public,max-age=${3600 * 24 * 7},s-maxage=${3600 * 24 * 30},stale-while-revalidate=3600`
        );
        break;
      case 'favicon.ico.gz':
        res.setHeader('Content-Encoding', 'gzip');
        res.setHeader('Content-Type', 'image/x-icon');
        res.setHeader(
          'Cache-Control',
          `public,max-age=${3600 * 24 * 7},s-maxage=${3600 * 24 * 30},stale-while-revalidate=3600`
        );
        break;
      case 'favicon.ico.br':
        res.setHeader('Content-Encoding', 'br');
        res.setHeader('Content-Type', 'image/x-icon');
        res.setHeader(
          'Cache-Control',
          `public,max-age=${3600 * 24 * 7},s-maxage=${3600 * 24 * 30},stale-while-revalidate=3600`
        );
        break;
      case 'manifest.webmanifest':
      case 'sitemap.xml':
      case 'robots.txt':
      case 'sample.html':
        res.setHeader(
          'Cache-Control',
          `public,max-age=${3600 * 24 * 7},s-maxage=${3600 * 24 * 30},stale-while-revalidate=3600`
        );
        break;
      case 'sw.js': {
        // Skip Cache-Control since browsers ignore the header and re-check based on their own policies
        break;
      }
      default: {
        res.setHeader('Cache-Control', `public,max-age=${3600 * 24 * 365},immutable`);
      }
    }
  },
});

// ------------------------------------------------------------------------------
// DEVELOPMENT
// ------------------------------------------------------------------------------

if (DEVELOPMENT) {
  // Allow source access in development
  // Required for Sass source maps to be resolved by browsers when HMR is off
  app.register(fastifyStatic, {
    root: path.resolve(__dirname, '../client'),
    prefix: '/client/',
    decorateReply: false,
  });
  app.register(fastifyStatic, {
    root: path.resolve(__dirname, '../node_modules'),
    prefix: '/node_modules/',
    decorateReply: false,
  });

  // Proxy webpack-dev-server generated files
  const httpProxy = require('fastify-http-proxy');
  await app.register(httpProxy, { prefix: '/js', rewritePrefix: '/js', upstream: 'http://localhost:8081' });
}

// Proxy
// In production we handle photos and downloads at the CDN level.
// In development these paths will hit Node, therefore we need to handle them.
// CAUTION: Internet connection is required!
if (DEVELOPMENT || argv.s3proxy === true) {
  const httpProxy = require('fastify-http-proxy');
  await app.register(httpProxy, { prefix: '/img', rewritePrefix: '/img', upstream: 'https://cdn.lwjgl.org' });
  await app.register(httpProxy, { prefix: '/svg', rewritePrefix: '/svg', upstream: 'https://cdn.lwjgl.org' });
}

// ------------------------------------------------------------------------------
// ROUTES
// ------------------------------------------------------------------------------

// Retrieval of artifacts dir/file structure
async function routeBinHandler(request, reply) {
  reply.header('Cache-Control', `public, max-age=60, s-maxage=${3600 * 24}`);
  return await routeBin(request.params);
}

app.get('/bin/:build', routeBinHandler);
app.get('/bin/:build/:version', routeBinHandler);

// S3 bucket listing
app.get('/list', async (request, reply) => {
  reply.header('Cache-Control', `public, max-age=60, s-maxage=${3600 * 24}`);
  return await routeBrowse(request.query);
});

app.route({
  method: 'GET',
  url: '/*',
  handler: async (request, reply) => {
    if (!request.accepts('text/html')) {
      reply.header('Cache-Control', 'public, max-age=30, s-maxage=0');
      reply.code(404);
      return reply.view('404.pug');
    }

    const template = {
      development: DEVELOPMENT,
      // ga: globals.google_analytics_id,
    };

    if (PRODUCTION) {
      template.css = globalCss;
      template.entry = manifest.assets[manifest.entry];
      // Asset preloading
      // These headers may be picked by supported CDNs or other reverse-proxies and push the assets via HTTP/2
      // To disable PUSH, append "; nopush"
      // More details: https://blog.cloudflare.com/announcing-support-for-http-2-server-push-2/
      // Push entries, we need to start loading as soon as possible
      const preload = [`\</js/${template.entry}\>; rel=preload; as=script`];
      // Append chunk of important routes to the preload list
      // Logic can be customized as needed. Can get complicated for recursive routes
      // or routes deep in site's hierarchy, so not always worth it
      const routes = chunkMap(manifest.routes, request.url);
      if (routes !== null) {
        preload.push(...routes.map(id => `\</js/${manifest.assets[id]}\>; rel=preload; as=script`));
      }
      switch (request.path) {
        // case '/':
        case '/guide':
          preload.push(`\<https://cdn.jsdelivr.net\>; rel=preconnect`);
          break;
        case '/source':
          preload.push(`\<https://api.travis-ci.org\>; rel=preconnect`);
          preload.push(`\<https://ci.appveyor.com\>; rel=preconnect`);
          preload.push(`\<https://travis-ci.org\>; rel=preconnect`);
          break;
      }
      reply.header('Link', preload);
      reply.header('Cache-Control', `public, max-age=60, s-maxage=${3600 * 24}`);
    } else {
      template.entry = 'main.js';
    }

    template.favicon = 'favicon.ico';
    if (request.encoding(['br'])) {
      template.favicon += '.br';
    } else if (request.encoding(['gzip'])) {
      template.favicon += '.gz';
    }

    reply.header('Content-Language', 'en');
    // reply.header('Cross-Origin-Embedder-Policy', 'require-corp');
    // reply.header('Cross-Origin-Opener-Policy', 'same-origin');
    return reply.view('index.pug', template);
  },
});

// ------------------------------------------------------------------------------
// ERROR HANDLING
// ------------------------------------------------------------------------------

// // This will never fire, since we capture all requests above
// app.setNotFoundHandler((request, reply) => {
//   reply.header('Cache-Control', 'public, max-age=30, s-maxage=0');
//   reply.code(404);
// });

app.setErrorHandler((error, request, reply) => {
  // Log error
  app.log.error(error);

  reply.header('Cache-Control', 'public, max-age=5, s-maxage=0');
  reply.code(500);

  const accept = request.accepts();
  switch (accept.type(['html', 'json'])) {
    case 'html':
      // HTML
      reply.view('500.pug', { error });
      break;
    case 'json': {
      // JSON
      if (error instanceof Error) {
        if (DEVELOPMENT) {
          const errorResponse = {};

          Object.getOwnPropertyNames(error).forEach(key => {
            errorResponse[key] = error[key];
          });

          reply.send({ error: errorResponse });
        } else {
          // Only keep message in production because Error() may contain sensitive information
          reply.send({ error: { message: error.message } });
        }
      } else {
        reply.send({ error });
      }
      break;
    }
    default:
      // default to plain-text.
      // keep only message
      reply.type('text/plain').send(error.message);
  }
});

// ------------------------------------------------------------------------------
// LAUNCH
// ------------------------------------------------------------------------------

try {
  await app.listen(PORT, HOST);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
