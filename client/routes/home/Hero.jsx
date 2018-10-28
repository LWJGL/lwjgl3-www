// @flow
// @jsx jsx
import * as React from 'react';
//$FlowFixMe
import { lazy, Suspense } from 'react';
import { jsx, css } from '@emotion/core';
import { Link } from '@reach/router';
import IconKeyboardArrowDown from '~/components/icons/md/KeyboardArrowDown';
import { Logo } from './Logo';

const Canvas = lazy(() => import(/* webpackChunkName: "home$canvas" */ './Canvas'));

const HeroBox = ({ children }) => (
  <section
    css={css`
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
    `}
  >
    {children}
  </section>
);

const LogoContainer = ({ children }) => (
  <div
    className="d-flex flex-column justify-content-center align-items-center"
    css={css`
      position: absolute;
      z-index: 1;
      width: 100%;
      height: 100vh;

      .logo {
        display: block;
        max-width: 700px;
        margin: 2rem;
        transform: translateY(2rem);
        opacity: 0;
        animation: present-yourself 1s ease forwards;
        @media (max-height: 420px) {
          max-width: 75%;
        }
      }
    `}
  >
    {children}
  </div>
);

const HeroContent = ({ children }) => (
  <div
    css={css`
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
    `}
  >
    {children}
  </div>
);

type Props = {||};
type State = { supportsWebGL: boolean };

export class HomeHero extends React.Component<Props, State> {
  static supportsWebGL: boolean = false;

  state = {
    supportsWebGL: HomeHero.supportsWebGL,
  };

  componentDidMount() {
    // Skip if user prefers-reduced-motion
    const preferesReducedMotion = window.matchMedia('(prefers-reduced-motion)').matches;
    if (preferesReducedMotion) {
      return;
    }

    // Check device memory, skip for under 4GB
    if (navigator.deviceMemory !== undefined && navigator.deviceMemory < 4) {
      return;
    }

    // Check thread count, skip if probably old/less-capable CPU
    if (navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency < 4) {
      return;
    }

    // Check connection quality
    // * We check supportsWebGL first because that means connection dropped after we have already loaded threejs
    if (!this.state.supportsWebGL && navigator.connection !== undefined) {
      // Skip for slow connections
      switch (navigator.connection.effectiveType) {
        case 'slow-2g':
        case '2g':
          return;
      }

      // Skip if user opted-in into a reduced data usage mode
      if (navigator.connection.saveData === true) {
        return;
      }
    }

    // detect WebGL support
    const cnv = document.createElement('canvas');
    if (cnv.getContext('webgl') != null || cnv.getContext('experimental-webgl') != null) {
      HomeHero.supportsWebGL = true;
      this.setState({ supportsWebGL: true });
    }
  }

  render() {
    return (
      <HeroBox>
        {this.state.supportsWebGL ? (
          <Suspense maxDuration={0} fallback={null}>
            <Canvas />
          </Suspense>
        ) : null}
        <LogoContainer>
          <Logo className="logo" />
          <HeroContent>
            <h1>
              Lightweight <b>Java&nbsp;Game&nbsp;Library&nbsp;3</b>
            </h1>
            <Link to="/#learn-more">
              LEARN MORE
              <br />
              <IconKeyboardArrowDown />
            </Link>
          </HeroContent>
        </LogoContainer>
      </HeroBox>
    );
  }
}
