const AWS = require('aws-sdk');
const s3 = new AWS.S3();
AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: 'default'});
AWS.config.update({region: 'us-east-1'});

export default (req, res, next) => {

  if ( ['release', 'stable', 'nightly'].indexOf(req.params.build) === -1 ) {
    next(new Error("Invalid build name"));
    return;
  }

  if ( req.params.build === 'release' ) {
    if ( !req.params.version ) {
      next(new Error("Release version is required"));
      return;
    }
    if ( req.params.version.split(".").length !== 3 ) {
      next(new Error("Invalid version. Please use semver format"));
      return;
    }
  } else {
    if ( req.params.version ) {
      next(new Error("Version is only allowed when build type is Release"));
      return;
    }
  }

  const params = {
    Bucket: 'build.lwjgl.org',
    FetchOwner: false,
    MaxKeys: 500,
    Prefix: req.params.build === 'release' ? `${req.params.build}/${req.params.version}/bin/` : `${req.params.build}/bin/`,
  };

  s3.listObjectsV2(params, function(err, data) {
    if ( err ) {
      next(err);
    } else {
      const result = data.Contents.map(item => {
        return item.Key;
      });

      res.send(result);
    }
  });

}
