// @flow
import * as React from 'react';
import { Link } from 'react-router-dom';
import MainMenu from './MainMenu';
import Sidebar from './Sidebar';
import { IS_IOS } from '~/services/ua';
import supportsPassive from '~/services/supports-passive';
import { css } from 'emotion';
import wrap from 'classwrap';
import { COLOR_PRIMARY } from '~/theme';
import store from '~/store';

const HEADER_CLASSNAME = 'site-header';
const styleOpaque = css`background-color: ${COLOR_PRIMARY.hsl()};`;
const styleHome = css`transition: background-color 0.5s ease-out;`;

type Props = {|
  pathname: string,
|};

type State = {|
  pos: number,
  top: boolean,
  fixed: boolean,
  hidden: boolean,
  desktop: boolean,
|};

class Header extends React.PureComponent<Props, State> {
  prev = 0;
  current = 0;
  direction = 0;
  ticking = false;
  offsetHeight = 0;
  mounted = false;
  unsubscribe: Function;

  isDesktop() {
    const breakpoint = store.getState().breakpoint;
    return breakpoint.current > breakpoint.md;
  }

  storeListener = () => {
    this.setState({ desktop: this.isDesktop() });
  };

  constructor(props: Props) {
    super(props);

    this.unsubscribe = store.subscribe(this.storeListener);

    this.state = {
      pos: 0,
      top: true,
      fixed: false,
      hidden: false,
      desktop: this.isDesktop(),
    };
  }

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
    this.unsubscribe();
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
    const isHome = this.props.pathname === '/';

    return (
      <header
        role="navigation"
        className={wrap([
          HEADER_CLASSNAME,
          {
            [styleHome]: isHome,
            [styleOpaque]: !isHome || !top,
            alt: IS_IOS,
            fixed,
            hidden,
          },
        ])}
        style={{ top: pos }}
      >
        <nav className="container-fluid">
          <div className="row">
            <div className="col col-auto">
              <Link to="/">
                LW<b>JGL</b> 3
              </Link>
            </div>
            {this.state.desktop === true ? (
              <MainMenu className="main-menu-horizontal list-unstyled col" role="menu" />
            ) : (
              <Sidebar />
            )}
          </div>
        </nav>
      </header>
    );
  }
}

export default Header;
