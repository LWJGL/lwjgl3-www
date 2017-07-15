'use strict';

const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const config = require('../config.json');
const manifest = require('../public/js/manifest.json');

AWS.config.credentials = new AWS.Credentials({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
});
AWS.config.update({ region: config.aws.region });

// Collect files
const files = [
  path.join(__dirname, '../public/js/', 'manifest.json'),
  path.join(__dirname, '../public/js/', manifest.entry),
];
Object.keys(manifest.chunks).map(chunk => {
  files.push(path.join(__dirname, '../public/js/', manifest.chunks[chunk]));
});

// Upload files
const s3 = new AWS.S3();

files.map(file => {
  const basename = path.basename(file);
  console.log(`Reading ${basename}`);

  // Read in the file, convert it to base64, store to S3
  fs.readFile(file, (err, data) => {
    if (err) {
      throw err;
    }

    const uploadSettings = {
      Bucket: 'cdn.lwjgl.org',
      Key: `js/${basename}`,
      Body: data,
      ACL: 'public-read',
    };

    if (basename.endsWith('js')) {
      uploadSettings.ContentType = 'text/javascript';
      uploadSettings.CacheControl = 'public,max-age=31536000,immutable';
    } else if (basename.endsWith('json')) {
      uploadSettings.ContentType = 'application/json';
    }

    console.log(`Uploading ${basename}`);
    s3.putObject(uploadSettings, function(err, response) {
      if (err) {
        throw new Error(err);
      }
      console.log(`Done: ${basename} ETag: ${response.ETag}`);
    });
  });
});
