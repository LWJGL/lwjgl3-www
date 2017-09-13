// @flow
import * as React from 'react';
import BuildStatus from './BuildStatus';
import wrap from 'classwrap';

import { connect } from 'react-redux';
// import { connect } from '~/services/connect';
import { changeType } from '../reducer';

import type { BUILD_TYPES, Build } from '../types';

import IconClose from 'react-icons/md/close';
import styled from 'emotion/react';
import { mediaBreakpointDown, mediaBreakpointUp, COLOR_PRIMARY } from '~/theme';
import {
  COLOR_RELEASE,
  COLOR_RELEASE_LIGHT,
  COLOR_STABLE,
  COLOR_STABLE_LIGHT,
  COLOR_NIGHTLY,
  COLOR_NIGHTLY_LIGHT,
  BORDER_RADIUS,
} from '../theme';

const BuildBox = styled.div`
  border: 2px solid ${COLOR_PRIMARY.toString()};
  padding: 1rem;
  border-radius: ${BORDER_RADIUS};
  text-align: center;
  cursor: pointer;
  will-change: transform, background-color;
  user-select: none;
  position: relative;
  z-index: 1;

  & > h2 {
    font-weight: normal;
  }

  & > p {
    color: ${COLOR_PRIMARY.toString()};
    margin: 0;
  }

  &.release {
    background-color: ${COLOR_RELEASE_LIGHT.toString()};
    border-color: ${COLOR_RELEASE.toString()};
    color: ${COLOR_RELEASE.toString()};
  }
  &.stable {
    background-color: ${COLOR_STABLE_LIGHT.toString()};
    border-color: ${COLOR_STABLE.toString()};
    color: ${COLOR_STABLE.toString()};
  }
  &.nightly {
    background-color: ${COLOR_NIGHTLY_LIGHT.toString()};
    border-color: ${COLOR_NIGHTLY.toString()};
    color: ${COLOR_NIGHTLY.toString()};
  }

  &:hover {
    > h2 {
      text-decoration: underline;
    }
  }

  & .svg-icon {
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
  isSelected: boolean,
  isActive: boolean,
  spec: Build,
  changeType: typeof changeType,
};

class BuildType extends React.Component<Props> {
  select = () => {
    const { isSelected, build, changeType } = this.props;
    changeType(isSelected ? null : build);
  };

  render() {
    const { isSelected, isActive, build, spec } = this.props;

    return (
      <BuildBox
        onClick={this.select}
        className={wrap({
          [build]: true,
          selected: isSelected,
          active: isActive,
        })}
      >
        <h2>{spec.title}</h2>
        <p>{spec.description}</p>
        <BuildStatus name={spec.id} />
        {isSelected ? <IconClose /> : null}
      </BuildBox>
    );
  }
}

export default connect(
  (state, ownProps) => ({
    isSelected: state.build.build === ownProps.build,
    isActive: state.breakpoint.current < state.breakpoint.lg && state.build.build !== null,
    spec: state.build.builds.byId[ownProps.build],
  }),
  {
    changeType,
  }
)(BuildType);
