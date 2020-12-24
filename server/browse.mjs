import { s3 } from './AWS.mjs';

export default async (req, res, next) => {
  let isRoot = true;
  let replacer = null;

  const params = {
    Bucket: 'build.lwjgl.org',
    Delimiter: '/',
    FetchOwner: false,
    MaxKeys: 100,
  };

  if (req.query.path !== undefined) {
    isRoot = false;
    params.Prefix = req.query.path;
    replacer = new RegExp(`^${params.Prefix}`);
  }

  let data;

  try {
    data = await s3.listObjectsV2(params);
  } catch (err) {
    next(err);
    return;
  }

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

  res.send(result);
};
