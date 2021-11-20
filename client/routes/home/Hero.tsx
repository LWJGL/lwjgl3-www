import { lazy, Suspense, useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Link } from '~/components/router/client';
import { useMedia } from '~/hooks/useMedia';
import { useViewport } from '~/hooks/useViewport';
import { styled } from '~/theme/stitches.config';
import { resetOpacityTransform } from '~/theme/animations';
import { contextOptions } from './contextOptions';
import { loadJS } from '~/services/loadJS';
import { Icon } from '~/components/ui/Icon';
import '~/theme/icons/fa/regular/chevron-down';

const Canvas = lazy(() => {
  return Promise.all([
    loadJS('https://cdn.jsdelivr.net/npm/three@0.124.0/build/three.min.js'),
    import(/* webpackChunkName: "route-home$canvas" */ './Canvas'),
  ]).then((values) => values[1]);
});

const HeroBox = styled('section', {
  width: '100%',
  mt: '-3rem',
  backgroundImage: `linear-gradient(to top left,
#4cddff,
#3b9aca 10%,
#2d6ca5 20%,
#2a5291 27%,
#283d81 35%,
#222654 50%,
#1e1635 63%,
#0c0010 93%,
#000)`,

  /*
  height: 100vh;
  @supports (-webkit-touch-callout: none) {
    body {
      height: -webkit-fill-available;
    }
  }
*/
});

const LogoContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  position: 'absolute',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1,
  width: '100%',
  height: '100%',
  padding: '1rem 1rem 0 1rem',
  '@media (min-aspect-ratio: 8/2)': {
    justifyContent: 'flex-end',
  },
});

const LogoSvg = styled('svg', {
  transform: 'translateY(3rem)',
  opacity: 0,
  animation: `${resetOpacityTransform} 1s ease forwards`,
  // mb: '$4',
  width: 140,
  '@supports(width: max(140px, min(16vw, 220px)))': {
    width: 'max(140px, min(16vw, 220px))',
  },
  '@supports(width: clamp(140px, 16vw, 220px))': {
    width: 'clamp(140px, 16vw, 220px)',
  },
  '@media (min-aspect-ratio: 8/2)': {
    display: 'none',
  },
});

const Logo = (
  <LogoSvg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 206 182">
    <defs>
      <linearGradient id="face" y1="0" x1="0" x2="100%" y2="0">
        <stop stopColor="#d7d7d7" offset="0" />
        <stop stopColor="#e7e7e7" offset=".5" />
        <stop stopColor="#d7d7d7" offset="1" />
      </linearGradient>
      <linearGradient id="bevel" x1="0" y1="0" x2="0" y2="100%">
        <stop stopColor="#d8d8d8" offset="0" />
        <stop stopColor="#a3a3a3" offset="1" />
      </linearGradient>
      <symbol id="btn-key" viewBox="0 0 60 60">
        <rect x="0" y="0" rx="3" ry="3" width="54" height="58" fill="url(#bevel)" />
        <rect x="2" y="1" rx="3" ry="3" width="50" height="50" strokeWidth="0.25" stroke="#fff" fill="url(#face)" />
      </symbol>
    </defs>
    <use xlinkHref="#btn-key" x="0" y="0" width="60" height="60" />
    <use xlinkHref="#btn-key" x="60" y="0" width="60" height="60" />
    <use xlinkHref="#btn-key" x="120" y="0" width="60" height="60" />
    <rect fill="#3c3cff" opacity="0.25" x="120" y="0" rx="3" ry="3" width="54" height="58" stroke="none" />
    <use xlinkHref="#btn-key" x="22" y="62" width="60" height="60" />
    <use xlinkHref="#btn-key" x="82" y="62" width="60" height="60" />
    <rect fill="#3c3c3c" opacity="0.35" x="82" y="62" rx="3" ry="3" width="54" height="58" stroke="none" />
    <use xlinkHref="#btn-key" x="142" y="62" width="60" height="60" />
    <use xlinkHref="#btn-key" x="32" y="124" width="60" height="60" />
    <rect fill="#3c3c3c" opacity="0.35" x="32" y="124" rx="3" ry="3" width="54" height="58" stroke="none" />
    <use xlinkHref="#btn-key" x="92" y="124" width="60" height="60" />
    <rect fill="#3c3c3c" opacity="0.35" x="92" y="124" rx="3" ry="3" width="54" height="58" stroke="none" />
    <use xlinkHref="#btn-key" x="152" y="124" width="60" height="60" />
    <rect fill="#3c3c3c" opacity="0.35" x="152" y="124" rx="3" ry="3" width="54" height="58" stroke="none" />
    <text x="130" y="43" style={{ font: '900 18px sans-serif' }}>
      3
    </text>
  </LogoSvg>
);

const HeroContent = styled('div', {
  textAlign: 'center',
  padding: '0 1rem',
  color: 'white',
  fontWeight: 300,
  lineHeight: 1.2,
  fontSize: '2rem',
  '@supports(width: max(1.2rem, min(3.5vw, 2.1rem)))': {
    fontSize: 'max(1.2rem, min(3.5vw, 2.1rem))',
  },
  '@supports(width: clamp(1.2rem, 3.5vw, 2.1rem))': {
    fontSize: 'clamp(1.2rem, 3.5vw, 2.1rem)',
  },
  a: {
    color: 'white',
  },
  h1: {
    fontFamily: '$logo',
    fontSize: '4rem',
    // fontWeight: '$thin',
    b: {
      fontWeight: '$bold',
    },
    '@supports(width: max(4rem, min(15vw, 10rem)))': {
      fontSize: 'max(4rem, min(15vw, 10rem))',
    },
    '@supports(clamp(4rem, 15vw, 10rem))': {
      fontSize: 'clamp(4rem, 15vw, 10rem)',
    },
  },
});

enum UseWebGL {
  Unknown,
  Off,
  NotSupported,
  On,
}

// let useWebGL = UseWebGL.Off;
let useWebGL = UseWebGL.Unknown;

const CanvasContainer: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const [renderWebGL, toggleGL] = useState(useWebGL === UseWebGL.On);
  const prefersReducedMotion = useMedia('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    // If we detected WebGL before, the checks below already passed
    if (useWebGL !== UseWebGL.Unknown) {
      return;
    }

    // Skip if user prefers-reduced-motion
    // ! Bah! Disables animation under Windows if user has disabled OS window animations (Chrome)
    if (prefersReducedMotion) {
      useWebGL = UseWebGL.Off;
      return;
    }

    // Check device memory, skip for under 4GB
    //@ts-expect-error
    if ('deviceMemory' in navigator && navigator.deviceMemory < 4) {
      useWebGL = UseWebGL.Off;
      return;
    }

    // Check thread count, skip if probably old/less-capable CPU
    if (navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency < 4) {
      useWebGL = UseWebGL.Off;
      return;
    }

    // Check connection quality
    if ('connection' in navigator) {
      // Skip for slow connections
      //@ts-expect-error
      switch (navigator.connection.effectiveType) {
        case 'slow-2g':
        case '2g':
          // ! Connection status may change, do not change supportsWebGL flag
          return;
      }

      // Skip if user opted-in into a reduced data usage mode
      //@ts-expect-error
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
      toggleGL(true);
    } else {
      useWebGL = UseWebGL.NotSupported;
    }
  }, [prefersReducedMotion]);

  return renderWebGL ? (
    <ErrorBoundary fallback={null}>
      <Suspense fallback={null}>
        <Canvas width={width} height={height} />
      </Suspense>
    </ErrorBoundary>
  ) : null;
};

export function HomeHero() {
  const { width, height } = useViewport();

  return (
    <HeroBox style={{ height }}>
      <CanvasContainer width={width} height={height} />
      <LogoContainer>
        {Logo}
        <HeroContent>
          <h1>
            LW<b>JGL</b>
          </h1>
          <Link to="/#learn-more">
            Lightweight Java Game Library
            <br />
            <Icon display="block" name="fa/regular/chevron-down" />
          </Link>
        </HeroContent>
      </LogoContainer>
    </HeroBox>
  );
}
