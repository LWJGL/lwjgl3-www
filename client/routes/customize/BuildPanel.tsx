import React, { Suspense, useState, useEffect, useMemo } from 'react';
import { css } from '@emotion/core';
import { useBreakpoint } from '~/components/Breakpoint';
import { Icon, Close } from '~/components/icons';
import { cc, COLOR_PRIMARY, mediaBreakpointDown, mediaBreakpointUp } from '~/theme';
import { useMemoSlice } from './Store';
import { selectBuildType } from './actions';
import { BuildStatus } from './BuildStatus';
import {
  BORDER_RADIUS,
  COLOR_NIGHTLY,
  COLOR_NIGHTLY_LIGHT,
  COLOR_RELEASE,
  COLOR_RELEASE_LIGHT,
  COLOR_STABLE,
  COLOR_STABLE_LIGHT,
} from './theme';
import { BuildDefinition, BuildType } from './types';

type ConnectedProps = {
  buildSelected: boolean;
  isSelected: boolean;
  spec: BuildDefinition;
};

interface Props {
  build: BuildType;
}

const StatusFallback = () => (
  <div className="d-flex align-items-center justify-content-center" style={{ height: 64 }}>
    <div className="spinner-grow" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  </div>
);

export function BuildPanel({ build }: Props) {
  const breakpoint = useBreakpoint();
  const [showStatus, setShowStatus] = useState(false);
  const [slice, dispatch] = useMemoSlice(
    (state): ConnectedProps => ({
      buildSelected: state.build !== null,
      isSelected: state.build === build,
      spec: state.builds.byId[build],
    }),
    state => [state.build, build]
  );

  useEffect(() => {
    if (!showStatus) {
      setShowStatus(true);
    }
  }, []);

  return useMemo(() => {
    const { buildSelected, isSelected, spec } = slice;
    const {
      current,
      breakpoints: { lg },
    } = breakpoint;

    return (
      <div
        onClick={() => dispatch(selectBuildType(build))}
        css={PanelBox}
        className={cc(build, {
          selected: isSelected,
          active: buildSelected && current < lg,
        })}
      >
        <h2>{spec.title}</h2>
        <p>{spec.description}</p>
        {showStatus ? (
          <Suspense fallback={<StatusFallback />}>
            <BuildStatus name={build} />
          </Suspense>
        ) : (
          <StatusFallback />
        )}
        {isSelected ? <Icon children={<Close />} /> : null}
      </div>
    );
  }, [slice, showStatus, breakpoint]);
}

const PanelBox = css`
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
