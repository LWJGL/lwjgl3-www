// @flow
import * as React from 'react';
//$FlowFixMe
import { memo, useRef } from 'react';
import { Portal } from './Portal';
import { Backdrop } from './Backdrop';

type Props = {
  children: React.Node,

  isOpen?: boolean,
  portal?: boolean,
  hasBackdrop?: boolean,
  lazy?: boolean,

  backdropClassName?: string,
};

export const Overlay = memo(
  ({ children, isOpen = false, lazy = true, portal = false, backdropClassName, hasBackdrop = true }: Props) => {
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
  }
);
