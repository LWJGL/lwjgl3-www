import { handler } from '../src/index';
import { requestEvent, callback, context } from './sample-request';

handler(requestEvent, context, callback);
