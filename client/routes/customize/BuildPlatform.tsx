import React from 'react';
import { useMemo } from 'react';
import { Checkbox } from '~/components/Checkbox';
import { useMemoSlice } from './Store';
import { togglePlatform } from './actions';
import { Native, BuildStore } from './types';
import { getPlatformIcon } from './getPlatformIcon';

const getSlice = ({ natives, platform }: BuildStore) => ({
  platforms: natives.allIds,
  natives: natives.byId,
  selected: platform,
});

const getInputs = (state: BuildStore) => [state.platform];

export function BuildPlatform() {
  const [slice, dispatch] = useMemoSlice(getSlice, getInputs);
  const { platforms, natives, selected } = slice;

  return useMemo(
    () => (
      <React.Fragment>
        <h4 className="mt-3">Natives</h4>
        <div className="custom-controls-stacked">
          {platforms.map((platform: Native) => (
            <Checkbox
              key={platform}
              icon={getPlatformIcon(platform)}
              label={natives[platform].title}
              checked={selected[platform]}
              value={platform}
              onChange={(platform: Native) => dispatch(togglePlatform(platform))}
            />
          ))}
        </div>
      </React.Fragment>
    ),
    [slice]
  );
}
