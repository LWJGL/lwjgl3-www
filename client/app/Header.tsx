import { memo, useRef, useEffect } from 'react';
import { Link, useLocation } from '~/components/router/client';
import { Home } from '~/routes';
import { useBreakpoint, Breakpoint } from '~/hooks/useBreakpoint';
import { styled } from '~/theme/stitches.config';
import { SUPPORTS_PASSIVE_EVENTS } from '~/services/supports';
import { ZINDEX_MODAL_BACKDROP } from '~/theme';
import { MainMenu } from './MainMenu';
import { Sidebar } from './Sidebar';

const StyledHeader = styled('header', {
  position: 'sticky',
  top: -48,
  zIndex: ZINDEX_MODAL_BACKDROP - 1,
  color: 'white',
  lineHeight: '3rem',
  fontSize: '$lg',
  fontFamily: '$logo',
  willChange: 'top, background-color',
  userSelect: 'none',
  display: 'flex',
  hgap: '1rem',
  alignItems: 'center',
  padding: '0 1rem',
  transition: 'background-color 0.75s ease-out',

  '@supports(padding: 0 max(env(safe-area-inset-left), 1rem))': {
    padding: '0 max(env(safe-area-inset-left), 1rem)',
  },

  '&.opaque': {
    backgroundColor: '$dark',
    '.dark &': {
      backgroundColor: '$darker',
    },
  },
});

type Direction = -1 | 0 | 1 | 2;
const Up: Direction = 0;
const Down: Direction = 1;
const Indeterminate: Direction = -1;
const Reveal: Direction = 2;

let offsetHeight: number = 48;

// We wrap HeaderNav in a memo to avoid re-renders between navigation of pages with isHome=false -> isHome=false
export const HeaderNav: React.FC<{ isHome: boolean }> = memo(({ isHome }) => {
  const currentBreakpoint = useBreakpoint();
  const headerRef = useRef<HTMLElement>(null);
  const prevRef = useRef<number>(0);
  const directionRef = useRef<Direction>(Indeterminate);

  useEffect(() => {
    let header = headerRef.current;
    if (header !== null) {
      offsetHeight = header.getBoundingClientRect().height;
      header.style.top = `-${offsetHeight}px`;
      if (isHome) {
        header.classList.remove('opaque');
      } else {
        header.classList.add('opaque');
      }
    }

    function update(e: Event) {
      if (headerRef.current === null) {
        return;
      }

      if (e.type === 'resize') {
        offsetHeight = headerRef.current.getBoundingClientRect().height;
      }

      let y = window.pageYOffset;
      let prev = prevRef.current;

      if (y === prev || y < 0) {
        // skip if no change or out of bounds (iOS safari bounce effect)
        return;
      }

      if (isHome) {
        if (y >= offsetHeight && prev < offsetHeight) {
          headerRef.current.classList.add('opaque');
        } else if (y < offsetHeight && prev >= offsetHeight) {
          headerRef.current.classList.remove('opaque');
        }
      }

      let direction = directionRef.current;

      if (prev - y < 0) {
        // We are scrolling down
        if (direction !== Down) {
          if (prev === 0) {
            // if we were already at the top, skip Reveal
            directionRef.current = Down;
          } else {
            if (direction !== Reveal) {
              // We just started scrolling down
              directionRef.current = Reveal;
            }
            let bounds = headerRef.current.getBoundingClientRect();
            let delta = y - prev;
            let newOffset = Math.max(bounds.top - delta, -offsetHeight);
            headerRef.current.style.top = `${newOffset}px`;
            if (newOffset <= -offsetHeight) {
              directionRef.current = Down;
            }
          }
        }
      } else {
        // We are scrolling up
        if (y === 0) {
          // snap if we are at the top
          headerRef.current.style.top = `${-offsetHeight}px`;
        } else if (direction !== Up) {
          if (direction !== Reveal) {
            // We just started scrolling up
            directionRef.current = Reveal;
          }

          let bounds = headerRef.current.getBoundingClientRect();
          let delta = prev - y;
          let newOffset = Math.min(bounds.top + delta, 0);

          headerRef.current.style.top = `${newOffset}px`;

          if (newOffset >= 0) {
            directionRef.current = Up;
          }
        }
      }

      prevRef.current = y;
    }

    let listenerOptions = SUPPORTS_PASSIVE_EVENTS ? { passive: true } : false;
    addEventListener('scroll', update, listenerOptions);
    addEventListener('resize', update);

    return () => {
      //@ts-expect-error
      removeEventListener('scroll', update, listenerOptions);
      removeEventListener('resize', update);
    };
  }, [isHome]);

  return (
    <StyledHeader ref={headerRef} role="navigation">
      <Link to="/" onPointerDown={Home.preload}>
        LW
        <b>JGL</b>
      </Link>
      {currentBreakpoint > Breakpoint.md ? <MainMenu direction="horizontal" /> : <Sidebar />}
    </StyledHeader>
  );
});

export const Header: React.FC<{ children?: never }> = () => {
  const location = useLocation();
  return <HeaderNav isHome={location.pathname === '/'} />;
};
