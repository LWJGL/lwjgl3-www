import React from 'react';
import withRouter from 'react-router-dom/withRouter';
import Link from 'react-router-dom/Link';
import MainMenu from './MainMenu';
import Sidebar from './Sidebar';
import { IS_IOS } from '../services/globals';
import supportsPassive from '../services/supports-passive';
import { connect } from 'react-redux';
import classnames from 'classnames';

const HEADER_CLASSNAME = 'site-header';

// force re-rendering when route changes
@withRouter
@connect(state => ({
  desktop: state.breakpoint.current > state.breakpoint.md,
}))
class Header extends React.Component {
  prev = 0;
  current = 0;
  flip = 0;
  fixed = false;
  direction = 0;
  ticking = false;
  offsetHeight = 0;

  state = {
    pos: 0,
    top: true,
    fixed: false,
    hidden: false,
  };

  componentDidMount() {
    // Cache menu height to avoid touching the DOM on every tick
    // WARNING: Do this on update() if menu changes in height dynamically
    // Better get a ref to avoid querying the DOM
    this.offsetHeight = document.querySelector(`.${HEADER_CLASSNAME}`).offsetHeight;

    window.addEventListener('scroll', this.onScroll, supportsPassive ? { passive: true } : false);
  }

  // This never runs, events are automatically cleaned up on window.unload
  /*componentWillUnmount() {
   window.removeEventListener('scroll', this.onScroll, supportsPassive ? {passive: true} : false);
  }*/

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.prev = 0;
      this.flip = 0;
      this.fixed = false;
      this.direction = 0;
      requestAnimationFrame(this.forceUpdate);
    }
  }

  forceUpdate = () => {
    this.current = window.pageYOffset;
    this.setState({
      pos: 0,
      top: this.current <= this.offsetHeight,
      fixed: false,
      hidden: this.current > 0,
    });
  };

  onScroll = () => {
    const offsetY = window.pageYOffset;

    if (offsetY >= 0) {
      if (!this.ticking) {
        this.prev = this.current;
        requestAnimationFrame(this.update);
        this.ticking = true;
      }
      this.current = offsetY;
    }
  };

  checkOffset() {
    if (!this.fixed && this.current < this.flip - this.offsetHeight) {
      // The entire menu has been revealed, fix it to the viewport
      this.setState({ fixed: true, pos: 0 });
      this.fixed = true;
    }
  }

  update = () => {
    this.ticking = false;

    if (this.prev - this.current < 0) {
      // We are scrolling down
      if (IS_IOS) {
        this.setState({ hidden: true });
      } else {
        if (this.direction >= 0) {
          // We just started scroll down
          this.direction = -1;
          if (this.fixed) {
            // Release menu from the top of the viewport
            this.fixed = false;
            this.setState({ fixed: false, pos: this.prev });
          }
        }
      }

      if (this.current > this.offsetHeight) {
        this.setState({ top: false });
      }
    } else {
      // We are scrolling up
      if (IS_IOS) {
        this.setState({ hidden: false });
      } else {
        if (this.direction <= 0) {
          // We just started scrolling up
          this.direction = 1;
          // Remember where we started scrolling up
          this.flip = this.prev;
          this.checkOffset();
          if (!this.fixed) {
            // Place menu from that position upwards so it gets revealed naturally
            this.setState({ pos: Math.max(0, this.flip - this.offsetHeight) });
          }
        } else {
          this.checkOffset();
        }
      }

      if (this.current <= this.offsetHeight) {
        this.setState({ top: true });
      }
    }
  };

  render() {
    const { pos, top, fixed, hidden } = this.state;

    return (
      <header
        role="navigation"
        className={classnames(HEADER_CLASSNAME, {
          alt: IS_IOS,
          top,
          fixed,
          hidden,
        })}
        style={{ top: pos }}
      >
        <nav className="container-fluid">
          <div className="row">
            <div className="col col-auto"><Link to="/">LW<b>JGL</b> 3</Link></div>
            {this.props.desktop
              ? <MainMenu className="main-menu-horizontal list-unstyled col" role="menu" />
              : <Sidebar />}
          </div>
        </nav>
      </header>
    );
  }
}

export default Header;
