import React, { lazy, Suspense, useState, useEffect } from 'react';
import { css } from 'emotion';
import { Link } from '@reach/router';
import { Icon, KeyboardArrowDown } from '~/components/icons';
import { Logo } from './Logo';
import { contextOptions } from './contextOptions';

const Canvas = lazy(() => import(/* webpackChunkName: "route-home$canvas" */ './Canvas'));

const CssHeroBox = css`
  margin-top: -4rem;
  background: linear-gradient(
    to top left,
    #4cddff,
    #3b9aca 10%,
    #2d6ca5 20%,
    #2a5291 27%,
    #283d81 35%,
    #222654 50%,
    #1e1635 63%,
    #0c0010 93%,
    #000
  );
  width: 100%;
  height: 100vh;
  position: relative;
`;

const HeroBox: React.FC = props => <section className={CssHeroBox}>{props.children}</section>;

const CssLogoContainer = css`
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100vh;

  .logo {
    display: block;
    width: 100%;
    height: auto;
    max-width: 700px;
    padding: 1rem;
    transform: translateY(3rem);
    opacity: 0;
    animation: anim-reset-opacity-transform 1s ease forwards;
    @media (max-height: 420px) {
      max-width: 75%;
    }
  }
`;

const LogoContainer: React.FC = props => (
  <div className={`d-flex flex-column justify-content-center align-items-center ${CssLogoContainer}`}>
    {props.children}
  </div>
);

const CssHeroContent = css`
  text-align: center;
  padding: 0 2rem;
  color: white;
  font-weight: 300;

  .svg-icon {
    font-size: 1.5rem;
  }

  a {
    color: white;
  }

  @media (max-width: 600px) {
    h1 {
      font-size: 1.4rem;
    }
    a {
      font-size: 90%;
    }
  }

  @media (max-width: 400px), (max-height: 420px) {
    h1 {
      font-size: 1.1rem;
      line-height: 1.5rem;
    }
  }
`;

const HeroContent: React.FC = props => <div className={CssHeroContent}>{props.children}</div>;

enum UseWebGL {
  Unknown,
  Off,
  NotSupported,
  On,
}

let useWebGL = UseWebGL.Unknown;
const supportsWebGL = () => useWebGL === UseWebGL.On;

function CanvasContainer() {
  const [webGL, setGL] = useState(supportsWebGL);

  useEffect(() => {
    // If we detected WebGL before, the checks below already passed
    if (useWebGL !== UseWebGL.Unknown) {
      return;
    }

    // Skip if user prefers-reduced-motion
    // ! Bah! Disables animation under Windows if user has disabled OS window animations (Chrome)
    // TODO: If the above is changed, re-enable
    // const preferesReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // if (preferesReducedMotion) {
    //   useWebGL = UseWebGL.Off;
    //   return;
    // }

    // Check device memory, skip for under 4GB
    if (navigator.deviceMemory !== undefined && navigator.deviceMemory < 4) {
      useWebGL = UseWebGL.Off;
      return;
    }

    // Check thread count, skip if probably old/less-capable CPU
    if (navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency < 4) {
      useWebGL = UseWebGL.Off;
      return;
    }

    // Check connection quality
    if (navigator.connection !== undefined) {
      // Skip for slow connections
      switch (navigator.connection.effectiveType) {
        case 'slow-2g':
        case '2g':
          // ! Connection status may change, do not change supportsWebGL flag
          return;
      }

      // Skip if user opted-in into a reduced data usage mode
      if (navigator.connection.saveData === true) {
        return;
      }
    }

    // detect WebGL support
    const cnv = document.createElement('canvas');
    if (
      cnv.getContext('webgl', contextOptions) !== null ||
      (cnv.getContext('experimental-webgl', contextOptions) as WebGLRenderingContext | null) !== null
    ) {
      useWebGL = UseWebGL.On;
      setGL(true);
    } else {
      useWebGL = UseWebGL.NotSupported;
    }
  }, []);

  return webGL ? (
    <Suspense fallback={null}>
      <Canvas />
    </Suspense>
  ) : null;
}

export function HomeHero() {
  return (
    <HeroBox>
      <CanvasContainer />
      <LogoContainer>
        <Logo className="logo" />
        <HeroContent>
          <h1>
            Lightweight <b>Java&nbsp;Game&nbsp;Library&nbsp;3</b>
          </h1>
          <Link to="/#learn-more">
            LEARN MORE
            <br />
            <Icon children={<KeyboardArrowDown />} />
          </Link>
        </HeroContent>
      </LogoContainer>
    </HeroBox>
  );
}
