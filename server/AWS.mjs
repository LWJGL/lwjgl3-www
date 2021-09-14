import Client from '@aws-sdk/client-s3';
export const s3 = new Client.S3({ region: 'us-east-1' });
