'use strict';

const helmetConfig = production => {
  const config = {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        blockAllMixedContent: true,
        childSrc: ["'none'"],
        connectSrc: ["'self'", 'https://build.lwjgl.org', 'https://www.google-analytics.com'],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        imgSrc: [
          "'self'",
          'data:',
          'https://api.travis-ci.org',
          'https://travis-ci.org',
          'https://www.google-analytics.com',
          'https://appveyor-matrix-badges.herokuapp.com',
        ],
        scriptSrc: [
          "'self'",
          'https://www.google-analytics.com',
          'https://cdnjs.cloudflare.com',
          'https://cdn.polyfill.io',
          'https://unpkg.com',
        ],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com'],
		objectSrc: ["'none'"],
      },
    },
    dnsPrefetchControl: {
      allow: false,
    },
    frameguard: {
      action: 'deny',
    },
    hidePoweredBy: false,
    ieNoOpen: false,
    noSniff: true,
    referrerPolicy: false,
    xssFilter: true,
  };

  if (production) {
    config.hsts = {
      maxAge: 365 * 24 * 60 * 60,
      includeSubDomains: false,
      // TODO: includeSubDomains must be true for preloading to be approved
      preload: true,
      setIf: (req, res) => req.hostname === 'www.lwjgl.org',
    };
  } else {
    config.contentSecurityPolicy.directives.scriptSrc.push("'unsafe-eval'"); // required for Redux DevTools
    config.contentSecurityPolicy.directives.styleSrc.push('blob:');
  }

  return config;
};

module.exports = helmetConfig;
