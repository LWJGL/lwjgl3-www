import { useMemo } from 'react';
import { Icon, CloudDownload } from '~/components/icons';
import { saveAs } from '~/services/file-saver';
import { configLoad } from './actions';
import { BuildScript } from './BuildScript';
import { BuildToolbar } from './BuildToolbar';
import { configJSONfilename, getConfigSnapshot } from './config';
import { useSlice, useStoreRef } from './Store';
import { BuildStoreSnapshot, Mode } from './types';

interface Props {
  setIsDownloading: (state: boolean) => void;
}

export function BuildFooter({ setIsDownloading }: Props) {
  const [mode, dispatch] = useSlice(({ mode }) => mode);
  const storeRef = useStoreRef();

  return useMemo(() => {
    const configDownload = () => {
      const save = getConfigSnapshot(storeRef.current);
      if (save === null) {
        return;
      }
      const blob = new Blob([JSON.stringify(save, null, 2)], { type: 'application/json', endings: 'native' });
      saveAs(blob, configJSONfilename(save));
    };

    const dispatchConfigLoad = (payload: BuildStoreSnapshot) => dispatch(configLoad(payload));

    return mode === Mode.Zip ? (
      <BuildToolbar configDownload={configDownload} configLoad={dispatchConfigLoad}>
        <button
          className="btn btn-success"
          onClick={() => {
            setIsDownloading(true);
          }}
        >
          <Icon children={<CloudDownload />} /> DOWNLOAD ZIP
        </button>
      </BuildToolbar>
    ) : (
      <BuildScript configDownload={configDownload} configLoad={dispatchConfigLoad} />
    );
  }, [mode, setIsDownloading, storeRef, dispatch]);
}
