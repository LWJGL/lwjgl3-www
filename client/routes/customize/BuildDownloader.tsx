import { useCallback, useRef, forwardRef, useState, useImperativeHandle, useEffect } from 'react';
import { usePreventScroll } from '@react-aria/overlays';
import { styled } from '~/theme/stitches.config';
import { motion } from 'framer-motion';
import { BackdropCss } from '~/components/ui/Backdrop';
import { CircularProgress } from '~/components/ui/CircularProgress';
import { Grid } from '~/components/layout/Grid';
import { Flex } from '~/components/layout/Flex';
import { Button } from '~/components/forms/Button';
import { supportsDialog } from '~/services/dialog';
import { useEvent } from '~/hooks/useEvent';

import { useStore } from './store';
import { beginDownload, abortDownload } from './lib/bundler';
import type { DownloadHandle } from './types';

type Progress = Array<string>;

const Modal = styled('dialog', {
  background: '$body',
  padding: '$gutter',
  borderRadius: '$rounded',

  '&:focus': {
    outline: 'none',
  },
  maxHeight: '100vh',
  overflow: 'auto',
  '-webkit-overflow-scrolling': 'touch',
  overscrollBehavior: 'contain',

  '@sm': {
    background: '$neutral1',
    boxShadow: '$2xl',
  },
});

interface ModalProps {
  onClose: () => void;
}

const ModalDialog: FCC<ModalProps> = ({ children, onClose }) => {
  let dialogRef = useRef<HTMLDialogElement>(null);

  usePreventScroll();

  const toggleOpen = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    let dialog = dialogRef.current;
    if (dialog) {
      if (supportsDialog()) {
        if (!dialog.open) {
          dialog.showModal();
        }

        // Listen for cancel event and automatically close dialog (e.g. if ESC is pressed)
        dialog.addEventListener('cancel', toggleOpen);
      }

      // // Auto-close on click outside
      // let clickOutsideListener = (e: PointerEvent) => {
      //   if (e.target !== null && (e.target as Element).tagName === 'DIALOG') {
      //     toggleOpen();
      //   }
      //   return true;
      // };
      // window.addEventListener('pointerdown', clickOutsideListener);

      // Cleanup
      return () => {
        if (dialog !== null && supportsDialog()) {
          dialog.removeEventListener('cancel', toggleOpen);
        }
        // window.removeEventListener('pointerdown', clickOutsideListener);
      };
    }
  }, [toggleOpen]);

  return (
    <motion.div
      className={`dialog-backdrop ${BackdropCss({ open: true })}`}
      style={{ backgroundColor: 'rgba(0,0,0,.01)' }}
      animate={{ backgroundColor: 'rgba(0,0,0,.75)' }}
    >
      <Modal ref={dialogRef}>{children}</Modal>
    </motion.div>
  );
};

const Pre = styled('pre', {
  overflow: 'clip',
  overflowY: 'auto',
  fontSize: '$sm',
});

export const BuildDownloader = forwardRef<DownloadHandle>((props, ref) => {
  const store = useStore();
  const [isDownloading, setIsDownloading] = useState(false);
  const mountedRef = useRef(false);
  const usingNetworkRef = useRef(false);
  const [progress, setProgress] = useState<Progress>([]);

  function downloadLog(msg: string) {
    if (mountedRef.current) {
      setProgress((progress) => [...progress, msg]);
    }
  }

  const downloadComplete = useEvent(() => {
    if (mountedRef.current) {
      setIsDownloading(false);
    }
    if (progress.length) {
      setProgress([]);
    }
  });

  const start = () => {
    beginDownload(mountedRef, usingNetworkRef, store, stop, downloadLog, downloadComplete);
    setIsDownloading(true);
  };

  const stop = useCallback(
    (msg?: string) => {
      if (msg) {
        alert(msg);
      }
      if (usingNetworkRef.current === true) {
        abortDownload();
      }
      downloadComplete();
    },
    [downloadComplete]
  );

  const stopCallback = useCallback(() => {
    stop();
  }, [stop]);

  useImperativeHandle(ref, () => ({ start, stop }));

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      stop();
    };
  }, [stop]);

  if (!isDownloading) {
    return null;
  }

  return (
    <ModalDialog onClose={stopCallback}>
      <Grid
        className="dialog-content"
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
          <Button variant="outline" autoFocus onClick={stopCallback}>
            Cancel
          </Button>
          <CircularProgress size={36} />
        </Flex>
      </Grid>
    </ModalDialog>
  );
});
