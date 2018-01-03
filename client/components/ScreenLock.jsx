// @flow
import * as React from 'react';
import { Dialog } from './Dialog';
import { Trap } from './Trap';

type ScreenLockProps = {
  children?: React.Node,
  isOpen: boolean,
  onClose?: () => mixed,
  noScroll?: boolean,
  autoFocus?: boolean,
  escapeDeactivates?: boolean,
  clickOutsideDeactivates?: boolean,
  backdropClassName?: string,
};

export class ScreenLock extends React.PureComponent<ScreenLockProps, void> {
  static defaultProps = {
    isOpen: true,
    noScroll: true,
    autoFocus: false,
    escapeDeactivates: false,
    clickOutsideDeactivates: false,
  };

  render() {
    const {
      isOpen,
      noScroll,
      autoFocus,
      escapeDeactivates,
      clickOutsideDeactivates,
      backdropClassName,
      children,
      onClose,
    } = this.props;

    return (
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
  }
}
