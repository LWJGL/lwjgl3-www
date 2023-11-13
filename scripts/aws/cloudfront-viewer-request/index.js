//@ts-check

/** @typedef {{value: string}} CloudfrontValue */
/** @typedef {{value: string, multiValue?: CloudfrontValue[]}} CloudfrontValueStructure */

/** @typedef {{[queryparam: string]: CloudfrontValueStructure}} CloudfrontQueryString */
/** @typedef {{[header: string]: CloudfrontValueStructure}} CloudfrontHeaders */
/** @typedef {{[cookie: string]: CloudfrontValueStructure}} CloudfrontCookies */

/** @typedef {{distributionDomainName: string, distributionId: string, eventType: 'viewer-request' | 'viewer-response', requestId: string}} CloudfrontContext */
/** @typedef {{ip: string}} CloudfrontViewer */
/** @typedef {{readonly method: string, uri: string, querystring: CloudfrontQueryString, headers: CloudfrontHeaders, cookies: CloudfrontCookies }} CloudfrontRequest */
/** @typedef {{statusCode: number, statusDescription: string, headers?: CloudfrontHeaders}} CloudfrontResponse */

/** @typedef {{version:string, context: CloudfrontContext, viewer: CloudfrontViewer, request: CloudfrontRequest, response?: CloudfrontResponse}} CloudfrontEvent */

/** @typedef {301|302|303|307|308} StatusCode */

/**
 *
 * @param {StatusCode} statusCode
 * @returns {string}
 */
function getStatus(statusCode) {
  switch (statusCode) {
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

/**
 *
 * @param {StatusCode} statusCode
 * @param {string} location
 * @returns {CloudfrontResponse}
 */
function redirect(statusCode, location) {
  return {
    statusCode,
    statusDescription: getStatus(statusCode),
    headers: {
      location: {
        value: location,
      },
    },
  };
}

/**
 *
 * @param {CloudfrontQueryString} qs
 * @returns {string}
 */
function formatQueryString(qs) {
  var result = [];
  for (var key in qs) {
    var item = qs[key];
    if (item.multiValue !== undefined) {
      result.push(item.multiValue.map(item => `${key}=${item.value}`).join('&'));
    } else if (item.value.length) {
      result.push(`${key}=${item.value}`);
    } else {
      result.push(key);
    }
  }

  return result.join('&');
}

var QUERY_ALLOW_LIST = ['path'];

/**
 *
 * @param {CloudfrontQueryString} qs
 * @returns {CloudfrontQueryString}
 */
function normalizeQueryString(qs) {
  // Normalize Query string
  // ----------------------
  // 1. Get all keys
  // 2. Sort alphabetically
  // 3. Lowercase
  // 4. Check allow list
  // 5. Set & replace original querystring
  var keys = Object.keys(qs);

  if (!keys.length) {
    // skip, nothing to do
    return qs;
  }

  /** @type {CloudfrontQueryString} */
  var normalizedQS = {};

  keys.sort();
  keys.forEach(key => {
    var normalized = key.toLowerCase();
    // Do not allow keys not in our allow list
    if (!QUERY_ALLOW_LIST.includes(normalized)) {
      return;
    }
    // Do not allow duplicate keys
    if (qs[key].multiValue !== undefined) {
      qs[key] = {
        value: qs[key].value,
      };
    }

    normalizedQS[normalized] = qs[key];
  });

  return normalizedQS;
}

var Proto = 'cloudfront-forwarded-proto';

/**
 *
 * @param {CloudfrontEvent} event
 * @returns CloudfrontResponse | CloudfrontRequest
 */
function handler(event) {
  var request = event.request;
  var headers = request.headers;

  if (headers.host.value !== 'www.lwjgl.org') {
    if (headers.host.value === 'slack.lwjgl.org') {
      return redirect(
        301,
        'https://join.slack.com/t/lwjgl/shared_invite/enQtODI1MTY2MzE4MDk4LWE5ZjU5OTA0N2VmOWMxNDA1YjRlMTI3NzA0ZWMyYjFkYzI0NGIxMDI4ZTA0ODcxYWQ1MzI4YWRiYTFjNTMyODE',
      );
    }

    return redirect(308, `https://www.lwjgl.org${request.uri}${formatQueryString(request.querystring)}`);
  }

  if (Proto in headers && headers[Proto].value === 'http') {
    return redirect(308, `https://www.lwjgl.org${request.uri}${formatQueryString(request.querystring)}`);
  }

  switch (request.uri) {
    case '/license.php':
      return redirect(301, 'https://www.lwjgl.org/license');
    case '/download.php':
      return redirect(301, 'https://www.lwjgl.org/download');
    case '/demos.php':
      return redirect(301, 'http://legacy.lwjgl.org/demos.php.html');
    case '/credits.php':
      return redirect(301, 'http://legacy.lwjgl.org/credits.php.html');
    case '/projects.php':
      return redirect(301, 'http://legacy.lwjgl.org/projects.php.html');
    case '/links.php':
      return redirect(301, 'http://wiki.lwjgl.org/wiki/Links_and_Resources.html');
  }

  if (request.uri.startsWith('/forum/')) {
    return redirect(
      308,
      `http://forum.lwjgl.org${request.uri.replace(/^\/forum/, '')}${formatQueryString(request.querystring)}`,
    );
  } else if (request.uri.startsWith('/wiki/')) {
    return redirect(
      308,
      `http://wiki.lwjgl.org${request.uri.replace(/^\/wiki/, '')}${formatQueryString(request.querystring)}`,
    );
  }

  // Normalize Accept header to improve the cache hit ratio
  if (headers.accept !== undefined) {
    if (headers.accept.multiValue) {
      // replace with only the first value
      headers.accept = {
        value: headers.accept.value,
      };
    }

    if (headers.accept.value.includes('*/*') || headers.accept.value.includes('text/html')) {
      // This will send */* for most requests
      headers.accept.value = '*/*';
    } else {
      // Keep only first value, remove q or other modifiers
      headers.accept.value = headers.accept.value.split(',')[0].split(';')[0];
    }
  } else {
    headers.accept = {
      value: '*/*',
    };
  }

  request.querystring = normalizeQueryString(request.querystring);
  return request;
}
