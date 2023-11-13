import crypto from 'node:crypto';
import { createReadStream } from 'node:fs';

export async function computeMD5fromStream(readStream) {
  const hash = crypto.createHash('MD5');
  for await (const chunk of readStream) {
    hash.update(chunk);
  }
  return hash.digest('hex');
}

export async function computeMD5(filepath) {
  return await computeMD5fromStream(
    createReadStream(filepath, {
      encoding: 'utf-8',
      highWaterMark: 4 * 1024,
    }),
  );
}
