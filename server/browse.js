"use strict";

const AWS = require('aws-sdk');
const s3 = new AWS.S3();
AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: 'default'});
AWS.config.update({region: 'us-east-1'});

module.exports = (req, res, next) => {

  let isRoot = true;
  let replacer = null;

  const params = {
    Bucket: 'build.lwjgl.org',
    Delimiter: '/',
    FetchOwner: false,
    MaxKeys: 100,
  };

  if ( req.query.path !== undefined ) {
    isRoot = false;
    params.Prefix = req.query.path;
    replacer = new RegExp(`^${params.Prefix}`);
  }

  s3.listObjectsV2(params, function(err, data) {
    if ( err ) {
      next(err);
    } else {
      const result = {};

      if ( data.Contents.length ) {
        result.files = data.Contents
          .filter(item => {
            if ( !isRoot ) {
              if ( item.Key === params.Prefix ) {
                return false;
              }
            }
            return true;
          })
          .map(item => isRoot ? item.Key : item.Key.replace(replacer, ''));
      }

      if ( data.CommonPrefixes.length ) {
        result.folders = data.CommonPrefixes
          .filter(folder => {
            if ( isRoot ) {
              if ( !['release/', 'stable/', 'nightly/'].includes(folder.Prefix) ) {
                return false;
              }
            }
            return true;
          })
          .map(folder => isRoot ? folder.Prefix : folder.Prefix.replace(replacer, ''));
      }

      res.send(result);
    }
  });

};
