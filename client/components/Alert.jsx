// @flow
import * as React from 'react';
import { Dialog } from './Dialog';
import { Trap } from './Trap';
import { MdClose } from './icons/md/close';

type DialogType = 'primary' | 'success' | 'info' | 'warning' | 'danger';

// @flow
type AlertProps = {
  type: DialogType,
  message: string | null | void,
  isOpen: boolean,
  title?: string,
  onClose?: () => mixed,
};

export class Alert extends React.PureComponent<AlertProps, void> {
  static defaultProps = {
    type: 'primary',
    isOpen: true,
  };

  render() {
    const { type, isOpen, onClose, title, message } = this.props;

    return (
      <Dialog className="dialog-alert" isOpen={isOpen} portal={true}>
        <Trap className="dialog-content" role="alertdialog" onClose={onClose}>
          {title != null &&
            title.length && (
              <div className={`dialog-header bg-${type}`}>
                <h3>{title}</h3>
                <div className="dialog-close-button">
                  <MdClose onClick={onClose} />
                </div>
              </div>
            )}
          <p>{message}</p>
          <div className="dialog-footer">
            <button type="button" className={`btn btn-sm btn-default`} onClick={onClose} autoFocus={true}>
              Close
            </button>
          </div>
        </Trap>
      </Dialog>
    );
  }
}
