import { handler } from '../src/index';
import { requestEvent, callback, context } from './sample-request';

requestEvent.Records[0].cf.request.uri = '/credits.php';
handler(requestEvent, context, callback);
