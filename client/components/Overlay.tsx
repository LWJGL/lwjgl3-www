import React, { useRef } from 'react';
import { Portal } from './Portal';
import { Backdrop } from './Backdrop';

interface Props {
  isOpen?: boolean;
  portal?: boolean;
  hasBackdrop?: boolean;
  lazy?: boolean;

  backdropClassName?: string;
}

export const Overlay: React.FC<Props> = ({
  children,
  isOpen = false,
  lazy = true,
  portal = false,
  backdropClassName,
  hasBackdrop = true,
}) => {
  const hasOpened = useRef(false);

  if (lazy === true && !hasOpened.current) {
    if (!isOpen) {
      return null;
    } else {
      hasOpened.current = true;
    }
  }

  const Container = portal ? Portal : React.Fragment;

  return (
    <Container>
      {isOpen && hasBackdrop && <Backdrop className={backdropClassName} />}
      {isOpen && children}
    </Container>
  );
};
