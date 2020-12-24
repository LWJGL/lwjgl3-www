import { s3 } from './AWS.mjs';
import validateBuildParams from './validateBuildParams.mjs';

// const fmt = new Intl.DateTimeFormat('en-us', {
//   timeZone: 'UTC',
//   year: 'numeric',
//   month: 'short',
//   day: 'numeric',
//   hour: 'numeric',
//   minute: 'numeric',
//   second: 'numeric',
//   timeZoneName: 'short',
//   hour12: false,
// });

export default async (req, res, next) => {
  if (!validateBuildParams(req.params, next)) {
    return;
  }

  let build;

  try {
    build = await s3.getObject({
      Bucket: 'build.lwjgl.org',
      Key:
        req.params.build === 'release'
          ? `${req.params.build}/${req.params.version}/bin/build.txt`
          : `${req.params.build}/bin/build.txt`,
    });
  } catch (err) {
    next(err);
    return;
  }

  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Last-Modified', build.LastModified.toUTCString());
  build.Body.pipe(res);

  // const chunks = [];
  // for await (const chunk of build.Body) {
  //   chunks.push(chunk);
  // }

  // res.send({
  //   version: chunks.join(''),
  //   lastModified: fmt.format(build.LastModified),
  // });
};
