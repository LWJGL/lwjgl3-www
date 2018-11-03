import * as React from 'react';
import { cc } from '~/theme';
import { Overlay } from './Overlay';

type DialogProps = {
  children?: React.ReactNode;
  fixed?: boolean;
  className?: string;

  // Overlay props
  isOpen?: boolean;
  portal?: boolean;
  hasBackdrop?: boolean;
  lazy?: boolean;
  backdropClassName?: string;
};

export const Dialog = React.memo(({ className, children, fixed = true, ...rest }: DialogProps) => (
  <Overlay {...rest}>
    <div className={cc('dialog', { 'dialog-fixed': fixed }, className)}>{children}</div>
  </Overlay>
));
