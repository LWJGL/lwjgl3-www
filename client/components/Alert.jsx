import * as React from 'react';
import { Dialog } from './Dialog';
import { Trap } from './Trap';
import IconClose from './icons/md/Close';

type DialogType = 'primary' | 'success' | 'info' | 'warning' | 'danger';

type AlertProps = {
  type: DialogType,
  message: string | null | void,
  isOpen: boolean,
  title?: string,
  onClose?: () => mixed,
};

export function Alert({ type = 'primary', isOpen = true, onClose, title, message }: AlertProps) {
  return (
    <Dialog className="dialog-alert" isOpen={isOpen} portal={true}>
      <Trap className="dialog-content" role="alertdialog" onClose={onClose}>
        {title != null &&
          title.length > 0 && (
            <div className={`dialog-header bg-${type}`}>
              <h3>{title}</h3>
              <div className="dialog-close-button">
                <IconClose onClick={onClose} />
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
