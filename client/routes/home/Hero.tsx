import { lazy, Suspense, useState, useEffect } from 'react';
import { css } from '@emotion/css';
import { Link } from 'react-router-dom';
import { Icon, KeyboardArrowDown } from '~/components/icons';
import { contextOptions } from './contextOptions';
import { loadJS } from '~/services/loadJS';

// Brands
const Logo = require('../../../assets/logo/logo.svg').default as React.FC<React.SVGProps<'svg'>>;

const Canvas = lazy(() =>
  Promise.all([
    import(/* webpackChunkName: "route-home$canvas" */ './Canvas'),
    loadJS('https://unpkg.com/three@0.115.0/build/three.min.js'),
  ]).then((values) => values[0])
);

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

const HeroBox: React.FC = (props) => <section className={CssHeroBox}>{props.children}</section>;

const CssLogoContainer = css`
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100vh;
  align-items: center;
  justify-content: center;
  padding: 1rem;

  @media (max-height: 420px) {
    justify-content: flex-end;
  }

  .logo {
    transform: translateY(3rem);
    opacity: 0;
    animation: anim-reset-opacity-transform 1s ease forwards;
    width: 140px;
    margin-bottom: 1rem;
    @media (max-width: 600px) {
      max-width: 50%;
    }
    @media (max-height: 420px) {
      max-width: 50%;
    }
  }
`;

const LogoContainer: React.FC = (props) => (
  <div className={`d-flex flex-column ${CssLogoContainer}`}>{props.children}</div>
);

const CssHeroContent = css`
  text-align: center;
  padding: 0 1rem;
  color: white;
  font-size: 2rem;
  line-height: 1em;
  font-weight: 300;

  .svg-icon {
    font-size: 1.5em;
  }

  a {
    color: white;
  }

  h1 {
    font-size: 2em;
    line-height: 1.25em;
  }

  @media (max-width: 600px) {
    font-size: 1.5rem;
    line-height: 1.25em;
  }

  @media (max-width: 400px), (max-height: 420px) {
    font-size: 1rem;
    line-height: 1.5em;
  }
`;

const HeroContent: React.FC = (props) => <div className={CssHeroContent}>{props.children}</div>;

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
            LW<b>JGL</b>
          </h1>
          <Link to="/#learn-more">
            Lightweight Java Game Library
            <br />
            <Icon children={<KeyboardArrowDown />} />
          </Link>
        </HeroContent>
      </LogoContainer>
    </HeroBox>
  );
}
