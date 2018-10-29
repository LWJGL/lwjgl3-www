// @flow
import * as React from 'react';
//$FlowFixMe
import { memo } from 'react';
import { Dialog } from './Dialog';
import { Trap } from './Trap';

type Props = {
  children: React.Node,
  isOpen?: boolean,
  title?: string,
  onClose?: () => mixed,
};

export const Modal = memo(({ isOpen = true, children, title, onClose }: Props) => {
  return (
    <Dialog className="dialog-modal" isOpen={isOpen} portal={true}>
      <Trap className="dialog-content container" role="dialog" onClose={onClose}>
        {children}
      </Trap>
    </Dialog>
  );
});
