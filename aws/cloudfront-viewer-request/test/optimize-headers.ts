import { handler } from '../src/index';
import { cf_event } from './sample-request';

handler(cf_event).then(
  (result) => {
    console.log(JSON.stringify(result, null, 2));
  },
  (err) => {
    console.log(err);
  }
);
