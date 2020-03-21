import { Dialog } from './Dialog';
import { Trap } from './Trap';
import { Icon, Close } from '~/components/icons';

type AlertType = 'primary' | 'success' | 'info' | 'warning' | 'danger';

interface Props {
  type: AlertType;
  message?: React.ReactNode;
  isOpen: boolean;
  title?: string;
  onClose?: React.EventHandler<any>;
}

const getDialogBg = (type: AlertType) => {
  switch (type) {
    case 'primary':
      return 'bg-primary';
    case 'success':
      return 'bg-success';
    case 'info':
      return 'bg-info';
    case 'warning':
      return 'bg-warning';
    case 'danger':
      return 'bg-danger';
  }
};

export const Alert: React.FC<Props> = ({ type = 'primary', isOpen = true, onClose, title, message }) => (
  <Dialog className="dialog-alert" isOpen={isOpen} portal={true}>
    <Trap className="dialog-content" role="alertdialog" onClose={onClose}>
      {title != null && title.length > 0 && (
        <div className={`dialog-header ${getDialogBg(type)}`}>
          <h3>{title}</h3>
          <div className="dialog-close-button">
            <Icon children={<Close />} onClick={onClose} />
          </div>
        </div>
      )}
      <p>{message}</p>
      <div className="dialog-footer">
        <button type="button" className="btn btn-sm btn-default" onClick={onClose} autoFocus={true}>
          Close
        </button>
      </div>
    </Trap>
  </Dialog>
);
