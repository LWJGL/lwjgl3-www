/* @flow weak */

import React from 'react'
import {Link} from 'react-router'
import Sidebar from './Sidebar'

import { IS_IOS } from '../services/globals'

export default class Header extends React.Component {

  prev = 0;
  current = 0;
  flip = 0;
  fixed = false;
  direction = 0;
  ticking = false;
  offsetHeight = 0;
  el;

  static propTypes = {
    isHome: React.PropTypes.bool.isRequired
  };

  componentDidMount() {
    // Cache menu height to avoid touching the DOM on every tick
    // WARNING: Do this on update() if menu changes in height dynamically
    this.offsetHeight = this.el.offsetHeight;

    // Initial scroll values
    this.current = window.pageYOffset;
    this.prev = this.current;

    if ( this.current > 0 ) {
      this.el.classList.remove('top');
    }

    window.addEventListener('scroll', this.onScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  }

  componentDidUpdate() {
    // Fired when route changes
    requestAnimationFrame(this.update);
  }

  onScroll = () => {
    let offsetY = window.pageYOffset;

    if ( offsetY < 0 || this.prev === offsetY ) {  // e.g. iOS inertial scrolling reports negative offsets
      return;
    }

    this.prev = this.current;
    this.current = offsetY;

    if ( !this.ticking ) {
      requestAnimationFrame(this.update);
      this.ticking = true;
    }
  };

  checkOffset() {
    if ( !this.fixed && this.current < this.flip - this.offsetHeight ) {
      // The entire menu has been revealed, fix it to the viewport
      this.el.classList.add('fixed');
      this.el.style.top = '0';
      this.fixed = true;
    }
  }

  update = () => {
    this.ticking = false;

    if ( this.prev - this.current < 0 ) {
      // We are scrolling down
      if ( IS_IOS ) {
        this.el.classList.add('hidden');
      } else {
        if ( this.direction >= 0 ) {
          // We just started scroll down
          this.direction = -1;
          if ( this.fixed ) {
            // Release menu from the top of the viewport
            this.fixed = false;
            this.el.classList.remove('fixed');
            this.el.style.top = `${this.prev}px`;
          }
        }
      }

      if ( this.current > this.offsetHeight/* && this.prev <= this.offsetHeight*/ ) {
        this.el.classList.remove('top');
      }
    } else {
      // We are scrolling up
      if ( IS_IOS ) {
        this.el.classList.remove('hidden');
      } else {
        if ( this.direction <= 0 ) {
          // We just started scrolling up
          this.direction = 1;
          // Remember where we started scrolling up
          this.flip = this.prev;
          this.checkOffset();
          if ( !this.fixed ) {
            // Place menu from that position upwards so it gets revealed naturally
            this.el.style.top = `${Math.max(0, this.flip - this.offsetHeight)}px`;
          }
        } else {
          this.checkOffset();
        }
      }

      if ( this.current <= this.offsetHeight/* && this.prev >= this.offsetHeight*/ ) {
        this.el.classList.add('top');
      }
    }
  };

  render() {
    let headerClass = ['top'];
    if ( this.props.isHome ) {
      headerClass.push('nobg');
    }
    if ( IS_IOS ) {
      headerClass.push('alt');
    }

    return (
      <header ref={el => this.el = el} role="navigation" className={headerClass.join(' ')}>
        <nav className="container-fluid">
          <div className="row">
            <div className="col-lg-2 col-xs-8"><Link to="/">LW<b>JGL</b> 3</Link></div>

            <ul className="list-unstyled col-lg-10 hidden-md-down" role="menu">
              <li><Link to="/" activeClassName="active" activeOnlyWhenExact={true}>HOME</Link></li>
              <li><Link to="/guide" activeClassName="active">GET STARTED</Link></li>
              <li><Link to="/download" activeClassName="active">DOWNLOAD</Link></li>
              <li><Link to="/source" activeClassName="active">SOURCE</Link></li>
              <li><a href="http://forum.lwjgl.org/" target="_blank">FORUM</a></li>
              <li><a href="http://blog.lwjgl.org/" target="_blank">BLOG</a></li>
            </ul>

            <div className="col-xs-4 hidden-lg-up text-xs-right">
              <Sidebar />
            </div>
          </div>
        </nav>
      </header>
    )
  }
}
