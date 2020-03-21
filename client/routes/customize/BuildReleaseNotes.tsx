import { useMemo } from 'react';
import { useSlice } from './Store';

export function BuildReleaseNotes() {
  const [version] = useSlice(({ version }) => version);

  return useMemo(
    () => (
      <p>
        <a href={`https://github.com/LWJGL/lwjgl3/releases/tag/${version}`} style={{ fontSize: '80%' }} target="_blank">
          release notes for {version}
        </a>
      </p>
    ),
    [version]
  );
}
