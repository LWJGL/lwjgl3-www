const helmetConfig = (production) => {
  const config = {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        blockAllMixedContent: true,
        childSrc: ["'none'"],
        connectSrc: [
          "'self'",
          "www.google-analytics.com",
        ],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        imgSrc: [
          "'self'",
          "data:",
          "api.travis-ci.org",
          "travis-ci.org"
        ],
        scriptSrc: [
          "'self'",
          "www.google-analytics.com",
          "cdnjs.cloudflare.com",
          "cdn.polyfill.io",
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "cdnjs.cloudflare.com",
        ],
      }
    },
    dnsPrefetchControl: {
      allow: false
    },
    frameguard: {
      action: "deny"
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
    ieNoOpen: false,
    noSniff: true,
    referrerPolicy: false,
    xssFilter: true
  };

  if ( production ) {
    config.hsts = {
      maxAge: 365 * 24 * 60 * 60,
      includeSubDomains: false,
      // TODO: includeSubDomains must be true for preloading to be approved
      preload: true,
      setIf: (req, res) => req.hostname === 'www.lwjgl.org'
    };
  } else {
    config.contentSecurityPolicy.directives.styleSrc.push("blob:");
  }

  return config;
};

module.exports = helmetConfig;
