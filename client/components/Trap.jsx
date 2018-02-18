// @flow
import * as React from 'react';
import createFocusTrap from 'focus-trap';
import { on, off } from '~/services/noscroll';
import type { FocusTrap } from 'focus-trap';

type TrapProps = {
  className?: string,
  role?: string,
  children: React.Node,
  onClose?: () => mixed,
  noScroll: boolean,
  autoFocus: boolean,
  escapeDeactivates: boolean,
  clickOutsideDeactivates: boolean,
};

export class Trap extends React.PureComponent<TrapProps> {
  static defaultProps = {
    noScroll: true,
    autoFocus: true,
    escapeDeactivates: true,
    clickOutsideDeactivates: true,
  };

  focusTrap: FocusTrap;
  prevTrap: FocusTrap;
  static lastTrap: FocusTrap | null = null;

  returnFocus: HTMLElement | null;
  mounted: boolean = false;

  //$FlowFixMe
  divRef = React.createRef();

  render() {
    const { className, role, children } = this.props;
    if (!this.mounted) {
      // Capture previously focused element before mounting
      this.returnFocus = document.activeElement;
    }
    return (
      <div ref={this.divRef} className={className} role={role} tabIndex={-1}>
        {children}
      </div>
    );
  }

  findFocusable = (): ?HTMLElement => {
    const trap = this.divRef.value;
    if (!this.props.autoFocus) {
      return trap;
    }
    if (trap != null) {
      let el = trap.querySelector(
        '[autofocus],input:not([type="hidden"]):not([disabled]):not([readonly]),select,textarea,button,[tabindex]:not([tabindex="-1"])'
      );
      if (el !== null) {
        return el;
      }
    }
    return trap;
  };

  componentDidMount() {
    this.mounted = true;
    const trap = this.divRef.value;
    if (trap == null) {
      return;
    }
    if (Trap.lastTrap !== null) {
      this.prevTrap = Trap.lastTrap;
      this.prevTrap.pause();
    }
    this.focusTrap = createFocusTrap(trap, {
      onDeactivate: this.props.onClose,
      initialFocus: this.findFocusable,
      escapeDeactivates: this.props.escapeDeactivates,
      clickOutsideDeactivates: this.props.clickOutsideDeactivates,
      returnFocusOnDeactivate: false,
    });
    if (this.props.noScroll) {
      on();
    }
    this.focusTrap.activate();
    Trap.lastTrap = this.focusTrap;
  }

  componentWillUnmount() {
    this.mounted = false;
    this.focusTrap.deactivate({ onDeactivate: false });

    if (this.prevTrap) {
      this.prevTrap.unpause();
      Trap.lastTrap = this.prevTrap;
    } else {
      Trap.lastTrap = null;
    }

    if (this.props.noScroll) {
      off();
    }

    if (this.returnFocus) {
      try {
        this.returnFocus.focus();
      } catch (e) {}
      this.returnFocus = null;
    }
  }
}
