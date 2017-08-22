// @flow
import * as React from 'react';
import { Link } from 'react-router-dom';
import IconArrowDown from 'react-icons/md/keyboard-arrow-down';
import Logo from './Logo';
import Canvas from './Canvas';
import styled from 'styled-components';

const HeroBox = styled.section`
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

const LogoContainer = styled.div`
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100vh;

  .logo {
    display: block;
    max-width: 700px;
    margin: 2rem;
    @media (max-height: 420px) {
      max-width: 75%;
    }
  }
`;

const HeroContent = styled.div`
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

const Hero = () =>
  <HeroBox>
    <Canvas />
    <LogoContainer className="d-flex flex-column justify-content-center align-items-center">
      <Logo className="logo" />
      <HeroContent>
        <h1>Lightweight Java&nbsp;Game&nbsp;Library&nbsp;3</h1>
        <Link to="/#learn-more">
          LEARN MORE<br />
          <IconArrowDown />
        </Link>
      </HeroContent>
    </LogoContainer>
  </HeroBox>;

export default Hero;
