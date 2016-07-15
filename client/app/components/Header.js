import React from 'react'
import {Link, IndexLink} from 'react-router/es6'
import Sidebar from './Sidebar'

// Can't find a reliable way to compute the viewport offsetTop in iOS because pageYOffset returns the pixels
// from the top of the screen ( the point under the browser's address bar! )
const ios = process.browser ? /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream : false;

export default class Header extends React.Component {

  prev = 0;
  current = 0;
  flip = 0;
  fixed = false;
  direction = 0;
  ticking = false;
  offsetHeight = 0;
  el;

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

    window.addEventListener('scroll', this.onScroll.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll.bind(this));
  }

  componentDidUpdate() {
    requestAnimationFrame(this.update.bind(this));
  }

  onScroll() {
    let offsetY = window.pageYOffset;

    if ( offsetY < 0 || this.prev === offsetY ) {  // e.g. iOS inertial scrolling reports negative offsets
      return;
    }

    this.prev = this.current;
    this.current = offsetY;

    if ( !this.ticking ) {
      requestAnimationFrame(this.update.bind(this));
      this.ticking = true;
    }
  }

  checkOffset() {
    if ( !this.fixed && this.current < this.flip - this.offsetHeight ) {
      // The entire menu has been revealed, fix it to the viewport
      this.el.classList.add('fixed');
      this.el.style.top = 0;
      this.fixed = true;
    }
  }

  update() {
    this.ticking = false;

    if ( this.prev - this.current < 0 ) {
      // We are scrolling down
      if ( ios ) {
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
      if ( ios ) {
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
  }

  render() {
    let headerClass = ['top'];
    if ( this.props.isHome ) {
      headerClass.push('nobg');
    }
    if ( ios ) {
      headerClass.push('alt');
    }

    return (
      <header ref={ (el) => this.el = el} role="navigation" className={headerClass.join(' ')}>
        <nav className="container-fluid">
          <div className="row">
            <div className="col-lg-2 col-xs-8"><IndexLink to="/">LW<b>JGL</b> 3</IndexLink></div>

            <ul className="list-unstyled col-lg-10 hidden-md-down" role="menu">
              <li><IndexLink to="/">HOME</IndexLink></li>
              <li><Link to="/guide">GET STARTED</Link></li>
              <li><Link to="/download">DOWNLOAD</Link></li>
              <li><Link to="/source">SOURCE</Link></li>
              <li><a href="http://forum.lwjgl.org/">FORUM</a></li>
              <li><a href="http://blog.lwjgl.org/">BLOG</a></li>
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