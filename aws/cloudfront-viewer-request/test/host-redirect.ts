import { handler } from '../src/index';
import { requestEvent, callback, context } from './sample-request';

requestEvent.Records[0].cf.request.headers.host[0].value = 'lwjgl.org';
handler(requestEvent, context, callback);
