import path from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import shiki from 'shiki';

const sourcePath = path.resolve(import.meta.dirname, '../client/routes/guide/sample.java');
const targetPath = path.resolve(import.meta.dirname, '../public/sample.html');

const source = await readFile(sourcePath, { encoding: 'utf8' });

const highlighter = await shiki.getHighlighter({ theme: 'github-dark' });

let html = highlighter.codeToHtml(source, { lang: 'java' });
html = html.replace('<pre class="shiki" style="background-color: #0d1117"><code>', '');
html = html.replace('</code></pre>', '');
html = html.replace(/^<span class="line">/gm, '');
html = html.replace(/<\/span>$/gm, '');

await writeFile(targetPath, html);
