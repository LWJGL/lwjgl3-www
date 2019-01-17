import React, { useEffect, useRef, useState } from 'react';
import { ScreenLock } from '~/components/ScreenLock';
import { saveAs } from '~/services/file-saver';
import { configJSONfilename, getConfigSnapshot } from './config';
import { abortDownload, downloadFiles, fetchManifest, getAddons, getBuild, getFiles } from './lib/bundler';
import { useStoreRef } from './Store';
import { BuildType } from './types';

interface Props {
  setIsDownloading: (state: boolean) => void;
}

type Progress = Array<string>;

export function BuildDownloader({ setIsDownloading }: Props) {
  const storeRef = useStoreRef();
  const isMounted: React.MutableRefObject<boolean> = useRef(false);
  const usingNetwork: React.MutableRefObject<boolean> = useRef(false);

  const [progress, setProgress] = useState<Progress>(['Downloading file manifest']);

  useEffect(() => {
    // onMount
    isMounted.current = true;

    function downloadCancel(msg?: string) {
      if (msg !== undefined) {
        alert(msg);
      }
      downloadComplete();
    }

    function downloadLog(msg: string) {
      if (isMounted.current) {
        setProgress(progress => [...progress, msg]);
      }
    }

    function downloadComplete() {
      setIsDownloading(false);
    }

    async function beginDownload() {
      // Fetch all data that we will need from the store
      const { build, path, selected, platforms, source, javadoc, includeJSON, version, addons } = getBuild(
        storeRef.current
      );

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
        const save = getConfigSnapshot(storeRef.current);
        if (save !== null) {
          const blob = new Blob([JSON.stringify(save, null, 2)], {
            type: 'application/json',
            endings: 'native',
          });
          jszip.file(configJSONfilename(save), blob, { binary: true });
        }
      }

      // Generate ZPI files
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
      isMounted.current = false;

      if (usingNetwork.current) {
        // This will cause an AbortController signal to fire.
        // Firing the signal will reject the fetch promise which will then be caught
        // and downloadCancel(err.message) will fire
        abortDownload();
      }
    };
  }, []);

  return (
    <ScreenLock backdropClassName="dark">
      <div className="container">
        <div className="row">
          <div className="col py-3">
            <div className="text-center">
              <div className="spinner-border text-white my-3" style={{ width: '3rem', height: '3rem' }} role="status" />
              <h4>Generating ZIP bundle. Please wait...</h4>
              <p>
                <button className="btn btn-sm btn-danger" onClick={() => setIsDownloading(false)}>
                  Cancel
                </button>
              </p>
            </div>
            <pre style={{ color: 'white', height: '50vh', overflow: 'auto' }}>
              {progress
                .slice(0)
                .reverse()
                .map((line, i) => (
                  <div key={`log${i}`}>{line}</div>
                ))}
            </pre>
          </div>
        </div>
      </div>
    </ScreenLock>
  );
}
