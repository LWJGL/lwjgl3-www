'use strict';

const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const validateBuildParams = require('./validateBuildParams');

module.exports = (req, res, next) => {
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

  s3.listObjectsV2(params, function(err, data) {
    if (err) {
      next(err);
    } else {
      const result = data.Contents.map(item => {
        return item.Key;
      });

      res.send(result);
    }
  });
};
