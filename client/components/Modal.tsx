import { Dialog } from './Dialog';
import { Trap } from './Trap';

interface Props {
  isOpen?: boolean;
  onClose?: () => any;
}

export const Modal: React.FC<Props> = ({ isOpen = true, children, onClose }) => (
  <Dialog className="dialog-modal" isOpen={isOpen} portal={true}>
    <Trap className="dialog-content container" role="dialog" onClose={onClose}>
      {children}
    </Trap>
  </Dialog>
);
