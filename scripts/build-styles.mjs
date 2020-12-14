import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { css } from '../server/styles.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const trg = path.resolve(__dirname, '../public/css/global.css');

await fs.writeFile(trg, css, 'utf-8');
