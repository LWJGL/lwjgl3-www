import { useEffect, useRef, useState } from 'react';
import { saveAs } from '~/services/file-saver';
import { configJSONfilename, getConfigSnapshot } from './config';
import { abortDownload, downloadFiles, fetchManifest, getAddons, getBuild, getFiles } from './lib/bundler';
import { useStore } from './Store';
import { BuildType } from './types';
import JSZip from 'jszip';
import { useMountedRef } from '~/hooks/useMountedRef';

// Layout
import { styled } from '~/theme/stitches.config';
import { Grid } from '~/components/layout/Grid';
import { Flex } from '~/components/layout/Flex';
import { CircularProgress } from '~/components/ui/CircularProgress';
import { Button } from '~/components/forms/Button';

interface Props {
  setIsDownloading: (state: boolean) => void;
}

type Progress = Array<string>;

const Pre = styled('pre', {
  overflow: 'clip',
  overflowY: 'auto',
  fontSize: '$sm',
});

export default function BuildDownloader({ setIsDownloading }: Props) {
  const store = useStore();
  const isMounted = useMountedRef();
  const usingNetwork = useRef(false);

  const [progress, setProgress] = useState<Progress>(['Downloading file manifest']);

  useEffect(() => {
    function downloadCancel(msg?: string) {
      if (msg !== undefined) {
        alert(msg);
      }
      downloadComplete();
    }

    function downloadLog(msg: string) {
      if (isMounted.current) {
        setProgress((progress) => [...progress, msg]);
      }
    }

    function downloadComplete() {
      setIsDownloading(false);
    }

    async function beginDownload() {
      // Fetch all data that we will need from the store
      const { build, path, selected, platforms, source, javadoc, includeJSON, version, addons } = getBuild(store);

      // Download latest manifest
      let manifest: Array<string>;
      try {
        manifest = await fetchManifest(path);
      } catch (err) {
        downloadCancel(err.message);
        return;
      }

      if (!isMounted.current) {
        return;
      }

      let files = getFiles(path, manifest, selected, platforms, source, javadoc);

      if (addons.length) {
        files = files.concat(getAddons(addons, source, javadoc));
      }

      const jszip = new JSZip();

      downloadLog(`Downloading ${files.length} files`);
      try {
        usingNetwork.current = true;
        await downloadFiles(files, jszip, downloadLog);
        usingNetwork.current = false;
      } catch (err) {
        downloadCancel(err.name !== 'AbortError' ? err.message : undefined);
        return;
      }

      // Include JSON Config
      if (includeJSON) {
        const save = getConfigSnapshot(store);
        if (save !== null) {
          const blob = new Blob([JSON.stringify(save, null, 2)], {
            type: 'application/json',
            endings: 'native',
          });
          jszip.file(configJSONfilename(save), blob, { binary: true });
        }
      }

      // Generate ZIP files
      downloadLog('Compressing files');
      const blob = await jszip.generateAsync({
        type: 'blob',
        // compression: 'DEFLATE',
        // compressionOptions: {level:6},
      });

      saveAs(
        blob,
        `lwjgl-${build}-${build === BuildType.Release ? version : new Date().toISOString().slice(0, 10)}-custom.zip`
      );

      downloadComplete();
    }

    beginDownload();

    return () => {
      if (usingNetwork.current) {
        // This will cause an AbortController signal to fire.
        // Firing the signal will reject the fetch promise which will then be caught
        // and downloadCancel(err.message) will fire
        abortDownload();
      }
    };
  }, [setIsDownloading, store, isMounted]);

  return (
    <Grid
      css={{
        height: '100%',
        gap: '$gap',
        grid: 'auto min-content / minmax(auto, 600px)',
        '@sm': {
          height: 'min(500px, 80vh)',
        },
      }}
    >
      <Pre>
        {progress
          .slice(0)
          .reverse()
          .map((line, i) => (
            <div key={`log${i}`}>{line}</div>
          ))}
      </Pre>
      <Flex css={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Button variant="outline" autoFocus onClick={() => setIsDownloading(false)}>
          Cancel
        </Button>
        <CircularProgress size={36} />
      </Flex>
    </Grid>
  );
}
