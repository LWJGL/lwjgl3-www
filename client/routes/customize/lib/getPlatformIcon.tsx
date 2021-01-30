import { Native } from '../types';
import { Icon } from '~/components/ui/Icon';
import '~/theme/icons/fa/brands/apple';
import '~/theme/icons/fa/brands/linux';
import '~/theme/icons/fa/brands/windows';

export const getPlatformIcon = (platform: Native) => {
  switch (platform) {
    case Native.Linux:
    case Native.LinuxARM64:
    case Native.LinuxARM32:
      return <Icon aria-hidden={false} aria-label="Linux" name="fa/brands/linux" key={`fa-${platform}`} />;
    case Native.MacOS:
      return <Icon aria-hidden={false} aria-label="Apple" name="fa/brands/apple" key={`fa-${platform}`} />;
    case Native.Windows:
    case Native.WindowsX86:
      return <Icon aria-hidden={false} aria-label="Windows" name="fa/brands/windows" key={`fa-${platform}`} />;
  }
};
