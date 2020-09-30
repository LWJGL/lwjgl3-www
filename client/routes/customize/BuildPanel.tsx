import { Suspense, useState, useEffect, useMemo } from 'react';
import { styled } from '~/theme/stitches.config';
import { useBreakpoint } from '~/components/Breakpoint';
// import { cc, COLOR_PRIMARY, mediaBreakpointDown, mediaBreakpointUp } from '~/theme';
import { COLOR_PRIMARY } from '~/theme';
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
import { Icon } from '~/components/Icon';
import '~/components/icons/fa/regular/times';

import type { BuildDefinition, BuildType } from './types';

type ConnectedProps = {
  anyBuildSelected: boolean;
  isSelected: boolean;
  spec: BuildDefinition;
};

interface Props {
  build: BuildType;
}

const StatusFallback = () => (
  <div className="d-flex align-items-center justify-content-center" style={{ height: 64 }}>
    <div className="spinner-grow" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

export function BuildPanel({ build }: Props) {
  const breakpoint = useBreakpoint();
  const [showStatus, setShowStatus] = useState(false);
  const [slice, dispatch] = useMemoSlice(
    (state): ConnectedProps => ({
      anyBuildSelected: state.build !== null,
      isSelected: state.build === build,
      spec: state.builds.byId[build],
    }),
    (state) => [state.build, build]
  );

  useEffect(() => {
    if (!showStatus) {
      setShowStatus(true);
    }
  }, [showStatus, setShowStatus]);

  return useMemo(() => {
    const { anyBuildSelected, isSelected, spec } = slice;
    const {
      current,
      breakpoints: { lg },
    } = breakpoint;

    return (
      <PanelBox
        build={build}
        selected={isSelected}
        hidden={anyBuildSelected && !isSelected && current < lg}
        onClick={() => dispatch(selectBuildType(build))}
      >
        <PanelTitle>{spec.title}</PanelTitle>
        <PanelDescription>{spec.description}</PanelDescription>
        {showStatus ? (
          <Suspense fallback={<StatusFallback />}>
            <BuildStatus name={build} />
          </Suspense>
        ) : (
          <StatusFallback />
        )}
        {isSelected && current < lg ? <Icon name="fa/regular/times" /> : null}
      </PanelBox>
    );
  }, [dispatch, build, slice, showStatus, breakpoint]);
}

const PanelTitle = styled('h2', {
  fontWeight: 'normal',
});

const PanelDescription = styled('p', {
  color: COLOR_PRIMARY.css(),
  margin: 0,
});

const PanelBox = styled('div', {
  border: `2px solid ${COLOR_PRIMARY.css()}`,
  padding: '1rem',
  borderRadius: BORDER_RADIUS,
  textAlign: 'center',
  cursor: 'pointer',
  willChange: 'transform, background-color',
  userSelect: 'none',
  zIndex: 1,
  ':hover > h2': {
    textDecoration: 'underline',
  },
  lg: {
    transition: 'transform 0.083s ease-out',
  },
  mdDown: {
    margin: '0 1rem 1rem 1rem',
  },
  variants: {
    build: {
      release: {
        backgroundColor: COLOR_RELEASE_LIGHT.css(),
        borderColor: COLOR_RELEASE.css(),
        [`& ${PanelTitle}`]: {
          color: COLOR_RELEASE.css(),
        },
      },
      stable: {
        backgroundColor: COLOR_STABLE_LIGHT.css(),
        borderColor: COLOR_STABLE.css(),
        [`& ${PanelTitle}`]: {
          color: COLOR_STABLE.css(),
        },
      },
      nightly: {
        backgroundColor: COLOR_NIGHTLY_LIGHT.css(),
        borderColor: COLOR_NIGHTLY.css(),
        [`& ${PanelTitle}`]: {
          color: COLOR_NIGHTLY.css(),
        },
      },
    },
    hidden: {
      true: {
        display: 'none',
      },
    },
    selected: {
      true: {
        lg: {
          transform: 'translateY(1.25rem)',
          borderBottom: 0,
          borderRadius: `${BORDER_RADIUS} ${BORDER_RADIUS} 0 0`,
        },
        mdDown: {
          margin: 0,
          display: 'block',
          backgroundColor: 'transparent',
          borderTopColor: 'transparent',
          borderRightColor: 'transparent',
          borderLeftColor: 'transparent',
          borderRadius: 0,
          '.svg-icon': {
            display: 'block',
            color: 'black',
            position: 'absolute',
            top: '0.75rem',
            right: '2rem',
            fontSize: '200%',
            ':hover': {
              color: 'red',
            },
          },
        },
      },
    },
  },
});
