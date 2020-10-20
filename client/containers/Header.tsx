import { memo, useEffect, useLayoutEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { styled } from '~/theme/stitches.config';
import { ZINDEX_MODAL_BACKDROP } from '~/theme';
import { useBreakpoint } from '~/components/Breakpoint';
import { SUPPORTS_PASSIVE_EVENTS } from '~/services/supports';
import { IS_IOS } from '~/services/ua';
import { useServiceWorker } from '~/hooks/useServiceWorker';
import { MainMenu } from './MainMenu';
import { Sidebar } from './Sidebar';
import { Icon } from '~/components/Icon';
import '~/components/icons/fa/duotone/cloud-download';

const StyledHeader = styled('header', {
  // TODO: Add one more dash below in next @stitches version
  '--safe-margin': 'env(safe-area-inset-left)',
  position: 'absolute',
  zIndex: ZINDEX_MODAL_BACKDROP - 1,
  top: 0,
  left: 0,
  width: '100%',
  color: 'white',
  lineHeight: '3rem',
  fontSize: '1.2rem',
  willChange: 'background-color, top',
  userSelect: 'none',
  display: 'flex',
  // gap: '1rem',
  hstack: '1rem',
  alignItems: 'center',
  padding: '0 1rem',

  min: {
    padding: '0 max(var(--safe-margin), 1rem)',
  },

  a: {
    color: 'white',
    fontWeight: 300,
    textDecoration: 'none',
    transition: '0.5s background-size ease-out',
    ':focus': {
      outline: 'none',
    },
    '&.active': {
      color: 'yellow',
    },

    lg: {
      backgroundSize: '0 3px',
      background: 'linear-gradient(currentColor, currentColor) bottom no-repeat',
      '&:focus-visible,&:hover,&.active': {
        backgroundSize: '100% 3px',
      },
      '&.active:focus-visible': {
        backgroundImage: 'linear-gradient(white, white)',
        backgroundSize: '90% 3px',
      },
    },
  },

  variants: {
    fixed: {
      true: {
        position: 'fixed',
      },
    },
    hidden: {
      true: {},
    },
    alt: {
      true: {
        position: 'fixed',
        willChange: 'top, background-color, opacity',
        transition: 'top 0.3s cubic-bezier(0, 0, 0.3, 1), opacity 0.5s ease-out',
      },
    },
    home: {
      true: {
        transition: 'background-color 0.75s ease-out',
      },
    },
    opaque: {
      true: {
        backgroundColor: 'black',
        lg: {
          backgroundColor: '#1b2426',
        },
      },
    },
  },
});

StyledHeader.compoundVariant(
  {
    alt: true,
    hidden: true,
  },
  {
    opacity: 0,
    top: '-3rem',
    pointerEvents: 'none',
  }
);

function ServiceWorkerUpdate() {
  const [pending, update] = useServiceWorker();

  return pending ? (
    <div className="d-flex align-items-center">
      <button
        type="button"
        onClick={update as any}
        className="btn btn-primary btn-sm present-yourself"
        title="Update website to latest version"
      >
        <Icon name="fa/duotone/cloud-download" style={{ fontSize: '1.25rem' }} />
      </button>
    </div>
  ) : null;
}

let offsetHeight = 48;

export const Header: React.FC<{ children?: never }> = () => {
  const location = useLocation();
  return <HeaderNav isHome={location.pathname === '/'} />;
};

export const HeaderNav: React.FC<{ isHome: boolean; children?: never }> = memo(({ isHome }) => {
  const {
    current: currentBreakpoint,
    breakpoints: { md },
  } = useBreakpoint();
  const [pos, setPos] = useState(0);
  const [top, setTop] = useState(true);
  const [fixed, setFixed] = useState(false);
  const [hidden, setHidden] = useState(false);
  const menu = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    // Measure menu height, should be ~ 48 pixels
    if (menu.current !== null) {
      offsetHeight = menu.current.offsetHeight;
    }
  }, []);

  useEffect(() => {
    enum Direction {
      Up,
      Down,
    }

    // Re-create useState variables to prevent scope conflicts
    let pos = 0;
    let top = true;
    let fixed = false;
    let hidden = false;

    // Internal tracking
    let mounted = true;
    let prev = 0;
    let current = 0;
    let direction = Direction.Down;
    let ticking = false;

    function _setPos(value: number) {
      pos = value;
      setPos(value);
    }
    function _setTop(value: boolean) {
      top = value;
      setTop(value);
    }
    function _setFixed(value: boolean) {
      fixed = value;
      setFixed(value);
    }
    function _setHidden(value: boolean) {
      hidden = value;
      setHidden(value);
    }

    function update() {
      ticking = false;
      if (!mounted) {
        return;
      }
      prev = current;
      current = Math.max(0, window.pageYOffset);

      if (prev - current < 0) {
        // We are scrolling down
        if (IS_IOS) {
          if (!hidden) {
            _setHidden(true);
          }
        } else if (direction === Direction.Up) {
          // We just started scroll down
          direction = Direction.Down;
          if (fixed) {
            // Release menu from the top of the viewport
            _setFixed(false);
            _setPos(prev);
          }
        }

        if (current > offsetHeight && top) {
          _setTop(false);
        }
      } else {
        // We are scrolling up
        if (IS_IOS) {
          if (hidden) {
            _setHidden(false);
          }
        } else {
          if (direction === Direction.Down) {
            // We just started scrolling up
            direction = Direction.Up;
            if (prev - current > offsetHeight) {
              _setFixed(true);
              _setPos(0);
            } else if (pos + offsetHeight < prev) {
              _setPos(Math.max(0, prev - offsetHeight));
            }
          } else if (!fixed && current < pos) {
            // The entire menu has been revealed, fix it to the viewport
            _setFixed(true);
            _setPos(0);
          }
        }

        if (current <= offsetHeight && !top) {
          _setTop(true);
        }
      }
    }

    function onScroll() {
      if (!ticking && mounted) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, SUPPORTS_PASSIVE_EVENTS ? { passive: true } : false);
    return () => {
      window.removeEventListener('scroll', onScroll, false);
      mounted = false;
    };
  }, []);

  return (
    <StyledHeader
      ref={menu}
      role="navigation"
      home={isHome}
      opaque={!isHome || !top}
      fixed={fixed}
      hidden={hidden}
      alt={IS_IOS}
      style={{ top: pos }}
    >
      <Link to="/">
        LW
        <b>JGL</b> 3
      </Link>
      <ServiceWorkerUpdate />
      {currentBreakpoint > md ? <MainMenu horizontal /> : <Sidebar />}
    </StyledHeader>
  );
});
