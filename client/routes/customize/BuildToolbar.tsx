import { useContext, useState, unstable_useOpaqueIdentifier as useOpaqueIdentifier } from 'react';
import { BreakpointContext } from '~/components/Breakpoint';
import type { BuildStoreSnapshot } from './types';

import { Icon } from '~/components/Icon';
import '~/components/icons/fa/duotone/folder-download';
import '~/components/icons/fa/duotone/folder-upload';

interface Props {
  configDownload: (event: React.MouseEvent<HTMLButtonElement>) => void;
  configLoad: (payload: BuildStoreSnapshot) => void;
}

export const BuildToolbar: React.FC<Props> = ({ configDownload, configLoad, children }) => {
  const {
    current,
    breakpoints: { sm },
  } = useContext(BreakpointContext);
  const [fileUI, setFileUI] = useState(false);
  const toggleFileUI = () => setFileUI(!fileUI);
  const configFileLabel = useOpaqueIdentifier();

  if (fileUI) {
    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;

      if (files === null || files.length !== 1) {
        alert('Please select a configuration JSON file.');
        return;
      }

      let reader = new FileReader();
      reader.onload = () => {
        try {
          if (typeof reader.result !== 'string') {
            throw new Error('File must be JSON');
          }
          configLoad(JSON.parse(reader.result) as BuildStoreSnapshot);
          setFileUI(false);
        } catch (ignore) {
          alert('File does not contain a valid LWJGL configuration.');
        }
      };
      reader.readAsText(files[0]);
    };

    return (
      <div className="download-toolbar">
        <div className="container d-flex">
          <div className="form-file flex-grow-1">
            <input type="file" id={configFileLabel} className="form-file-input" accept=".json" onChange={handleFile} />
            <label className="form-file-label" htmlFor={configFileLabel}>
              <span className="form-file-text">Choose file...</span>
              <span className="form-file-button">Browse</span>
            </label>
          </div>
          <button className="btn btn-outline-light mx-2" onClick={toggleFileUI}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  const showLabels = current > sm;

  return (
    <div className="download-toolbar">
      {children}
      <button className="btn btn-outline-light" title="Load configuration file (JSON)" onClick={toggleFileUI}>
        <Icon name="fa/duotone/folder-upload" />
        {showLabels ? ` Load config` : null}
      </button>
      <button className="btn btn-outline-light" title="Save configuration (in JSON)" onClick={configDownload}>
        <Icon name="fa/duotone/folder-download" />
        {showLabels ? ` Save config` : null}
      </button>
    </div>
  );
};
