import { s3 } from '../AWS.mjs';

export default async query => {
  let isRoot = true;
  let replacer = null;

  const params = {
    Bucket: 'lwjgl-build',
    Delimiter: '/',
    FetchOwner: false,
    MaxKeys: 100,
  };

  if (query.path !== undefined) {
    isRoot = false;
    params.Prefix = query.path;
    replacer = new RegExp(`^${params.Prefix}`);
  }

  let data = await s3.listObjectsV2(params);

  const result = {};

  if (data.Contents && data.Contents.length) {
    result.files = data.Contents.filter(item => {
      if (!isRoot) {
        if (item.Key === params.Prefix) {
          return false;
        }
      }
      return true;
    }).map(item => (isRoot ? item.Key : item.Key.replace(replacer, '')));
  }

  if (data.CommonPrefixes && data.CommonPrefixes.length) {
    result.folders = data.CommonPrefixes.filter(folder => {
      if (isRoot) {
        if (!['release/', 'stable/', 'nightly/'].includes(folder.Prefix)) {
          return false;
        }
      }
      return true;
    }).map(folder => (isRoot ? folder.Prefix : folder.Prefix.replace(replacer, '')));
  }

  return result;
};
