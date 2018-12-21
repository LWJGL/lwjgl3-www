import React from 'react';
import { Dialog } from './Dialog';
import { Trap } from './Trap';

interface Props {
  children: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => any;
}

export const Modal = React.memo(({ isOpen = true, children, onClose }: Props) => {
  return (
    <Dialog className="dialog-modal" isOpen={isOpen} portal={true}>
      <Trap className="dialog-content container" role="dialog" onClose={onClose}>
        {children}
      </Trap>
    </Dialog>
  );
});
