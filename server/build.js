import AWS from 'aws-sdk';
import validateBuildParams from './validateBuildParams.js';

const s3 = new AWS.S3();

const fmt = new Intl.DateTimeFormat('en-us', {
  timeZone: 'UTC',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  timeZoneName: 'short',
  hour12: false,
});

export default (req, res, next) => {
  if (!validateBuildParams(req.params, next)) {
    return;
  }

  const params = {
    Bucket: 'build.lwjgl.org',
    Key:
      req.params.build === 'release'
        ? `${req.params.build}/${req.params.version}/bin/build.txt`
        : `${req.params.build}/bin/build.txt`,
  };

  s3.getObject(params, function (err, data) {
    if (err) {
      next(err);
    } else {
      res.send({
        version: data.Body.toString(),
        lastModified: fmt.format(data.LastModified),
      });
    }
  });
};
