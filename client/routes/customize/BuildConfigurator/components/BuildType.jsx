// @flow
// @jsx jsx
import * as React from 'react';
import jsx from '@emotion/jsx';
import css from '@emotion/css';

import { BuildStatus } from './BuildStatus';
import { changeType, loadStatus } from '../reducer';
import { Connect } from '~/store/Connect';
import type { BUILD_TYPES, Build } from '../types';

import { MdClose } from '~/components/icons/md/close';
import { cc, mediaBreakpointDown, mediaBreakpointUp, COLOR_PRIMARY } from '~/theme';
import { Breakpoint } from '~/components/Breakpoint';
import {
  COLOR_RELEASE,
  COLOR_RELEASE_LIGHT,
  COLOR_STABLE,
  COLOR_STABLE_LIGHT,
  COLOR_NIGHTLY,
  COLOR_NIGHTLY_LIGHT,
  BORDER_RADIUS,
} from '../theme';

const BuildBox = css`
  border: 2px solid ${COLOR_PRIMARY.css()};
  padding: 1rem;
  border-radius: ${BORDER_RADIUS};
  text-align: center;
  cursor: pointer;
  will-change: transform, background-color;
  user-select: none;
  position: relative;
  z-index: 1;

  > h2 {
    font-weight: normal;
  }

  > p {
    color: ${COLOR_PRIMARY.css()};
    margin: 0;
  }

  &.release {
    background-color: ${COLOR_RELEASE_LIGHT.css()};
    border-color: ${COLOR_RELEASE.css()};
    color: ${COLOR_RELEASE.css()};
  }
  &.stable {
    background-color: ${COLOR_STABLE_LIGHT.css()};
    border-color: ${COLOR_STABLE.css()};
    color: ${COLOR_STABLE.css()};
  }
  &.nightly {
    background-color: ${COLOR_NIGHTLY_LIGHT.css()};
    border-color: ${COLOR_NIGHTLY.css()};
    color: ${COLOR_NIGHTLY.css()};
  }

  &:hover {
    > h2 {
      text-decoration: underline;
    }
  }

  .svg-icon {
    display: none;
  }

  ${mediaBreakpointDown('md')} {
    margin: 0 1rem 1rem 1rem;
    &.active {
      display: none;
    }
    &.selected {
      margin: 0;
      display: block;
      background-color: transparent;
      border-top-color: transparent;
      border-right-color: transparent;
      border-left-color: transparent;
      border-radius: 0 !important;
    }
    .svg-icon {
      color: black;
      display: block;
      position: absolute;
      top: 0.75rem;
      right: 2rem;
      font-size: 200%;
      &:hover {
        color: red;
      }
    }
  }

  ${mediaBreakpointUp('lg')} {
    transition: transform 0.083s ease-out;
    &.selected {
      transform: translateY(1.25rem);
      border-bottom: 0;
      border-radius: ${BORDER_RADIUS} ${BORDER_RADIUS} 0 0;
    }
  }
`;

type Props = {
  build: BUILD_TYPES,
};

type ConnectedProps = {
  isSelected: boolean,
  isActive: boolean,
  spec: Build,
};

export class BuildType extends React.PureComponent<Props> {
  render() {
    const { build } = this.props;

    return (
      <Breakpoint>
        {({ current, breakpoints: { lg } }) => (
          <Connect
            state={(state): ConnectedProps => ({
              isSelected: state.build.build === build,
              isActive: current < lg && state.build.build !== null,
              spec: state.build.builds.byId[build],
              status: state.build.builds.byId[build].status,
            })}
            actions={{ changeType, loadStatus }}
          >
            {({ isSelected, isActive, status, spec }, { changeType, loadStatus }) => (
              <div
                onClick={changeType.bind(this, build)}
                css={BuildBox}
                className={cc(build, {
                  selected: isSelected,
                  active: isActive,
                })}
              >
                <h2>{spec.title}</h2>
                <p>{spec.description}</p>
                <BuildStatus name={spec.id} status={status} loadStatus={loadStatus} />
                {isSelected ? <MdClose /> : null}
              </div>
            )}
          </Connect>
        )}
      </Breakpoint>
    );
  }
}
