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
  // Implements immediate-reveal header using the following technique:
  // original: https://codepen.io/jaffathecake/pen/OJvbpRZ
  // w/offset: https://codepen.io/jaffathecake/pen/OJvbdjK
  position: 'relative',
  top: 'calc(var(--computed-height) * -1 - 1px)',
  bottom: 'calc(100% - var(--computed-height))',

  // decorative properties
  zIndex: ZINDEX_MODAL_BACKDROP - 1,
  color: 'white',
  lineHeight: '3rem',
  fontSize: '$lg',
  fontFamily: '$logo',
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

const registerOptions = SUPPORTS_PASSIVE_EVENTS ? { passive: true } : false;
let headerHeight = -1;

const HeaderNav: React.FC<{ isHome: boolean }> = memo(({ isHome }) => {
  const currentBreakpoint = useBreakpoint();
  const shifterRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function fixHeaderoffset() {
      if (!headerRef.current || !shifterRef.current) {
        return;
      }

      const header = headerRef.current;

      if (headerHeight === -1) {
        headerHeight = header.getBoundingClientRect().height;
        header.style.position = 'sticky';
        header.style.setProperty('--computed-height', headerHeight + 'px');
      }

      const y = Math.min(header.offsetTop, document.documentElement.scrollHeight - innerHeight - headerHeight);
      shifterRef.current.style.height = y + 'px';
      header.style.marginBottom = -y + 'px';
    }

    addEventListener('scroll', fixHeaderoffset, registerOptions);
    addEventListener('resize', fixHeaderoffset);
    fixHeaderoffset();

    return () => {
      //@ts-expect-error
      removeEventListener('scroll', fixHeaderoffset, registerOptions);
      removeEventListener('resize', fixHeaderoffset);
    };
  }, []);

  useEffect(() => {
    if (!headerRef.current) {
      return;
    }
    if (!isHome) {
      headerRef.current.classList.add('opaque');
      return;
    }

    let classNameSet = false;

    function handleScroll() {
      if (!headerRef.current) {
        return;
      }
      if (scrollY > 0) {
        if (!classNameSet) {
          headerRef.current.classList.add('opaque');
          classNameSet = true;
        }
      } else {
        headerRef.current.classList.remove('opaque');
        classNameSet = false;
      }
    }

    addEventListener('scroll', handleScroll, registerOptions);
    addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      //@ts-expect-error
      removeEventListener('scroll', handleScroll, registerOptions);
      removeEventListener('resize', handleScroll);
    };
  }, [isHome]);

  return (
    <>
      <div ref={shifterRef}></div>
      <StyledHeader ref={headerRef} role="navigation">
        <Link to="/" onPointerDown={Home.preload}>
          LW
          <b>JGL</b>
        </Link>
        {currentBreakpoint > Breakpoint.md ? <MainMenu direction="horizontal" /> : <Sidebar />}
      </StyledHeader>
    </>
  );
});

export const Header: React.FC<{ children?: never }> = () => {
  const location = useLocation();
  return <HeaderNav isHome={location.pathname === '/'} />;
};
