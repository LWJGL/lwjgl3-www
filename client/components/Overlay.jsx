// @flow
import * as React from 'react';
import { Portal } from './Portal';
import { Backdrop } from './Backdrop';

type Props = {
  children: React.Node,

  isOpen: boolean,
  portal: boolean,
  hasBackdrop: boolean,
  lazy: boolean,

  backdropClassName?: string,
};

export class Overlay extends React.PureComponent<Props, void> {
  static defaultProps = {
    isOpen: false,
    portal: false,
    hasBackdrop: true,
    lazy: true,
  };

  hasEverOpened: boolean = false;

  render() {
    const { lazy, isOpen } = this.props;

    // in lazy-mode start rendering only if we have opened at least one
    if (lazy === true && !this.hasEverOpened) {
      if (!isOpen) {
        return null;
      } else {
        this.hasEverOpened = true;
      }
    }

    const { children, portal, backdropClassName, hasBackdrop } = this.props;
    const Container = portal ? Portal : React.Fragment;

    return (
      <Container>
        {isOpen && hasBackdrop && <Backdrop className={backdropClassName} />}
        {isOpen && children}
      </Container>
    );
  }
}
