// @flow
import * as React from 'react';
import { Checkbox } from '~/components/Checkbox';
import { togglePlatform } from '../reducer';
import type { BuildConfig } from '../types';
import { Connect } from '~/store/Connect';
import { NATIVE_WIN, NATIVE_LINUX, NATIVE_MAC } from '../constants';
import type { NATIVES } from '../types';
import { FaLinux } from '~/components/icons/fa/linux';
import { FaWindows } from '~/components/icons/fa/windows';
import { FaApple } from '~/components/icons/fa/apple';

const getIcon = (platform: NATIVES) => {
  switch (platform) {
    case NATIVE_WIN:
      return <FaWindows />;
    case NATIVE_MAC:
      return <FaApple />;
    case NATIVE_LINUX:
      return <FaLinux />;
    default:
      return undefined;
  }
};

export const BuildPlatform = () => (
  <Connect
    state={({ build }: { build: BuildConfig }) => ({
      platforms: build.natives.allIds,
      natives: build.natives.byId,
      selected: build.platform,
    })}
    actions={{ togglePlatform }}
  >
    {({ platforms, natives, selected }, { togglePlatform }) => (
      <React.Fragment>
        <h4 className="mt-3">Natives</h4>
        <div className="custom-controls-stacked">
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
        </div>
      </React.Fragment>
    )}
  </Connect>
);
