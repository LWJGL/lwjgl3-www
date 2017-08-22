// @flow
import * as React from 'react';
import { connect } from 'react-redux';
// import { connect } from '~/services/connect';
import supportsPassive from '~/services/supports-passive';
import styled from 'styled-components';
import { mediaBreakpointUp, COLOR_PRIMARY } from '~/theme';
import type { BUILD_TYPES } from '../types';

import {
  COLOR_RELEASE,
  COLOR_RELEASE_LIGHT,
  COLOR_STABLE,
  COLOR_STABLE_LIGHT,
  COLOR_NIGHTLY,
  COLOR_NIGHTLY_LIGHT,
  SMALL_FONT_SIZE,
  BORDER_RADIUS,
} from '../theme';

const ConfigPanel = styled.div`
  position: relative;
  z-index: 0;

  ${mediaBreakpointUp('lg')} {
    &.release {
      background-color: ${COLOR_RELEASE_LIGHT};
      border-color: ${COLOR_RELEASE};
    }
    &.stable {
      background-color: ${COLOR_STABLE_LIGHT};
      border-color: ${COLOR_STABLE};
    }
    &.nightly {
      background-color: ${COLOR_NIGHTLY_LIGHT};
      border-color: ${COLOR_NIGHTLY};
    }

    margin-top: 1rem;
    border-width: 2px;
    border-style: solid;
    padding: 1rem;
  }

  p {
    line-height: 1.5rem;
  }

  .artifact {
    margin-bottom: 1.25rem;

    a {
      word-wrap: break-word;
    }

    svg {
      margin-right: .5rem;
    }

    p {
      margin-left: 1.5rem;
      margin-bottom: .25rem;
      font-size: ${SMALL_FONT_SIZE};
    }
  }

  pre {
    background-color: #ffffe6;
    font-size: 13px;
    line-height: 1rem;
    padding: .5rem;
    tab-size: 4;
  }

  .download-toolbar {
    background: ${COLOR_PRIMARY.l(COLOR_PRIMARY.lightness + 5)};
    margin: 1rem -1rem -1rem -1rem;
    padding: 1rem 0;
    text-align: center;
    .btn + .btn {
      margin-left: .5rem;
    }

    &.file {
      .custom-file {
        height: auto;
        margin-right: 1rem;
        text-align: left !important;
      }
    }
  }

  &.stick {
    padding-bottom: 66px;

    .download-toolbar {
      position: fixed;
      bottom: 0;
      left: 50%;
      width: 1110px;
      margin: 0;
      margin-left: -555px;

      ${mediaBreakpointUp('lg')} {
        left: 50%;
        width: 930px;
        margin-left: -465px;
      }
      ${mediaBreakpointUp('xl')} {
        width: 1110px;
        margin-left: -555px;
      }
    }
  }
`;

type Props = {
  build: BUILD_TYPES,
  children?: React.Node,
};

class BuildConfigArea extends React.Component<Props> {
  ticking: boolean = false;
  forceUpd: boolean = false;
  container: ?HTMLDivElement;

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll, supportsPassive ? { passive: true } : false);
    window.addEventListener('resize', this.onScroll, supportsPassive ? { passive: true } : false);
    this.update();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll, supportsPassive ? { passive: true } : false);
    window.removeEventListener('resize', this.onScroll, supportsPassive ? { passive: true } : false);
  }

  componentWillUpdate() {
    this.forceUpd = true;
  }

  componentDidUpdate() {
    if (this.forceUpd) {
      requestAnimationFrame(this.update);
    }
  }

  onScroll = () => {
    if (!this.ticking) {
      requestAnimationFrame(this.update);
      this.ticking = true;
    }
  };

  update = () => {
    this.ticking = false;
    if (this.container != null) {
      const rect = this.container.getBoundingClientRect();
      /*::
      if (this.container == null) {
        return;
      }
      */
      if (rect.top + rect.height > window.innerHeight) {
        this.container.classList.add('stick');
      } else {
        this.container.classList.remove('stick');
      }
    }
  };

  getRef = (el: ?HTMLDivElement) => {
    this.container = el;
  };

  render() {
    return (
      <ConfigPanel innerRef={this.getRef} className={this.props.build}>
        {this.props.children}
      </ConfigPanel>
    );
  }
}

export default connect(state => ({
  build: state.build.build,
}))(BuildConfigArea);
