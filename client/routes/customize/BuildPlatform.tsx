import { useMemo } from 'react';
import { Checkbox } from '~/components/forms/Selection';
import { useMemoSlice } from './Store';
import { togglePlatform } from './actions';
import { Native } from './types';
import type { BuildStore } from './types';
import { getPlatformIcon } from './getPlatformIcon';
import { versionNum } from './reducer';

const getSlice = ({ natives, platform, artifacts }: BuildStore) => ({
  platforms: natives.allIds,
  natives: natives.byId,
  version: artifacts.version,
  selected: platform,
});

const getInputs = (state: BuildStore) => [state.platform, state.artifacts];

export function BuildPlatform() {
  const [slice, dispatch] = useMemoSlice(getSlice, getInputs);

  return useMemo(() => {
    const { platforms, natives, version, selected } = slice;
    const vnum = versionNum(version);

    return (
      <>
        <h4>Natives</h4>
        {platforms
          .filter((platform: Native) => versionNum(natives[platform].since) <= vnum)
          .map((platform: Native) => (
            <Checkbox
              key={platform}
              checked={selected[platform]}
              value={platform}
              onChange={(e, platform: Native) => dispatch(togglePlatform(platform))}
            >
              {getPlatformIcon(platform)}{' '}
              {platform === Native.Windows && vnum < versionNum(natives[Native.WindowsX86].since)
                ? 'Windows x64/x86'
                : natives[platform].title}
            </Checkbox>
          ))}
      </>
    );
  }, [dispatch, slice]);
}
