import React from 'react'
import createFocusTrap from 'focus-trap'
import noscroll from '../services/noscroll'
import Link from 'react-router/Link'
import FaBars from '../icons/bars'
import FaClose from '../icons/close'

import supportsPassive from '../services/supports-passive'

export default class Sidebar extends React.Component {

  state = {
    open: false,
  };

  componentDidMount() {
    this.focusTrap = createFocusTrap(this.slidingMenu, {
      onDeactivate: this.onToggle,
      initialFocus: this.closeButton,
      // clickOutsideDeactivates: true
    });
  }

  onToggle = () => {
    if ( this.state.open ) {
      noscroll.off();
      this.focusTrap.deactivate({onDeactivate: false});
      this.sideContainer.removeEventListener('touchstart', this.onTouchStart, supportsPassive ? {passive: true} : false);
      this.sideContainer.removeEventListener('touchmove', this.onTouchMove, supportsPassive ? {passive: true} : false);
      this.sideContainer.removeEventListener('touchend', this.onTouchEnd, supportsPassive ? {passive: true} : false);
    } else {
      noscroll.on();
      this.focusTrap.activate();
      this.sideContainer.addEventListener('touchstart', this.onTouchStart, supportsPassive ? {passive: true} : false);
      this.sideContainer.addEventListener('touchmove', this.onTouchMove, supportsPassive ? {passive: true} : false);
      this.sideContainer.addEventListener('touchend', this.onTouchEnd, supportsPassive ? {passive: true} : false);
    }

    this.setState({open: !this.state.open});
  };

  onTouchStart = (evt) => {
    this.startX = evt.touches[0].pageX;
    this.currentX = this.startX;

    this.touchingSideNav = true;
    this.sideContainer.classList.add('touching');
    requestAnimationFrame(this.update);
  };

  onTouchMove = (evt) => {
    if ( this.touchingSideNav ) {
      this.currentX = evt.touches[0].pageX;
      // evt.preventDefault();
    }
  };

  onTouchEnd = () => {
    if ( this.touchingSideNav ) {
      this.touchingSideNav = false;

      const translateX = this.currentX - this.startX;
      this.sideContainer.style.transform = '';
      this.sideContainer.classList.remove('touching');

      if ( translateX > 0 ) {
        this.onToggle();
      }
    }
  };

  update = () => {
    if ( !this.touchingSideNav ) {
      return;
    }

    requestAnimationFrame(this.update);

    let translateX = this.currentX - this.startX;

    if ( translateX < 0 ) {
      translateX = 0;
    }

    this.sideContainer.style.transform = `translateX(${translateX}px)`;
  };

  render() {
    let isOpen = this.state.open;

    return (
      <div ref={(el) => {this.slidingMenu = el}} className={['col hidden-lg-up sliding-menu', isOpen ? 'open' : null].join(' ')}>
        <button type="button" className="btn-link sliding-menu-icon" onClick={this.onToggle} aria-hidden={isOpen} title="Open navigation menu"><FaBars size={24} /></button>
        <div className="sliding-menu-overlay" onClick={this.onToggle}></div>
        <div
          ref={(el) => {this.sideContainer = el}}
          className="sliding-menu-container"
          role="menu"
          aria-hidden={!isOpen}
          aria-expanded={isOpen}
        >
          <div className="text-right">
            <button ref={(el) => {this.closeButton = el}} type="button" className="btn-link sliding-menu-icon" onClick={this.onToggle} title="Close navigation menu"><FaClose /></button>
          </div>
          <ul className="list-unstyled">
            <li><Link to="/" activeClassName="active" onClick={this.onToggle} activeOnlyWhenExact={true}>HOME</Link></li>
            <li><Link to="/guide" activeClassName="active" onClick={this.onToggle}>GET STARTED</Link></li>
            <li><Link to="/download" activeClassName="active" onClick={this.onToggle}>DOWNLOAD</Link></li>
            <li><Link to="/source" activeClassName="active" onClick={this.onToggle}>SOURCE</Link></li>
            <li><a href="http://forum.lwjgl.org/">FORUM</a></li>
            <li><a href="http://blog.lwjgl.org/">BLOG</a></li>
          </ul>
        </div>
      </div>
    )
  }

}
