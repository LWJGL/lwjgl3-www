import { useMemo } from 'react';
import { useSlice } from './Store';

import { Anchor } from '~/components/lwjgl/Anchor';

export function BuildReleaseNotes() {
  const [version] = useSlice(({ version }) => version);

  return useMemo(
    () => (
      <p>
        <Anchor
          css={{ fontSize: '$xs' }}
          href={`https://github.com/LWJGL/lwjgl3/releases/tag/${version}`}
          target="_blank"
        >
          release notes for {version}
        </Anchor>
      </p>
    ),
    [version]
  );
}
