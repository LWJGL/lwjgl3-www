import * as React from 'react';
import IconFileDownload from '~/components/icons/md/FileDownload';
import { StateMemo } from '~/components/StateMemo';
import { saveAs } from '~/services/file-saver';
import { configLoad } from './actions';
import { BuildScript } from './BuildScript';
import { BuildToolbar } from './BuildToolbar';
import { configJSONfilename, getConfigSnapshot } from './config';
import { useStore, useStoreRef } from './Store';
import { BuildStoreSnapshot, Mode } from './types';

interface Props {
  setIsDownloading: (state: boolean) => void;
}

interface ConnectedProps {
  mode: Mode;
}

export function BuildFooter({ setIsDownloading }: Props) {
  const [state, dispatch] = useStore(
    (state): ConnectedProps => {
      return {
        mode: state.mode,
      };
    }
  );
  const { mode } = state;
  const dispatchConfigLoad = (payload: BuildStoreSnapshot) => dispatch(configLoad(payload));

  const storeRef = useStoreRef();
  const configDownload = () => {
    const save = getConfigSnapshot(storeRef.current);
    if (save === null) {
      return;
    }
    const blob = new Blob([JSON.stringify(save, null, 2)], { type: 'application/json', endings: 'native' });
    saveAs(blob, configJSONfilename(save));
  };

  return (
    <StateMemo state={mode}>
      {mode === Mode.Zip ? (
        <BuildToolbar configDownload={configDownload} configLoad={dispatchConfigLoad}>
          <button
            className="btn btn-success"
            onClick={() => {
              setIsDownloading(true);
            }}
          >
            <IconFileDownload /> DOWNLOAD ZIP
          </button>
        </BuildToolbar>
      ) : (
        <BuildScript configDownload={configDownload} configLoad={dispatchConfigLoad} />
      )}
    </StateMemo>
  );
}
