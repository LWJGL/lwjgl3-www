import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, createReadStream } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { concurrentRun } from './lib/concurrent.mjs';
import { computeMD5 } from './lib/computeMD5.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ------------------------------------------------------------------------------
// CLI ARGS
// ------------------------------------------------------------------------------

let useCache = true;
let failOnError = false;

process.argv.slice(2).forEach(arg => {
  switch (arg) {
    case '--ci':
      useCache = false;
      failOnError = true;
      break;
  }
});

// ------------------------------------------------------------------------------
// READ MANIFEST
// ------------------------------------------------------------------------------

const buildManifestPath = path.join(__dirname, '../public/manifest.json');
const deployManifestPath = path.join(__dirname, '../public/js/deploy.json');

const buildManifest = JSON.parse(await readFile(buildManifestPath));
const deployManifest = useCache && existsSync(deployManifestPath) ? JSON.parse(await readFile(deployManifestPath)) : {};

// ------------------------------------------------------------------------------
// COLLECT FILES
// ------------------------------------------------------------------------------

const generated = new Set(); // Collect generated files here (that are already pre-hashed).
const files = Object.keys(buildManifest.assets).map(id => {
  const extension = path.extname(buildManifest.assets[id]);
  const filename = path.join(__dirname, `../public/${extension.slice(1)}/`, buildManifest.assets[id]);
  generated.add(filename);
  return filename;
});

// // Useful for debugging dependency issues (CI)
// files.push(path.join(__dirname, '../package-lock.json'));

// ------------------------------------------------------------------------------
// UPLOAD FILES
// ------------------------------------------------------------------------------

const s3 = new S3Client({ region: 'us-east-1' });

let deployed = 0;

async function uploadFile(file) {
  const basename = path.basename(file);
  const extension = path.extname(basename);

  let digest;

  // Skip already deployed files
  if (useCache && basename in deployManifest) {
    if (generated.has(file)) {
      // Skip pre-hashed files if in deploy manifest already
      return;
    } else {
      // For all the rest, check the content hash
      digest = await computeMD5(file);
      if (digest === deployManifest[basename]) {
        return;
      }
    }
  } else {
    // New file, hash contents
    digest = await computeMD5(file);
  }

  const headers = {};
  switch (extension) {
    case '.js': {
      headers.ContentType = 'text/javascript; charset=utf-8';
      headers.CacheControl = 'public, max-age=31536000, immutable';
      break;
    }
    case '.json': {
      headers.ContentType = 'application/json';
      break;
    }
    case '.css': {
      headers.ContentType = 'text/css';
      headers.CacheControl = 'public, max-age=31536000, immutable';
      break;
    }
  }

  console.log(`Uploading ${basename}`);

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: 'lwjgl-cdn',
        // Upload CSS to /css, all other files to /js
        Key: `${extension === '.css' ? 'css' : 'js'}/${basename}`,
        Body: createReadStream(file),
        // ACL: 'public-read',
        ContentMD5: Buffer.from(digest, 'hex').toString('base64'),
        ...headers,
      }),
    );
  } catch (err) {
    console.error(`${basename}: ${err.message}`);
    if (failOnError) {
      process.exit(1);
    } else {
      return;
    }
  }

  // Save file & content hash so we know that we have already uploaded it
  deployManifest[basename] = digest;
  deployed += 1;
}

await concurrentRun(4, files, uploadFile);

if (deployed > 0) {
  if (useCache) {
    await writeFile(deployManifestPath, JSON.stringify(deployManifest, null, 2));
  }
  console.log(`${deployed} file(s) uploaded`);
} else {
  console.log(`No files were uploaded`);
}
