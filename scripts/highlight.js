import path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import hljs from 'highlight.js';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const main = async () => {
  const sourcePath = path.resolve(__dirname, '../client/routes/guide/sample.java');
  const targetPath = path.resolve(__dirname, '../public/sample.html');

  const source = await fs.readFile(sourcePath, { encoding: 'utf8' });
  const html = hljs.highlight('java', source).value;
  // jsx = jsx.replace(/class=/g, 'className=');
  // jsx = jsx.replace(/{/g, '&#123;');
  // jsx = jsx.replace(/}/g, '&#125;');
  await fs.writeFile(targetPath, html);
};

main();
