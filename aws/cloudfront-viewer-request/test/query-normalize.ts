import { handler } from '../src/index';
import { requestEvent, callback, context } from './sample-request';

requestEvent.Records[0].cf.request.uri = '/list';
requestEvent.Records[0].cf.request.querystring = 'path=release/3.0.0/&escapeCache=1&utm_medium=social';
handler(requestEvent, context, callback);
