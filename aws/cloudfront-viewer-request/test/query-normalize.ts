import { handler } from '../src/index';
import { cf_event } from './sample-request';

cf_event.Records[0].cf.request.uri = '/list';
cf_event.Records[0].cf.request.querystring = 'path=release/3.0.0/&escapeCache=1&utm_medium=social';

handler(cf_event).then(
  (result) => {
    console.log(JSON.stringify(result, null, 2));
  },
  (err) => {
    console.log(err);
  }
);
