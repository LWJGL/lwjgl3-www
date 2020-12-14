import path from 'path';
import { promises as fs } from 'fs';
import prettier from 'prettier';

import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const WHITELIST = `
fa/brands/apple
fa/brands/github
fa/brands/linux
fa/brands/windows
fa/duotone/book
fa/duotone/brackets-curly
fa/duotone/cloud-download
fa/duotone/code
fa/duotone/code-branch
fa/duotone/code-merge
fa/duotone/comments
fa/duotone/copy
fa/duotone/folder-download
fa/duotone/folder-upload
fa/duotone/gamepad
fa/duotone/gamepad-alt
fa/duotone/joystick
fa/duotone/microchip
fa/duotone/moon
fa/duotone/phone-laptop
fa/duotone/project-diagram
fa/duotone/sync
fa/duotone/sun
fa/duotone/terminal
fa/regular/arrow-to-top
fa/regular/bars
fa/regular/chevron-down
fa/regular/times
fa/solid/check-square
fa/solid/cloud
fa/solid/folder
`
  .split('\n')
  .filter(item => item.length > 0);

const ICON_TYPES_TEMPLATE = `export type IconName = {{names}};`;
const ICON_TEMPLATE = `import { register } from '~/theme/icons/sheet';
register(\`{{svg}}\`);`;

const collectIcons = async folder => {
  const icons = [];
  const dir = await fs.readdir(folder, { withFileTypes: true });

  for (const dirent of dir) {
    if (dirent.isFile()) {
      icons.push(path.resolve(folder, dirent.name));
    } else if (dirent.isDirectory() || dirent.isSymbolicLink()) {
      icons.push(await collectIcons(path.resolve(folder, dirent.name)));
    }
  }

  return icons.flat();
};

const main = async () => {
  const sourceDir = path.resolve(__dirname, './icons');
  const targetDir = path.resolve(__dirname, '../client/theme/icons');
  const sourceDirStringLength = sourceDir.length + 1;
  const icons = (await collectIcons(sourceDir))
    .map(file => ({
      file,
      name: file.substring(sourceDirStringLength, file.length - 4),
    }))
    .filter(icon => WHITELIST.includes(icon.name));

  for (const icon of icons) {
    // read source
    let svg = await fs.readFile(icon.file, { encoding: 'utf8' });

    // transform source
    svg = svg.replace('<svg', `<symbol id="${icon.name}"`);
    svg = svg.replace('</svg', '</symbol');
    svg = svg.replace(' xmlns="http://www.w3.org/2000/svg"', '');
    svg = svg.replace('<defs><style>.fa-secondary{opacity:.4}</style></defs>', '');
    svg = svg.replace(' class="fa-primary"', '');
    svg = svg.replace(' class="fa-secondary"', ' class="s"');

    // write file
    const targetFile = path.resolve(targetDir, `${icon.name}.ts`);
    await fs.mkdir(path.dirname(targetFile), { recursive: true });
    await fs.writeFile(path.resolve(targetFile), ICON_TEMPLATE.replace(/{{svg}}/, svg));
  }

  // Icon types
  await fs.writeFile(
    path.resolve(targetDir, 'types.ts'),
    prettier.format(ICON_TYPES_TEMPLATE.replace(/{{names}}/, icons.map(icon => `'${icon.name}'`).join(' | ')), {
      parser: 'babel',
      printWidth: 120,
      singleQuote: true,
    })
  );
};

main();
