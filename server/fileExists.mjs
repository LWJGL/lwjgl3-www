import { statSync } from 'fs';

export function fileExists(path) {
  try {
    return statSync(path).isFile();
  } catch {
    return false;
  }
}
