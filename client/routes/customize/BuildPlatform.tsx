import * as React from 'react';
import { Checkbox } from '~/components/Checkbox';
import { togglePlatform } from './reducer';
import { NATIVES, BuildConfig } from './types';
import { Connect } from '~/store/Connect';
import { NATIVE_WIN, NATIVE_LINUX, NATIVE_MAC } from './constants';
import IconApple from '~/components/icons/fa/brands/Apple';
import IconLinux from '~/components/icons/fa/brands/Linux';
import IconWindows from '~/components/icons/fa/brands/Windows';

const getIcon = (platform: NATIVES) => {
  switch (platform) {
    case NATIVE_WIN:
      return <IconWindows />;
    case NATIVE_MAC:
      return <IconApple />;
    case NATIVE_LINUX:
      return <IconLinux />;
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
          {platforms.map((platform: NATIVES) => (
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
