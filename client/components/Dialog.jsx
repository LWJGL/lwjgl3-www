// @flow
import * as React from 'react';
import cc from 'classcat';
import { Overlay } from './Overlay';

type DialogProps = {
  children?: React.Node,
  fixed: boolean,
  className?: string,

  // Overlay props
  isOpen?: boolean,
  portal?: boolean,
  hasBackdrop?: boolean,
  lazy?: boolean,
  backdropClassName?: string,
};

export class Dialog extends React.PureComponent<DialogProps, void> {
  static defaultProps = {
    fixed: true,
  };

  render() {
    const { className, children, fixed, ...rest } = this.props;
    return (
      <Overlay {...rest}>
        <div className={cc(['dialog', { 'dialog-fixed': fixed }, className])}>{children}</div>
      </Overlay>
    );
  }
}
