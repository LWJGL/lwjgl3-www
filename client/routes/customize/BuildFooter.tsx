import * as React from 'react';
import { useStore } from './Store';
import { Mode } from './types';
import { StateMemo } from '~/components/StateMemo';
import IconFileDownload from '~/components/icons/md/FileDownload';
import { BuildScript } from './BuildScript';
import { BuildToolbar } from './BuildToolbar';

interface ConnectedProps {
  mode: Mode;
}

export function BuildFooter() {
  const [state] = useStore(
    (state): ConnectedProps => ({
      mode: state.mode,
    })
  );

  const { mode } = state;

  return (
    <StateMemo state={mode}>
      {mode === Mode.Zip ? (
        <BuildToolbar configDownload={this.configDownload}>
          <button className="btn btn-success" onClick={this.download}>
            <IconFileDownload /> DOWNLOAD ZIP
          </button>
        </BuildToolbar>
      ) : (
        <BuildScript configDownload={this.configDownload} />
      )}
    </StateMemo>
  );
}
