import { cc } from '~/theme/cc';
import { Overlay } from './Overlay';

interface Props {
  fixed?: boolean;
  className?: string;

  // Overlay props
  isOpen?: boolean;
  portal?: boolean;
  hasBackdrop?: boolean;
  lazy?: boolean;
  backdropClassName?: string;
}

export const Dialog: React.FC<Props> = ({ className, children, fixed = true, ...rest }) => (
  <Overlay {...rest}>
    <div className={cc('dialog', { 'dialog-fixed': fixed }, className)}>{children}</div>
  </Overlay>
);
