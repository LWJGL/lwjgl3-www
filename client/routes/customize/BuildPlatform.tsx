import * as React from 'react';
import { Checkbox } from '~/components/Checkbox';
import { useStore } from './Store';
import { togglePlatform } from './actions';
import { Native } from './types';
import { StateMemo } from '~/components/StateMemo';
import { getPlatformIcon } from './getPlatformIcon';

export function BuildPlatform() {
  const [state, dispatch] = useStore(state => ({
    platforms: state.natives.allIds,
    natives: state.natives.byId,
    selected: state.platform,
  }));

  const { platforms, natives, selected } = state;
  const onChange = (platform: Native) => dispatch(togglePlatform(platform));

  return (
    <StateMemo state={state}>
      <h4 className="mt-3">Natives</h4>
      <div className="custom-controls-stacked">
        {platforms.map((platform: Native) => (
          <Checkbox
            key={platform}
            icon={getPlatformIcon(platform)}
            label={natives[platform].title}
            checked={selected[platform]}
            value={platform}
            onChange={onChange}
          />
        ))}
      </div>
    </StateMemo>
  );
}
