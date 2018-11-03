import * as React from 'react';
import createFocusTrap, { FocusTrap } from 'focus-trap';
import { on, off } from '~/services/noscroll';
import { MainMenu } from './MainMenu';
import IconMenu from '~/components/icons/md/Menu';
import IconClose from '~/components/icons/md/Close';
import { SUPPORTS_PASSIVE_EVENTS } from '~/services/supports';

interface Props {}

type State = {
  open: boolean;
};

export class Sidebar extends React.PureComponent<Props, State> {
  state = {
    open: false,
  };

  mounted: boolean = false;
  touchingSideNav: boolean = false;
  startX: number = 0;
  currentX: number = 0;
  focusTrap!: FocusTrap;

  closeButtonRef: React.RefObject<HTMLButtonElement> = React.createRef();
  slidingMenuRef: React.RefObject<HTMLDivElement> = React.createRef();
  sideContainerRef: React.RefObject<HTMLDivElement> = React.createRef();

  componentDidMount() {
    this.mounted = true;
    const slidingMenu = this.slidingMenuRef.current;
    const closeButton = this.closeButtonRef.current;

    if (slidingMenu !== null && closeButton !== null) {
      this.focusTrap = createFocusTrap(slidingMenu, {
        onDeactivate: this.onToggle,
        initialFocus: closeButton,
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
    const {
      focusTrap,
      sideContainerRef: { current: sideContainer },
    } = this;

    /*::
    if (focusTrap == null || sideContainer == null) {
      return;
    }
    */

    if (this.state.open) {
      off();
      //@ts-ignore
      focusTrap.deactivate({ onDeactivate: false });
      if (sideContainer !== null) {
        sideContainer.removeEventListener('touchstart', this.onTouchStart, SUPPORTS_PASSIVE_EVENTS ? {} : false);
        sideContainer.removeEventListener('touchmove', this.onTouchMove, SUPPORTS_PASSIVE_EVENTS ? {} : false);
        sideContainer.removeEventListener('touchend', this.onTouchEnd, SUPPORTS_PASSIVE_EVENTS ? {} : false);
      }
    } else {
      on();
      focusTrap.activate();
      if (sideContainer !== null) {
        sideContainer.addEventListener(
          'touchstart',
          this.onTouchStart,
          SUPPORTS_PASSIVE_EVENTS ? { passive: true } : false
        );
        // Disable passive to avoid triggering gestures in some devices
        sideContainer.addEventListener(
          'touchmove',
          this.onTouchMove,
          SUPPORTS_PASSIVE_EVENTS ? { passive: false } : false
        );
        sideContainer.addEventListener(
          'touchend',
          this.onTouchEnd,
          SUPPORTS_PASSIVE_EVENTS ? { passive: true } : false
        );
      }
    }

    if (this.mounted) {
      this.setState({ open: !this.state.open });
    }
  };

  onTouchStart = (evt: TouchEvent): void => {
    this.startX = evt.touches[0].pageX;
    this.currentX = this.startX;

    this.touchingSideNav = true;
    if (this.sideContainerRef.current !== null) {
      this.sideContainerRef.current.classList.add('touching');
    }
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
      this.touchingSideNav = false;

      const sideContainer = this.sideContainerRef.current;
      if (sideContainer !== null) {
        sideContainer.style.transform = '';
        sideContainer.classList.remove('touching');
      }

      if (this.currentX - this.startX > 0) {
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

    if (this.sideContainerRef.current !== null) {
      this.sideContainerRef.current.style.transform = `translateX(${translateX}px)`;
    }
  };

  render() {
    let isOpen = this.state.open;

    return (
      <div ref={this.slidingMenuRef} className={`col sliding-menu${isOpen ? ' open' : ''}`}>
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
          ref={this.sideContainerRef}
          className="sliding-menu-container"
          role="menu"
          aria-hidden={!isOpen}
          aria-expanded={isOpen}
        >
          <div className="text-right">
            <button
              ref={this.closeButtonRef}
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
