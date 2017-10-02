// @flow
import * as React from 'react';
import Checkbox from '~/components/Checkbox';
import { togglePlatform } from '../reducer';
import type { BuildConfig } from '../types';
import Connect from '~/store/Connect';

import { NATIVE_WIN, NATIVE_LINUX, NATIVE_MAC } from '../constants';
import type { NATIVES, Native, Platforms } from '../types';

import IconWindows from 'react-icons/fa/windows';
import IconLinux from 'react-icons/fa/linux';
import IconMacos from 'react-icons/fa/apple';

const getIcon = (platform: NATIVES) => {
  switch (platform) {
    case NATIVE_WIN:
      return <IconWindows />;
    case NATIVE_MAC:
      return <IconMacos />;
    case NATIVE_LINUX:
      return <IconLinux />;
    default:
      return undefined;
  }
};

const BuildPlatform = () => (
  <Connect
    state={({ build }: { build: BuildConfig }) => ({
      platforms: build.natives.allIds,
      natives: build.natives.byId,
      selected: build.platform,
      hide: build.mode !== 'zip',
    })}
    actions={{ togglePlatform }}
  >
    {({ platforms, natives, selected, hide }, { togglePlatform }) =>
      hide
        ? null
        : [
            <h4 key="h4" className="mt-3">
              Natives
            </h4>,
            <div key="controls" className="custom-controls-stacked">
              {platforms.map(platform => (
                <Checkbox
                  key={platform}
                  icon={getIcon(platform)}
                  label={natives[platform].title}
                  checked={selected[platform]}
                  value={platform}
                  onChange={togglePlatform}
                />
              ))}
            </div>,
          ]}
  </Connect>
);

export default BuildPlatform;
