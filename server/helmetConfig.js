'use strict';

const helmetConfig = production => {
  const config = {
    contentSecurityPolicy: {
      directives: {
        blockAllMixedContent: true,
        // defaultSrc: ['*'],
        // connectSrc: ['*'],
        // fontSrc: ['*'], // default-src
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        // frameSrc: ['*'], // default-src
        // imgSrc: ['*'], // default-src
        // manifestSrc: ["'self'"],
        // mediaSrc: ['*'], // default-src
        objectSrc: ["'none'"],
        // scriptSrc: ['*'], // default-src
        // styleSrc: ['*'], // default-src
        // workerSrc: ["'self'"]
      },
    },
    // browserSniff: false,
    dnsPrefetchControl: false,
    // dnsPrefetchControl: {
    //   allow: false,
    // },
    frameguard: {
      action: 'sameorigin',
    },
    hidePoweredBy: false,
    ieNoOpen: false,
    noSniff: true,
    xssFilter: true,
  };

  if (production) {
    config.hsts = {
      maxAge: 365 * 24 * 60 * 60,
      includeSubDomains: false,
      // TODO: includeSubDomains must be true for preloading to be approved
      preload: false,
      setIf: (req, res) => req.hostname === 'www.lwjgl.org',
    };
  }

  return config;
};

module.exports = helmetConfig;
