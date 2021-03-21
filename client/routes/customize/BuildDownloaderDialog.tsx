import { lazy, Suspense, useRef } from 'react';
import { useOverlay, usePreventScroll, useModal, OverlayContainer } from '@react-aria/overlays';
import { useDialog } from '@react-aria/dialog';
import { FocusScope } from '@react-aria/focus';
import { styled } from '~/theme/stitches.config';
import { motion } from 'framer-motion';
import { BackdropCss } from '~/components/layout/Backdrop';
import { CircularProgress } from '~/components/ui/CircularProgress';

import type { OverlayProps } from '@react-aria/overlays';

const BuildDownloader = lazy(() => import(/* webpackChunkName: "route-customize$downloader" */ './BuildDownloader'));

type AriaDialogProps = Parameters<typeof useDialog>[0];

interface ModalProps extends OverlayProps, AriaDialogProps {
  title: string;
  // // Whether the overlay is currently open.
  // isOpen?: boolean;
  // //  Handler that is called when the overlay should close. */
  // onClose?: () => void;
  // //  Whether to close the overlay when the user interacts outside it.
  // isDismissable?: boolean; = false
  // //  Whether the overlay should close when focus is lost or moves outside it. */
  // shouldCloseOnBlur?: boolean;
  // // Whether pressing the escape key to close the overlay should be disabled.
  // isKeyboardDismissDisabled?: boolean; = false
  // // When user interacts with the argument element outside of the overlay ref,
  // // return true if onClose should be called.  This gives you a chance to filter
  // // out interaction with elements that should not dismiss the overlay.
  // // By default, onClose will always be called on interaction outside the overlay ref.
  // shouldCloseOnInteractOutside?: (element: HTMLElement) => boolean;
  // // The accessibility role for the dialog.
  // role?: 'dialog' | 'alertdialog' == 'dialog'
}

const Modal = styled('div', {
  background: '$body',
  padding: '$gutter',
  borderRadius: '$rounded',

  '&:focus': {
    outline: 'none',
  },
  height: '100%',
  width: '100%',
  maxHeight: '100vh',
  overflow: 'auto',
  '-webkit-overflow-scrolling': 'touch',
  overscrollBehavior: 'contain',

  '@sm': {
    background: '$neutral50',
    height: 'auto',
    width: 'auto',
    boxShadow: '$2xl',
  },
});

const ModalDialog: React.FC<ModalProps> = (props) => {
  let { /*title,*/ children } = props;
  // Handle interacting outside the dialog and pressing
  // the Escape key to close the modal.
  let ref = useRef<HTMLDivElement>(null);
  let { overlayProps } = useOverlay(props, ref);

  // Prevent scrolling while the modal is open, and hide content
  // outside the modal from screen readers.
  usePreventScroll();
  let { modalProps } = useModal();

  // Get props for the dialog and its title
  let { dialogProps /*, titleProps*/ } = useDialog(props, ref);

  return (
    <motion.div
      className={BackdropCss({ open: true })}
      style={{ backgroundColor: 'rgba(0,0,0,.01)' }}
      animate={{ backgroundColor: 'rgba(0,0,0,.75)' }}
    >
      <FocusScope contain restoreFocus>
        <Modal ref={ref} {...overlayProps} {...dialogProps} {...modalProps}>
          {/* <Text as="h3" {...titleProps} css={{ mt: -7 }}>
            {title}
          </Text> */}
          {children}
        </Modal>
      </FocusScope>
    </motion.div>
  );
};

interface BuildDownloaderDialogProps {
  setIsDownloading: (state: boolean) => void;
}

export const BuildDownloaderDialog: React.FC<BuildDownloaderDialogProps> = ({ setIsDownloading }) => (
  <OverlayContainer>
    <ModalDialog
      title="Generating ZIP bundle. Please wait…"
      isOpen
      isDismissable
      onClose={() => {
        setIsDownloading(false);
      }}
    >
      <Suspense fallback={<CircularProgress size={36} />}>
        <BuildDownloader setIsDownloading={setIsDownloading} />
      </Suspense>
    </ModalDialog>
  </OverlayContainer>
);
