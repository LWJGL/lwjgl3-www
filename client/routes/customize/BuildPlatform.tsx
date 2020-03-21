import { useMemo } from 'react';
import { Checkbox } from '~/components/Checkbox';
import { useMemoSlice } from './Store';
import { togglePlatform } from './actions';
import { BuildStore, Native } from './types';
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
  const { platforms, natives, version, selected } = slice;

  const vnum = versionNum(version);

  return useMemo(
    () => (
      <>
        <h4 className="mt-3">Natives</h4>
        <div className="custom-controls-stacked">
          {platforms
            .filter((platform: Native) => versionNum(natives[platform].since) <= vnum)
            .map((platform: Native) => (
              <Checkbox
                key={platform}
                icon={getPlatformIcon(platform)}
                label={
                  platform === Native.Windows && vnum < versionNum(natives[Native.WindowsX86].since)
                    ? 'Windows x64/x86'
                    : natives[platform].title
                }
                checked={selected[platform]}
                value={platform}
                onChange={(platform: Native) => dispatch(togglePlatform(platform))}
              />
            ))}
        </div>
      </>
    ),
    [slice]
  );
}
