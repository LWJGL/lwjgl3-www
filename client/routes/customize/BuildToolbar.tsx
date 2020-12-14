import { useState } from 'react';
import { useProxy } from 'valtio';
import { breakpoint, Breakpoint } from '~/theme/breakpoints';
import { Button } from '~/components/forms/Button';
import { FilePicker } from '~/components/forms/FilePicker';
import { Dark } from '~/components/lwjgl/Dark';

import type { BuildStoreSnapshot } from './types';

import { Icon } from '~/components/ui/Icon';
import '~/theme/icons/fa/duotone/folder-download';
import '~/theme/icons/fa/duotone/folder-upload';

import { styled } from '~/theme/stitches.config';

const ToolbarContainer = styled(Dark, {
  backgroundColor: '$primary200',
  padding: '1rem 0',
  textAlign: 'center',
  position: 'fixed',
  left: 0,
  bottom: 0,
  width: '100%',
  display: 'grid',
  gap: '0.5rem',
  justifyContent: 'center',
  alignItems: 'center',
  gridAutoFlow: 'column',
});

interface Props {
  configDownload: (event: React.MouseEvent<HTMLButtonElement>) => void;
  configLoad: (payload: BuildStoreSnapshot) => void;
}

export const BuildToolbar: React.FC<Props> = ({ configDownload, configLoad, children }) => {
  const [fileUI, setFileUI] = useState(false);
  const toggleFileUI = () => setFileUI(!fileUI);
  const { current: current } = useProxy(breakpoint);

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
        } catch (e) {
          alert(e.message);
        }
      };
      reader.readAsText(files[0]);
    };

    return (
      <ToolbarContainer>
        <FilePicker accept=".json" placeholder="Select build config…" onChange={handleFile} />
        <Button variant="outline" onClick={toggleFileUI}>
          Cancel
        </Button>
      </ToolbarContainer>
    );
  }

  const showLabels = current > Breakpoint.sm;

  return (
    <ToolbarContainer>
      {children}
      <Button variant="outline" title="Load configuration file (JSON)" onClick={toggleFileUI}>
        <Icon name="fa/duotone/folder-upload" />
        {showLabels ? ` Load config` : null}
      </Button>
      <Button variant="outline" title="Save configuration (in JSON)" onClick={configDownload}>
        <Icon name="fa/duotone/folder-download" />
        {showLabels ? ` Save config` : null}
      </Button>
    </ToolbarContainer>
  );
};
