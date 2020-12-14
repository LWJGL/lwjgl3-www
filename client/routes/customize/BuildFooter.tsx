import { useMemo } from 'react';
import { saveAs } from '~/services/file-saver';
import { configLoad } from './actions';
import { BuildScript } from './BuildScript';
import { BuildToolbar } from './BuildToolbar';
import { configJSONfilename, getConfigSnapshot } from './config';
import { useSlice, useStoreRef } from './Store';
import { Mode } from './types';
import { Button } from '~/components/forms/Button';
import { Icon } from '~/components/ui/Icon';
import '~/theme/icons/fa/duotone/cloud-download';

import type { BuildStoreSnapshot } from './types';

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

    const dispatchConfigLoad = (payload: BuildStoreSnapshot) => {
      if (payload.build === undefined) {
        throw new Error('File does not contain a valid LWJGL configuration.');
      }
      dispatch(configLoad(payload));
    };

    return mode === Mode.Zip ? (
      <BuildToolbar configDownload={configDownload} configLoad={dispatchConfigLoad}>
        <Button
          onClick={() => {
            setIsDownloading(true);
          }}
        >
          <Icon name="fa/duotone/cloud-download" /> DOWNLOAD ZIP
        </Button>
      </BuildToolbar>
    ) : (
      <BuildScript configDownload={configDownload} configLoad={dispatchConfigLoad} />
    );
  }, [mode, setIsDownloading, storeRef, dispatch]);
}
