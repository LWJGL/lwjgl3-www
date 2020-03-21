import { Native } from './types';
import { Icon, Apple, Linux, Windows } from '~/components/icons';

export const getPlatformIcon = (platform: Native) => {
  switch (platform) {
    case Native.Linux:
    case Native.LinuxARM64:
    case Native.LinuxARM32:
      return <Icon children={<Linux />} key="fa-linux" />;
    case Native.MacOS:
      return <Icon children={<Apple />} key="fa-macos" />;
    case Native.Windows:
    case Native.WindowsX86:
      return <Icon children={<Windows />} key="fa-win" />;
  }
};
