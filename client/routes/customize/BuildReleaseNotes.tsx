import * as React from 'react';
import { useStore } from './Store';
import { StateMemo } from '~/components/StateMemo';

export function BuildReleaseNotes() {
  const [state] = useStore(state => ({
    version: state.version,
  }));

  const { version } = state;

  return (
    <StateMemo state={version}>
      <p>
        <a href={`https://github.com/LWJGL/lwjgl3/releases/tag/${version}`} style={{ fontSize: '80%' }} target="_blank">
          release notes for {version}
        </a>
      </p>
    </StateMemo>
  );
}
