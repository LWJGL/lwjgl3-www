import { S3 } from '@aws-sdk/client-s3';
export const s3 = new S3({ region: 'us-east-1' });

// Workaround for ContentType aws-sdk bug
// TODO: remove me
s3.middlewareStack.add(
  next => async args => {
    if (args.request.method === 'PUT' && args.request?.query['x-id'] === 'PutObject') {
      delete args.request.headers['content-type'];
    }
    return next(args);
  },
  { step: 'build' }
);
