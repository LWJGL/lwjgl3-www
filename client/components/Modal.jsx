// @flow
import * as React from 'react';
import { Dialog } from './Dialog';
import { Trap } from './Trap';
import IconClose from 'react-icons/md/close';

type ModalProps = {
  children: React.Node,
  isOpen: boolean,
  title?: string,
  onClose?: () => mixed,
};

export class Modal extends React.PureComponent<ModalProps, void> {
  static defaultProps = {
    isOpen: true,
  };

  render() {
    const { isOpen, children, title, onClose } = this.props;

    return (
      <Dialog className="dialog-modal" isOpen={isOpen} portal={true}>
        <Trap className="dialog-content container" role="dialog" onClose={onClose}>
          {children}
        </Trap>
      </Dialog>
    );
  }
}
