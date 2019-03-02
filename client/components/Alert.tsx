import React from 'react';
import { Dialog } from './Dialog';
import { Trap } from './Trap';
import { Icon, Close } from '~/components/icons';

interface Props {
  type: 'primary' | 'success' | 'info' | 'warning' | 'danger';
  message?: React.ReactNode;
  isOpen: boolean;
  title?: string;
  onClose?: React.EventHandler<any>;
}

export const Alert: React.FC<Props> = ({ type = 'primary', isOpen = true, onClose, title, message }) => (
  <Dialog className="dialog-alert" isOpen={isOpen} portal={true}>
    <Trap className="dialog-content" role="alertdialog" onClose={onClose}>
      {title != null && title.length > 0 && (
        <div className={`dialog-header bg-${type}`}>
          <h3>{title}</h3>
          <div className="dialog-close-button">
            <Icon children={<Close />} onClick={onClose} />
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
