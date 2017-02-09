import React, { PropTypes } from 'react'
import withRouter from 'react-router-dom/withRouter'
import Link from 'react-router-dom/Link'
import MainMenu from './MainMenu'
import Sidebar from './Sidebar'
import { IS_IOS } from '../services/globals'
import supportsPassive from '../services/supports-passive'
import { connect } from 'react-redux'

const HEADER_CLASS = `site-header top${IS_IOS ? ' alt' : ''}`;

@withRouter
@connect(
  (state) => ({
    desktop: state.breakpoint.current > state.breakpoint.md,
  })
)
class Header extends React.Component {

  prev = 0;
  current = 0;
  flip = 0;
  fixed = false;
  direction = 0;
  ticking = false;
  offsetHeight = 0;
  el;

  componentDidMount() {
    this.setup();
    window.addEventListener('scroll', this.onScroll, supportsPassive ? {passive: true} : false);
  }

  setup() {
    // Cache menu height to avoid touching the DOM on every tick
    // WARNING: Do this on update() if menu changes in height dynamically
    this.offsetHeight = this.el.offsetHeight;

    // Initial scroll values
    this.current = window.pageYOffset;
    this.prev = this.current;

    if ( this.props.location.pathname === '/' ) {
      this.el.classList.add('nobg');
    } else {
      this.el.classList.remove('nobg');
    }

    // this.el.classList.toggle('top', this.current === 0); // NOT SUPPORTED ON IE
    if ( this.current === 0 ) {
      this.el.classList.add('top');
    } else {
      this.el.classList.remove('top');
    }
  }

  // This never runs, events are automatically cleaned up on window.unload
  /*componentWillUnmount() {
   window.removeEventListener('scroll', this.onScroll, supportsPassive ? {passive: true} : false);
   }*/

  componentDidUpdate() {
    // Fired when route changes
    requestAnimationFrame(this.setup.bind(this));
  }

  onScroll = () => {
    const offsetY = window.pageYOffset;

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

      if ( this.current > this.offsetHeight ) {
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

      if ( this.current <= this.offsetHeight ) {
        this.el.classList.add('top');
      }
    }
  };

  render() {
    return (
      <header ref={(el) => {this.el = el}} className={HEADER_CLASS} role="navigation">
        <nav className="container-fluid">
          <div className="row">
            <div className="col col-auto"><Link to="/">LW<b>JGL</b> 3</Link></div>
            {
              this.props.desktop
                ? <MainMenu className="main-menu-horizontal list-unstyled col" role="menu" />
                : <Sidebar />
            }
          </div>
        </nav>
      </header>
    )
  }
}

export default Header
