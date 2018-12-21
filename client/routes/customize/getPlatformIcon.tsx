import React from 'react';
import { Native } from './types';
import IconApple from '~/components/icons/fa/brands/Apple';
import IconLinux from '~/components/icons/fa/brands/Linux';
import IconWindows from '~/components/icons/fa/brands/Windows';

export const getPlatformIcon = (platform: Native) => {
  switch (platform) {
    case Native.Windows:
      return <IconWindows key="fa-win" />;
    case Native.MacOS:
      return <IconApple key="fa-macos" />;
    case Native.Linux:
      return <IconLinux key="fa-linux" />;
  }
};
