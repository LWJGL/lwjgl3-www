import { Suspense, useMemo } from 'react';
import { styled } from '~/theme/stitches.config';
import { useRecoilValue } from 'recoil';
import { breakpoint, Breakpoint } from '~/theme/breakpoints';
import { useMemoSlice } from './Store';
import { selectBuildType } from './actions';
import { BuildStatus } from './BuildStatus';
import { Button } from '~/components/forms/Button';
import { Icon } from '~/components/ui/Icon';
import { Text } from '~/components/ui/Text';
import { LoadingPulse } from '~/components/ui/LoadingPulse';
import '~/theme/icons/fa/regular/times';

import type { BuildDefinition, BuildType } from './types';

type ConnectedProps = {
  anyBuildSelected: boolean;
  isSelected: boolean;
  spec: BuildDefinition;
};

interface Props {
  build: BuildType;
}

export function BuildPanel({ build }: Props) {
  const currentBreakpoint = useRecoilValue(breakpoint);
  const [slice, dispatch] = useMemoSlice(
    (state): ConnectedProps => ({
      anyBuildSelected: state.build !== null,
      isSelected: state.build === build,
      spec: state.builds.byId[build],
    }),
    (state) => [state.build, build]
  );

  return useMemo(() => {
    const { anyBuildSelected, isSelected, spec } = slice;

    return (
      <PanelBox
        build={build}
        selected={isSelected}
        hidden={anyBuildSelected && !isSelected && currentBreakpoint < Breakpoint.lg}
        onClick={() => dispatch(selectBuildType(build))}
      >
        <Text as="h2">{spec.title}</Text>
        <Text>{spec.description}</Text>
        <Suspense fallback={<LoadingPulse size="lg" />}>
          <BuildStatus name={build} />
        </Suspense>
        {isSelected && currentBreakpoint < Breakpoint.lg ? (
          <Button rounding="icon" variant="text" tone="neutral" title="Close" aria-label="Close">
            <Icon name="fa/regular/times" />
          </Button>
        ) : null}
      </PanelBox>
    );
  }, [dispatch, build, slice, currentBreakpoint]);
}

const PanelBox = styled('div', {
  backgroundColor: '$primary100',
  borderRadius: '$md',
  padding: '1rem',
  textAlign: 'center',
  cursor: 'pointer',
  willChange: 'transform, background-color',
  userSelect: 'none',
  zIndex: 1,
  border: `2px solid $dark`,
  dark: {
    borderColor: '$darker',
  },

  lg: {
    transition: 'transform, filter 0.083s ease-out',
  },
  // 'md-down': {
  //   margin: '0 1rem 1rem 1rem',
  // },
  variants: {
    build: {
      release: {
        h2: {
          color: '$positive700',
        },
      },
      stable: {
        h2: {
          color: '$caution700',
        },
      },
      nightly: {
        h2: {
          color: '$critical700',
        },
      },
    },
    hidden: {
      true: {
        display: 'none',
      },
    },
    selected: {
      false: {
        '&:active': {
          filter: 'brightness(.9)',
          transform: 'translateY(2px)',
        },
      },
      true: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        lg: {
          transform: 'translateY(calc(1.5rem + 2px))',
          borderBottom: 'none',
        },
        'lg-down': {
          margin: '0 -$gutter',
          // display: 'block',
          backgroundColor: 'transparent',
          borderTop: 'none',
          borderLeft: 'none',
          borderRight: 'none',

          button: {
            //   display: 'block',
            //   color: 'black',
            position: 'absolute',
            top: 0,
            right: '$sm',
            fontSize: '1.5rem',
            //   ':hover': {
            //     color: 'red',
            //   },
          },
        },
      },
    },
  },
});
