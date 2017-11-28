// @flow
import * as React from 'react';
import createFocusTrap from 'focus-trap';
import { on, off } from '~/services/noscroll';
import { MainMenu } from './MainMenu';
import IconMenu from 'react-icons/md/menu';
import IconClose from 'react-icons/md/close';
import { SupportsPassiveEvents } from '~/services/supports';

import type { FocusTrap } from 'focus-trap';

type Props = {};

type State = {
  open: boolean,
};

export class Sidebar extends React.PureComponent<Props, State> {
  state = {
    open: false,
  };

  mounted: boolean = false;
  touchingSideNav: boolean = false;
  startX: number = 0;
  currentX: number = 0;
  focusTrap: FocusTrap;
  closeButton: ?HTMLButtonElement;
  slidingMenu: ?HTMLDivElement;
  sideContainer: ?HTMLDivElement;

  componentDidMount() {
    this.mounted = true;
    if (this.slidingMenu && this.closeButton) {
      this.focusTrap = createFocusTrap(this.slidingMenu, {
        onDeactivate: this.onToggle,
        initialFocus: this.closeButton,
        // clickOutsideDeactivates: true
      });
    }
  }

  componentWillUnmount() {
    // Fired when resizing browser window (component unmounts)
    this.mounted = false;
    if (this.state.open) {
      this.onToggle();
    }
  }

  onToggle = (/*evt*/) => {
    const { focusTrap, sideContainer } = this;

    /*::
    if (focusTrap == null || sideContainer == null) {
      return;
    }
    */

    if (this.state.open) {
      off();
      focusTrap.deactivate({ onDeactivate: false });
      sideContainer.removeEventListener(
        'touchstart',
        this.onTouchStart,
        SupportsPassiveEvents ? { passive: true } : false
      );
      sideContainer.removeEventListener(
        'touchmove',
        this.onTouchMove,
        SupportsPassiveEvents ? { passive: false } : false
      );
      sideContainer.removeEventListener('touchend', this.onTouchEnd, SupportsPassiveEvents ? { passive: true } : false);
    } else {
      on();
      focusTrap.activate();
      sideContainer.addEventListener(
        'touchstart',
        this.onTouchStart,
        SupportsPassiveEvents ? { passive: true } : false
      );
      // Disable passive to avoid triggering gestures in some devices
      sideContainer.addEventListener('touchmove', this.onTouchMove, SupportsPassiveEvents ? { passive: false } : false);
      sideContainer.addEventListener('touchend', this.onTouchEnd, SupportsPassiveEvents ? { passive: true } : false);
    }

    if (this.mounted) {
      this.setState({ open: !this.state.open });
    }
  };

  onTouchStart = (evt: TouchEvent): void => {
    /*::
    if (this.sideContainer == null) {
      return;
    }
    */

    this.startX = evt.touches[0].pageX;
    this.currentX = this.startX;

    this.touchingSideNav = true;
    this.sideContainer.classList.add('touching');
    requestAnimationFrame(this.update);
  };

  onTouchMove = (evt: TouchEvent) => {
    if (this.touchingSideNav) {
      this.currentX = evt.touches[0].pageX;
      evt.preventDefault();
    }
  };

  onTouchEnd = () => {
    if (this.touchingSideNav) {
      /*::
      if (this.sideContainer == null) {
        return;
      }
      */
      this.touchingSideNav = false;

      const translateX = this.currentX - this.startX;
      this.sideContainer.style.transform = '';
      this.sideContainer.classList.remove('touching');

      if (translateX > 0) {
        this.onToggle();
      }
    }
  };

  update = () => {
    if (!this.touchingSideNav) {
      return;
    }

    requestAnimationFrame(this.update);

    let translateX = this.currentX - this.startX;

    if (translateX < 0) {
      translateX = 0;
    }

    /*::
    if (this.sideContainer == null) {
      return;
    }
    */
    this.sideContainer.style.transform = `translateX(${translateX}px)`;
  };

  getRefSliding = (el: ?HTMLDivElement) => {
    this.slidingMenu = el;
  };

  getRefSlidingOverlay = (el: ?HTMLDivElement) => {
    this.sideContainer = el;
  };

  getRefCloseBtn = (el: ?HTMLButtonElement) => {
    this.closeButton = el;
  };

  render() {
    let isOpen = this.state.open;

    return (
      <div ref={this.getRefSliding} className={`col sliding-menu${isOpen ? ' open' : ''}`}>
        <button
          type="button"
          className="btn-link sliding-menu-icon"
          onClick={this.onToggle}
          aria-hidden={isOpen}
          title="Open navigation menu"
        >
          <IconMenu />
        </button>
        <div className="sliding-menu-overlay" onClick={this.onToggle} />
        <div
          ref={this.getRefSlidingOverlay}
          className="sliding-menu-container"
          role="menu"
          aria-hidden={!isOpen}
          aria-expanded={isOpen}
        >
          <div className="text-right">
            <button
              ref={this.getRefCloseBtn}
              type="button"
              className="btn-link sliding-menu-icon"
              onClick={this.onToggle}
              title="Close navigation menu"
            >
              <IconClose />
            </button>
          </div>
          <MainMenu className="list-unstyled" onClick={this.onToggle} />
        </div>
      </div>
    );
  }
}
