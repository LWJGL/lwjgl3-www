// @flow
import * as React from 'react';
import { withRouter, Link } from 'react-router-dom';
import MainMenu from './MainMenu';
import Sidebar from './Sidebar';
import { IS_IOS } from '~/services/ua';
import supportsPassive from '~/services/supports-passive';
import { connect } from 'react-redux';
import classnames from 'classnames';
import type { ContextRouter } from 'react-router-dom';

const HEADER_CLASSNAME = 'site-header';

type HeaderProps = {
  desktop: boolean,
};

type Props = HeaderProps & ContextRouter;

type State = {
  pos: number,
  top: boolean,
  fixed: boolean,
  hidden: boolean,
};

class Header extends React.PureComponent<Props, State> {
  prev = 0;
  current = 0;
  direction = 0;
  ticking = false;
  offsetHeight = 0;
  mounted = false;

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
    const menu = document.querySelector(`.${HEADER_CLASSNAME}`);
    if (menu !== null) {
      this.offsetHeight = menu.offsetHeight;
    }

    window.addEventListener('scroll', this.onScroll, supportsPassive ? { passive: true } : false);
    this.mounted = true;
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll, supportsPassive ? { passive: true } : false);
    this.mounted = false;
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps !== this.props) {
      this.direction = 0;
      this.current = 0;
      this.setState({
        pos: 0,
        fixed: false,
      });
      // Force onScroll to handle the rest
      this.onScroll();
    }
  }

  onScroll = () => {
    if (!this.ticking && this.mounted) {
      requestAnimationFrame(this.update);
      this.ticking = true;
    }
  };

  update = () => {
    this.ticking = false;
    if (!this.mounted) {
      return;
    }
    this.prev = this.current;
    this.current = Math.max(0, window.pageYOffset);

    if (this.prev - this.current < 0) {
      // We are scrolling down
      if (IS_IOS) {
        if (!this.state.hidden) {
          this.setState({ hidden: true });
        }
      } else if (this.direction >= 0) {
        // We just started scroll down
        this.direction = -1;
        if (this.state.fixed) {
          // Release menu from the top of the viewport
          this.setState({ fixed: false, pos: this.prev });
        }
      }

      if (this.current > this.offsetHeight && this.state.top) {
        this.setState({ top: false });
      }
    } else {
      // We are scrolling up
      if (IS_IOS) {
        if (this.state.hidden) {
          this.setState({ hidden: false });
        }
      } else {
        if (this.direction <= 0) {
          // We just started scrolling up
          this.direction = 1;
          if (this.prev - this.current > this.offsetHeight) {
            this.setState({ fixed: true, pos: 0 });
          } else if (this.state.pos + this.offsetHeight < this.prev) {
            this.setState({ pos: Math.max(0, this.prev - this.offsetHeight) });
          }
        } else if (!this.state.fixed && this.current < this.state.pos) {
          // The entire menu has been revealed, fix it to the viewport
          this.setState({ fixed: true, pos: 0 });
        }
      }

      if (this.current <= this.offsetHeight && !this.state.top) {
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
            <div className="col col-auto">
              <Link to="/">
                LW<b>JGL</b> 3
              </Link>
            </div>
            {this.props.desktop === true
              ? <MainMenu className="main-menu-horizontal list-unstyled col" role="menu" />
              : <Sidebar />}
          </div>
        </nav>
      </header>
    );
  }
}

// force re-rendering when route changes
export default withRouter(
  connect(state => ({
    desktop: state.breakpoint.current > state.breakpoint.md,
  }))(Header)
);
