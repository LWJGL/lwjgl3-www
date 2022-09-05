import { Checkbox } from '~/components/forms/Selection';
import { useStore, useDispatch } from './store';
import {
  versionNum,
  createActionPlatformToggle,
  selectorNatives,
  selectorArtifactsVersion,
  selectorPlatformsSelected,
} from './reducer';
import { Native } from './types';
import { getPlatformIcon } from './lib/getPlatformIcon';

export const BuildPlatform: React.FC<{ children?: never }> = () => {
  const dispatch = useDispatch();
  const { allIds: platforms, byId: natives } = useStore(selectorNatives);
  const version = useStore(selectorArtifactsVersion);
  const selected = useStore(selectorPlatformsSelected);
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
            onChange={(e, platform: Native) => dispatch(createActionPlatformToggle(platform))}
          >
            {getPlatformIcon(platform)}{' '}
            {platform === Native.Windows && vnum < versionNum(natives[Native.WindowsX86].since)
              ? 'Windows x64/x86'
              : natives[platform].title}
          </Checkbox>
        ))}
    </>
  );
};
