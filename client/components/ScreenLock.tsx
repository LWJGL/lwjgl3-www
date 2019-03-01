import React from 'react';
import { Dialog } from './Dialog';
import { Trap } from './Trap';

interface Props {
  isOpen?: boolean;
  onClose?: () => any;
  noScroll?: boolean;
  autoFocus?: boolean;
  escapeDeactivates?: boolean;
  clickOutsideDeactivates?: boolean;
  backdropClassName?: string;
}

export const ScreenLock: React.FC<Props> = ({
  isOpen = true,
  noScroll = true,
  autoFocus = false,
  escapeDeactivates = false,
  clickOutsideDeactivates = false,
  backdropClassName,
  children,
  onClose,
}) => (
  <Dialog className="dialog-lock" isOpen={isOpen} backdropClassName={backdropClassName} portal={true}>
    <Trap
      className="dialog-naked"
      role="alertdialog"
      onClose={onClose}
      noScroll={noScroll}
      escapeDeactivates={escapeDeactivates}
      clickOutsideDeactivates={clickOutsideDeactivates}
      autoFocus={autoFocus}
    >
      {children}
    </Trap>
  </Dialog>
);
