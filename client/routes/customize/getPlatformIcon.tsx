import { Native } from './types';
import { Icon } from '~/components/Icon';
import '~/components/icons/fa/brands/apple';
import '~/components/icons/fa/brands/linux';
import '~/components/icons/fa/brands/windows';

export const getPlatformIcon = (platform: Native) => {
  switch (platform) {
    case Native.Linux:
    case Native.LinuxARM64:
    case Native.LinuxARM32:
      return <Icon name="fa/brands/linux" key="fa-linux" />;
    case Native.MacOS:
      return <Icon name="fa/brands/apple" key="fa-macos" />;
    case Native.Windows:
    case Native.WindowsX86:
      return <Icon name="fa/brands/windows" key="fa-win" />;
  }
};
