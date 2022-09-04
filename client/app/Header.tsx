import { memo, useRef, useEffect } from 'react';
import { Link, useLocation } from '~/components/router/client';
import { NavLink } from '~/components/router/client';
import { Home } from '~/routes';
import { Sidebar } from './Sidebar';
import { getPassiveOptions } from '~/services/passiveEvents';
import { ThemeToggle } from '~/components/ui/ThemeToggle';
import * as routes from '~/routes';

type Direction = -1 | 0 | 1 | 2;
const Up: Direction = 0;
const Down: Direction = 1;
const Indeterminate: Direction = -1;
const Reveal: Direction = 2;

let offsetHeight: number = 48;

// We wrap HeaderNav in a memo to avoid re-renders between navigation of pages with isHome=false -> isHome=false
export const HeaderNav: React.FC<{ isHome: boolean }> = memo(({ isHome }) => {
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

    addEventListener('scroll', update, getPassiveOptions());
    addEventListener('resize', update);

    return () => {
      removeEventListener('scroll', update, getPassiveOptions());
      removeEventListener('resize', update);
    };
  }, [isHome]);

  return (
    <header ref={headerRef}>
      <section>
        <div className="logo">
          <Link to="/" onPointerDown={Home.preload}>
            LW
            <b>JGL</b>
          </Link>
        </div>
        <Sidebar>
          <nav role="navigation" aria-label="Main Menu">
            <div>
              <NavLink to="/" end onPointerDown={routes.Home.preload}>
                HOME
              </NavLink>
            </div>
            <div>
              <NavLink to="/guide" onPointerDown={routes.Guide.preload}>
                GET STARTED
              </NavLink>
            </div>
            <div>
              <NavLink to="/download" onPointerDown={routes.Download.preload}>
                DOWNLOAD
              </NavLink>
            </div>
            <div>
              <NavLink to="/customize" onPointerDown={routes.Customize.preload}>
                CUSTOMIZE
              </NavLink>
            </div>
            <div>
              <NavLink to="/source" onPointerDown={routes.Source.preload}>
                SOURCE
              </NavLink>
            </div>
            <div>
              <NavLink to="/frameworks" onPointerDown={routes.Frameworks.preload}>
                FRAMEWORKS
              </NavLink>
            </div>
            <div className="btn-color-scheme">
              <ThemeToggle />
            </div>
          </nav>
        </Sidebar>
      </section>
    </header>
  );
});

export const Header: React.FC<{ children?: never }> = () => {
  const location = useLocation();
  return <HeaderNav isHome={location.pathname === '/'} />;
};
