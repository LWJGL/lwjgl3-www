import React from 'react';
import { Native } from './types';
import { Icon, Apple, Linux, Windows } from '~/components/icons';

export const getPlatformIcon = (platform: Native) => {
  switch (platform) {
    case Native.Linux:
      return <Icon children={<Linux />} key="fa-linux" />;
    case Native.MacOS:
      return <Icon children={<Apple />} key="fa-macos" />;
    case Native.Windows:
      return <Icon children={<Windows />} key="fa-win" />;
  }
};
