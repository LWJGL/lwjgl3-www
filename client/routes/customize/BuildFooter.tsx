import { useCallback } from 'react';
import { saveAs } from '~/services/file-saver';
import { createActionConfigLoad, selectorMode } from './reducer';
import { BuildScript } from './BuildScript';
import { BuildToolbar } from './BuildToolbar';
import { configJSONfilename, getConfigSnapshot } from './config';
import { useStore, useDispatch } from './store';
import { Mode } from './types';
import { Button } from '~/components/forms/Button';
import { Icon } from '~/components/ui/Icon';
import '~/theme/icons/fa/duotone/cloud-download';

import type { BuildStoreSnapshot, DownloadHandle } from './types';

interface Props {
  downloadRef: React.RefObject<DownloadHandle>;
}

export function BuildFooter({ downloadRef }: Props) {
  const dispatch = useDispatch();
  const mode = useStore(selectorMode);

  const configDownload = useCallback(() => {
    const save = getConfigSnapshot(useStore.getState());
    if (save === null) {
      return;
    }
    const blob = new Blob([JSON.stringify(save, null, 2)], { type: 'application/json', endings: 'native' });
    saveAs(blob, configJSONfilename(save));
  }, []);

  const dispatchConfigLoad = useCallback(
    (payload: BuildStoreSnapshot) => {
      if (payload.build === undefined) {
        throw new Error('File does not contain a valid LWJGL configuration.');
      }
      dispatch(createActionConfigLoad(payload));
    },
    [dispatch],
  );

  const download = useCallback(() => {
    downloadRef.current?.start();
  }, [downloadRef]);

  return mode === Mode.Zip ? (
    <BuildToolbar configDownload={configDownload} configLoad={dispatchConfigLoad}>
      <Button tone="accent" onClick={download}>
        <Icon name="fa/duotone/cloud-download" /> DOWNLOAD ZIP
      </Button>
    </BuildToolbar>
  ) : (
    <BuildScript configDownload={configDownload} configLoad={dispatchConfigLoad} />
  );
}
