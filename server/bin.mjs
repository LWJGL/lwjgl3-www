import { s3 } from './AWS.mjs';
import validateBuildParams from './validateBuildParams.mjs';

export default async (req, res, next) => {
  if (!validateBuildParams(req.params, next)) {
    return;
  }

  const params = {
    Bucket: 'build.lwjgl.org',
    FetchOwner: false,
    MaxKeys: 500,
    Prefix:
      req.params.build === 'release' ? `${req.params.build}/${req.params.version}/bin/` : `${req.params.build}/bin/`,
  };

  let data;

  try {
    data = await s3.listObjectsV2(params);
  } catch (err) {
    next(err);
    return;
  }

  if (!data.Contents) {
    next(new Error('No files found!'));
    return;
  }

  const result = data.Contents.map(item => {
    return item.Key;
  });

  res
    .set({
      'Cache-Control': 'public, max-age=60, s-max-age=3600, stale-while-revalidate=60',
    })
    .send(result);
};
