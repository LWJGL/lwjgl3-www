import { forwardRef } from 'react';
import { css, cx } from '@emotion/css';

// Based on https://blog.prototypr.io/align-svg-icons-to-text-and-say-goodbye-to-font-icons-d44b3d7b26b4#.58pqpyl6w
const cssSvgIcon = css`
  display: inline-flex;
  align-self: center;
  height: 1em;
  width: 1em;
  svg {
    height: 1em;
    width: 1em;
    bottom: -0.125em;
    position: absolute;
    fill: currentColor;
    .align-items-center & {
      bottom: auto;
    }
  }
`;

export const Icon = forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ children, className, ...props }, ref) => (
    <span ref={ref} className={cx('svg-icon', cssSvgIcon, className)} {...props}>
      {children}
    </span>
  )
);

type SVGIcon = React.FC<React.SVGProps<'svg'>>;

// Brands
export const Apple = require('./fa/brands/apple.svg').default as SVGIcon;
export const Github = require('./fa/brands/github.svg').default as SVGIcon;
export const Linux = require('./fa/brands/linux.svg').default as SVGIcon;
export const Windows = require('./fa/brands/windows.svg').default as SVGIcon;

// Material
export const Archive = require('./md/archive.svg').default as SVGIcon;
export const ArrowUpward = require('./md/arrow_upward.svg').default as SVGIcon;
export const BatteryUnknown = require('./md/battery_unknown.svg').default as SVGIcon;
export const Checkbox = require('./md/check_box.svg').default as SVGIcon;
export const ChevronRight = require('./md/chevron_right.svg').default as SVGIcon;
export const Close = require('./md/close.svg').default as SVGIcon;
export const Cloud = require('./md/cloud.svg').default as SVGIcon;
export const CloudDownload = require('./md/cloud_download.svg').default as SVGIcon;
export const Devices = require('./md/devices.svg').default as SVGIcon;
export const FileCopy = require('./md/file_copy.svg').default as SVGIcon;
export const Folder = require('./md/folder.svg').default as SVGIcon;
export const Forum = require('./md/forum.svg').default as SVGIcon;
export const KeyboardArrowDown = require('./md/keyboard_arrow_down.svg').default as SVGIcon;
export const LibraryBooks = require('./md/library_books.svg').default as SVGIcon;
export const Menu = require('./md/menu.svg').default as SVGIcon;
export const SettingsBackupRestore = require('./md/settings_backup_restore.svg').default as SVGIcon;
export const SettingsInputComposite = require('./md/settings_input_composite.svg').default as SVGIcon;
export const VideogameAsset = require('./md/videogame_asset.svg').default as SVGIcon;
export const Widgets = require('./md/widgets.svg').default as SVGIcon;
