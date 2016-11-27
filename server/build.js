"use strict";

const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const validateBuildParams = require('./validateBuildParams');

module.exports = (req, res, next) => {

  if ( !validateBuildParams(req.params, next) ) {
    return;
  }

  const params = {
    Bucket: 'build.lwjgl.org',
    Key: req.params.build === 'release' ? `${req.params.build}/${req.params.version}/bin/build.txt` : `${req.params.build}/bin/build.txt`
  };

  s3.getObject(params, function(err, data) {
    if ( err ) {
      next(err);
    } else {
      res.send({
        version: data.Body.toString(),
        lastModified: data.LastModified
      });
    }
  });

};
