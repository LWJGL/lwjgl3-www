import type { CloudFrontRequestEvent, CloudFrontRequestResult } from 'aws-lambda';

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

function redirect(status: 301 | 302 | 303 | 307 | 308, location: string) {
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

export const handler = async (event: CloudFrontRequestEvent): Promise<CloudFrontRequestResult> => {
  const request = event.Records[0].cf.request;
  const { headers, uri, querystring } = request;

  const host = headers['host'][0].value;

  if (host === 'lwjgl.org') {
    return redirect(308, `https://www.lwjgl.org${uri}${querystring.length ? `?${querystring}` : ''}`);
  }

  switch (uri) {
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

  if (uri.startsWith('/forum/')) {
    return redirect(
      308,
      `http://forum.lwjgl.org${uri.replace(/^\/forum/, '')}${querystring.length ? `?${querystring}` : ''}`
    );
  } else if (uri.startsWith('/wiki/')) {
    return redirect(
      308,
      `http://wiki.lwjgl.org${uri.replace(/^\/wiki/, '')}${querystring.length ? `?${querystring}` : ''}`
    );
  }

  // Normalize Accept header to improve the cache hit ratio
  const accept = headers['accept'] ? headers['accept'][0].value : '*/*';
  if (accept.includes('*/*') || accept.includes('text/html')) {
    // This will send */* for most request
    headers['accept'][0].value = '*/*';
  } else {
    // Keep only first value, remove q or other modifiers
    headers['accept'][0].value = accept.split(',')[0].split(';')[0];
  }
  if (headers['accept'].length > 1) {
    headers['accept'] = [headers['accept'][0]];
  }

  return request;
};
