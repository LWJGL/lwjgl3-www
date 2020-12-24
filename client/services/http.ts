export enum StatusCode {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  MOVED_PERMANENTLY = 301,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  INTERNAL_SERVER_ERROR = 500,
}

export async function getResponseError(response: Response): Promise<string> {
  const contentType = response.headers.get('content-type');
  if (contentType !== null) {
    if (contentType.includes('application/json')) {
      // Try to find error in response
      try {
        const json = await response.json();
        if (json.error && json.error.message) {
          return json.error.message;
        }
      } catch (ignore) {
        console.error(ignore);
      }
    } else if (contentType.includes('text/plain')) {
      const text = await response.text();
      if (text.length) {
        return text;
      }
    }
  }

  return response.statusText;
}
