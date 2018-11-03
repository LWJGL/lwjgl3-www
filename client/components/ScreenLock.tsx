import * as React from 'react';
import { Dialog } from './Dialog';
import { Trap } from './Trap';

type ScreenLockProps = {
  children?: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => any;
  noScroll?: boolean;
  autoFocus?: boolean;
  escapeDeactivates?: boolean;
  clickOutsideDeactivates?: boolean;
  backdropClassName?: string;
};

export const ScreenLock = React.memo(
  ({
    isOpen = true,
    noScroll = true,
    autoFocus = false,
    escapeDeactivates = false,
    clickOutsideDeactivates = false,
    backdropClassName,
    children,
    onClose,
  }: ScreenLockProps) => (
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
  )
);
