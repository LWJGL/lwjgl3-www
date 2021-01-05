import { handler } from '../src/index';
import { cf_event } from './sample-request';

cf_event.Records[0].cf.request.headers.host[0].value = 'lwjgl.org';

handler(cf_event).then(
  (result) => {
    console.log(JSON.stringify(result, null, 2));
  },
  (err) => {
    console.log(err);
  }
);
