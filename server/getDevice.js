"use strict";

module.exports = (req) => {
  let bodyClass = 'desktop';

  if ( req.app.locals.production ) {

    // Use Cloudfront origin headers
    // Device detection for free
    const isMobile = req.get('cloudfront-is-mobile-viewer');
    const isTablet = req.get('cloudfront-is-tablet-viewer');

    if ( isTablet === 'true' ) {
      bodyClass = "tablet mobile";
    } else if ( isMobile === 'true' ) {
      bodyClass = "mobile";
    }

  } else {

    // Device detection via expres-device
    // For development mode only
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

  return bodyClass;
};
