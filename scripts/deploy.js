//@flow
'use strict';
const fs = require('fs');
const { promisify } = require('util');
const crypto = require('crypto');
const path = require('path');
const config = require('../config.json');
const manifest = require('../public/js/manifest.json');
//$FlowFixMe
const AWS = require('aws-sdk');
AWS.config.credentials = new AWS.Credentials({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
});
AWS.config.update({ region: config.aws.region });

const s3 = new AWS.S3();
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

/*::
type UploadSettings = {
  Bucket: string,
  Key: string,
  Body: any,
  ACL: 'public-read',
  ContentType?: string,
  CacheControl?: string,
}
*/

async function uploadFile(file /*: string */, basename /*: string */) {
  const contents = await readFile(file, { encoding: 'utf-8' });
  const folder = basename.endsWith('css') ? 'css' : 'js';

  const uploadSettings /*: UploadSettings*/ = {
    Bucket: 'cdn.lwjgl.org',
    Key: `${folder}/${basename}`,
    Body: contents,
    ACL: 'public-read',
  };

  if (basename.endsWith('.js')) {
    uploadSettings.ContentType = 'text/javascript; charset=utf-8';
    uploadSettings.CacheControl = 'public,max-age=31536000,immutable';
  } else if (basename.endsWith('.json')) {
    uploadSettings.ContentType = 'application/json';
  } else if (basename.endsWith('.css')) {
    uploadSettings.ContentType = 'text/css';
    uploadSettings.CacheControl = 'public,max-age=31536000,immutable';
  }

  const response = await new Promise((resolve, reject) => {
    s3.putObject(uploadSettings, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });

  // Return content hash
  const hash = crypto.createHash('MD5');
  hash.update(contents);
  return hash.digest('hex');
}

/*::
type Deployed = {
  [filename: string]: string,
}
*/

async function main() {
  let deployed /*: Deployed */ = {};
  let hashMap = {};

  try {
    deployed = JSON.parse(await readFile(path.join(__dirname, '../public/js/deploy.json')));
  } catch (e) {}

  // Collect files
  const bundle /*: Set<string> */ = new Set();

  Object.keys(manifest.assets).forEach(id => {
    bundle.add(path.join(__dirname, `../public/${id === 'css' ? 'css' : 'js'}/`, manifest.assets[id]));
  });

  // Keep only new files
  const files /*: Array<string>*/ =
    Object.keys(deployed).length === 0
      ? Array.from(bundle)
      : Array.from(bundle).filter(file => {
          const basename = path.basename(file);
          if (deployed[basename]) {
            // do not upload pre-hashed JS/CSS files if they exist in deploy.json
            switch (path.extname(basename)) {
              case '.js':
              case '.css':
                return false;
            }

            // For other files (e.g. manifest.json) check content hash
            const hash = crypto.createHash('MD5');
            hash.update(fs.readFileSync(file, { encoding: 'utf-8' }));
            return deployed[basename] !== hash.digest('hex');
          }
          return true;
        });

  if (!files.length) {
    console.log('All files have already been deployed.');
    return;
  }

  // Limit parallel uploads
  const FILES_TOTAL = files.length;
  const PARALLEL_DOWNLOADS = Math.min(4, FILES_TOTAL);

  //$FlowFixMe
  const queue = files[Symbol.iterator]();
  const channels = [];
  let f = 0;

  for (let i = 0; i < PARALLEL_DOWNLOADS; i += 1) {
    channels.push(
      new Promise(async (resolve, reject) => {
        for (let file of queue) {
          f += 1;
          const basename = path.basename(file);
          console.log(`${f}/${FILES_TOTAL} - ${basename}`);
          const hash = await uploadFile(file, basename);
          hashMap[basename] = hash;
        }
        resolve();
      })
    );
  }

  await Promise.all(channels);
  await writeFile(
    path.join(__dirname, '../public/js/', 'deploy.json'),
    JSON.stringify({ ...deployed, ...hashMap }, null, 2)
  );
}

main();
