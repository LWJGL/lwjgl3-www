// @jsx jsx
//@ts-ignore
import { css, jsx } from '@emotion/core';
import { Link } from '@reach/router';
import * as React from 'react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useBreakpoint } from '~/components/Breakpoint';
import { SUPPORTS_PASSIVE_EVENTS } from '~/services/supports';
import { IS_IOS } from '~/services/ua';
import { cc, COLOR_PRIMARY } from '~/theme';
import CloudDownload from '../components/icons/md/CloudDownload';
import { useServiceWorker } from '../hooks/useServiceWorker';
import { MainMenu } from './MainMenu';
import { Sidebar } from './Sidebar';
jsx;

const HEADER_CLASSNAME = 'site-header';
const styleHome = css`
  transition: background-color 0.5s ease-out;
`;
const styleOpaque = css`
  background-color: ${COLOR_PRIMARY.css()};
`;

function ServiceWorkerUpdate() {
  const [pending, update] = useServiceWorker();

  return pending ? (
    <button
      onClick={update as any}
      className="btn btn-primary btn-sm present-yourself py-0 px-1 ml-3"
      title="Update website to latest version"
    >
      <CloudDownload />
    </button>
  ) : null;
}

interface Props {
  isHome: boolean;
}

export function Header({ isHome }: Props) {
  const {
    current: currentBreakpoint,
    breakpoints: { md },
  } = useBreakpoint();
  const [pos, setPos] = useState(0);
  const [top, setTop] = useState(true);
  const [fixed, setFixed] = useState(false);
  const [hidden, setHidden] = useState(false);
  const firstRender = useRef(true);
  const offsetHeight = useRef(0);

  useLayoutEffect(() => {
    const menu: HTMLDivElement | null = document.querySelector(`.${HEADER_CLASSNAME}`);
    if (menu !== null) {
      offsetHeight.current = menu.offsetHeight;
    }
  }, []);

  useEffect(
    () => {
      // Re-create useState variables to prevent scope conflicts
      let pos = 0;
      let top = true;
      let fixed = false;
      let hidden = false;

      // Internal tracking
      let mounted = true;
      let prev = 0;
      let current = 0;
      let direction = 0;
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
          } else if (direction >= 0) {
            // We just started scroll down
            direction = -1;
            if (fixed) {
              // Release menu from the top of the viewport
              _setFixed(false);
              _setPos(prev);
            }
          }

          if (current > offsetHeight.current && top) {
            _setTop(false);
          }
        } else {
          // We are scrolling up
          if (IS_IOS) {
            if (hidden) {
              _setHidden(false);
            }
          } else {
            if (direction <= 0) {
              // We just started scrolling up
              direction = 1;
              if (prev - current > offsetHeight.current) {
                _setFixed(true);
                _setPos(0);
              } else if (pos + offsetHeight.current < prev) {
                _setPos(Math.max(0, prev - offsetHeight.current));
              }
            } else if (!fixed && current < pos) {
              // The entire menu has been revealed, fix it to the viewport
              _setFixed(true);
              _setPos(0);
            }
          }

          if (current <= offsetHeight.current && !top) {
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

      if (!firstRender.current) {
        // isHome flipped, reset
        direction = 0;
        current = 0;
        _setFixed(false);
        _setPos(0);
        // Force onScroll to handle the rest
        onScroll();
      }

      firstRender.current = false;
      window.addEventListener('scroll', onScroll, SUPPORTS_PASSIVE_EVENTS ? { passive: true } : false);
      return () => {
        window.removeEventListener('scroll', onScroll, false);
        mounted = false;
      };
    },
    [isHome]
  );

  return (
    <header
      role="navigation"
      css={[isHome && styleHome, (!isHome || !top) && styleOpaque]}
      className={cc(HEADER_CLASSNAME, {
        alt: IS_IOS,
        fixed,
        hidden,
      })}
      style={{ top: pos }}
    >
      <nav className="container-fluid">
        <div className="row">
          <div className="col col-auto">
            <Link to="/">
              LW
              <b>JGL</b> 3
            </Link>
            <ServiceWorkerUpdate />
          </div>
          {currentBreakpoint > md ? <MainMenu className="main-menu-horizontal list-unstyled col" /> : <Sidebar />}
        </div>
      </nav>
    </header>
  );
}
