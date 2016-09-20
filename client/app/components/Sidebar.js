import React from 'react'
import createFocusTrap from 'focus-trap'
import noscroll from '../utils/noscroll'
import {Link, IndexLink} from 'react-router'
import FaBars from '../icons/bars'
import FaClose from '../icons/close'

export default class Sidebar extends React.Component {

  state = {
    open: false,
  };

  componentDidMount() {
    this.focusTrap = createFocusTrap(this.refs.slidingMenu, {
      onDeactivate: this.onToggle,
      initialFocus: this.refs.closeButton,
      // clickOutsideDeactivates: true
    });
  }

  onToggle = () => {
    if ( this.state.open ) {
      noscroll.off();
      this.focusTrap.deactivate({onDeactivate:false});
    } else {
      noscroll.on();
      this.focusTrap.activate();
    }

    this.setState({open: !this.state.open});
  };

  onTouchStart = (evt) => {
    this.startX = evt.touches[0].pageX;
    this.currentX = this.startX;

    this.touchingSideNav = true;
    this.refs.sideContainer.classList.add('touching');
    requestAnimationFrame(this.update);
  };

  onTouchMove = (evt) => {
    if ( this.touchingSideNav ) {
      this.currentX = evt.touches[0].pageX;
      evt.preventDefault();
    }
  };

  onTouchEnd = () => {
    if ( this.touchingSideNav ) {
      this.touchingSideNav = false;

      const translateX = this.currentX - this.startX;
      this.refs.sideContainer.style.transform = '';
      this.refs.sideContainer.classList.remove('touching');

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

    this.refs.sideContainer.style.transform = `translateX(${translateX}px)`;
  };

  render() {
    let isOpen = this.state.open;

    return (
      <div ref="slidingMenu" className={['sliding-menu', isOpen ? 'open' : null].join(' ')}>
        <button type="button" className="btn-link sliding-menu-icon" onClick={this.onToggle} aria-hidden={isOpen} title="Open navigation menu"><FaBars size={24} /></button>
        <div className="sliding-menu-overlay" onClick={this.onToggle}></div>
        <div
          ref="sideContainer"
          className="sliding-menu-container"
          role="menu"
          aria-hidden={!isOpen}
          aria-expanded={isOpen}
          onTouchStart={this.onTouchStart}
          onTouchMove={this.onTouchMove}
          onTouchEnd={this.onTouchEnd}
        >
          <div className="text-xs-right">
            <button ref="closeButton" type="button" className="btn-link sliding-menu-icon" onClick={this.onToggle} title="Close navigation menu"><FaClose /></button>
          </div>
          <ul className="list-unstyled">
            <li><IndexLink to="/" activeClassName="active" onClick={this.onToggle}>HOME</IndexLink></li>
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
