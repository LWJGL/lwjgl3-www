import qry from 'querystring';

import type { CloudFrontRequestHandler, CloudFrontResultResponse } from 'aws-lambda';

const QUERY_ALLOW_LIST = new Map();
QUERY_ALLOW_LIST.set('path', true);

function getStatus(status: 301 | 302 | 303 | 307 | 308): string {
  switch (status) {
    case 301:
      // GET methods unchanged. Others may or may not be changed to GET.
      return 'Moved Permanently';
    case 302:
      // GET methods unchanged. Others may or may not be changed to GET. The Web page is temporarily unavailable for unforeseen reasons.
      return 'Found';
    case 303:
      // GET methods unchanged. Others changed to GET (body lost). Used to redirect after a PUT or a POST, so that refreshing the result page doesn't re-trigger the operation.
      return 'See Other';
    case 307:
      // Method and body not changed. The Web page is temporarily unavailable for unforeseen reasons. Better than 302 when non-GET operations are available on the site.
      return 'Temporary Redirect';
    case 308:
      // Method and body not changed. Reorganization of a Web site, with non-GET links/operations.
      return 'Permanent Redirect';
  }
}

function redirect(status: 301 | 302 | 303 | 307 | 308, location: string): CloudFrontResultResponse {
  return {
    status: status.toString(),
    statusDescription: getStatus(status),
    headers: {
      location: [
        {
          key: 'Location',
          value: location,
        },
      ],
    },
  };
}

export const handler: CloudFrontRequestHandler = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const request = event.Records[0].cf.request;
  const { headers, uri, querystring } = request;

  const host = headers['host'][0].value;

  if (host !== 'www.lwjgl.org') {
    callback(null, redirect(308, `https://www.lwjgl.org${uri}${querystring.length ? `?${querystring}` : ''}`));
    return;
  }

  switch (uri) {
    case '/license.php':
      callback(null, redirect(301, 'https://www.lwjgl.org/license'));
      return;
    case '/download.php':
      callback(null, redirect(301, 'https://www.lwjgl.org/download'));
      return;
    case '/demos.php':
      callback(null, redirect(301, 'http://legacy.lwjgl.org/demos.php.html'));
      return;
    case '/credits.php':
      callback(null, redirect(301, 'http://legacy.lwjgl.org/credits.php.html'));
      return;
    case '/projects.php':
      callback(null, redirect(301, 'http://legacy.lwjgl.org/projects.php.html'));
      return;
    case '/links.php':
      callback(null, redirect(301, 'http://wiki.lwjgl.org/wiki/Links_and_Resources.html'));
      return;
  }

  if (uri.startsWith('/forum/')) {
    callback(
      null,
      redirect(
        308,
        `http://forum.lwjgl.org${uri.replace(/^\/forum/, '')}${querystring.length ? `?${querystring}` : ''}`
      )
    );
    return;
  } else if (uri.startsWith('/wiki/')) {
    callback(
      null,
      redirect(308, `http://wiki.lwjgl.org${uri.replace(/^\/wiki/, '')}${querystring.length ? `?${querystring}` : ''}`)
    );
    return;
  }

  // Normalize Accept header to improve the cache hit ratio
  if (headers.accept !== undefined) {
    // Make sure there is only one header
    if (headers.accept.length > 1) {
      headers.accept.splice(1);
    }

    const accept = headers.accept[0];
    if (accept.value.includes('*/*') || accept.value.includes('text/html')) {
      // This will send */* for most requests
      accept.value = '*/*';
    } else {
      // Keep only first value, remove q or other modifiers
      accept.value = accept.value.split(',')[0].split(';')[0];
    }
  } else {
    headers.accept = [
      {
        key: 'Accept',
        value: '*/*',
      },
    ];
  }

  // Normalize Query string
  if (request.querystring.length) {
    // 1. Get all keys
    // 2. Sort alphabetically
    // 3. Lowercase
    // 4. Check allow list
    // 5. Set & replace original querystring
    const params = qry.parse(request.querystring, '&', '=', { maxKeys: 10 });
    const sortedParams: typeof params = {};

    Object.keys(params)
      .sort()
      .forEach((key) => {
        const normalized = key.toLowerCase();
        if (QUERY_ALLOW_LIST.has(normalized)) {
          sortedParams[normalized] = params[key];
        }
      });

    request.querystring = qry.stringify(sortedParams);
  }

  callback(null, request);
};
