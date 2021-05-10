var QUERY_ALLOW_LIST = ['path'];

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

function redirect(statusCode, location) {
  return {
    statusCode: statusCode,
    statusDescription: getStatus(statusCode),
    headers: {
      location: {
        value: location,
      },
    },
  };
}

function formatQueryString(qs) {
  var result = [];
  for (var key in qs) {
    if (qs[key].multiValue !== undefined) {
      result.push(qs[key].multiValue.map(item => `${key}=${item.value}`).join('&'));
    } else if (qs[key].value.length) {
      result.push(`${key}=${qs[key].value}`);
    } else {
      result.push(key);
    }
  }

  return result.join('&');
}

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

  var normalizedQS = {};
  keys.sort();
  keys.forEach(key => {
    var normalized = key.toLowerCase();
    if (!QUERY_ALLOW_LIST.includes(normalized)) {
      // Do not allow keys not in our allow list
      return;
    }
    if (qs[key].multiValue !== undefined) {
      // Do not allow duplicate keys
      delete qs[key].multiValue;
    }

    normalizedQS[normalized] = qs[key];
  });

  return normalizedQS;
}

function handler(event) {
  var request = event.request;
  var headers = request.headers;

  if (headers.host.value !== 'www.lwjgl.org') {
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
      `http://forum.lwjgl.org${uri.replace(/^\/forum/, '')}${formatQueryString(request.querystring)}`
    );
  } else if (request.uri.startsWith('/wiki/')) {
    return redirect(308, `http://wiki.lwjgl.org${uri.replace(/^\/wiki/, '')}${formatQueryString(request.querystring)}`);
  }

  // Normalize Accept header to improve the cache hit ratio
  if (headers.accept !== undefined) {
    if (headers.accept.multiValue) {
      delete headers.accept.multiValue;
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
