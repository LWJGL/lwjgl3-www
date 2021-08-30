import { Suspense, useCallback } from 'react';
import { styled } from '~/theme/stitches.config';
import { useBreakpoint, Breakpoint } from '~/app/context/Breakpoint';
import { useSelector, useDispatch } from './Store';
import { createActionBuiltTypeSelect, selectorBuild, selectorBuilds } from './reducer';
import { BuildStatus } from './BuildStatus';
import { Button } from '~/components/forms/Button';
import { Icon } from '~/components/ui/Icon';
import { Text, Heading } from '~/components/ui/Text';
import { LoadingPulse } from '~/components/ui/LoadingPulse';
import '~/theme/icons/fa/regular/times';

import type { BuildType } from './types';

interface Props {
  build: BuildType;
}

export const BuildPanel: React.FC<Props> = ({ build }) => {
  const currentBreakpoint = useBreakpoint();
  const dispatch = useDispatch();

  const onPanelClick = useCallback(() => {
    dispatch(createActionBuiltTypeSelect(build));
  }, [dispatch, build]);

  const selectedBuild = useSelector(selectorBuild);
  const { byId } = useSelector(selectorBuilds);

  const isSelected = selectedBuild === build;
  const spec = byId[build];

  return (
    <PanelBox
      build={build}
      selected={isSelected}
      hidden={selectedBuild !== null && !isSelected && currentBreakpoint < Breakpoint.lg}
      onClick={onPanelClick}
    >
      <Heading level={2}>{spec.title}</Heading>
      <Text css={{ fontFamily: '$serif', fontStyle: 'italic' }}>{spec.description}</Text>
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
};

const PanelBox = styled('div', {
  backgroundColor: '$accent3',
  borderRadius: '$md',
  padding: '1rem',
  textAlign: 'center',
  cursor: 'pointer',
  willChange: 'transform, background-color',
  userSelect: 'none',
  zIndex: 1,
  border: `2px solid $accent12`,
  '.dark &': {
    borderColor: '$accent1',
  },

  '@lg': {
    transition: 'transform, filter 0.083s ease-out',
  },
  // '@md-down': {
  //   margin: '0 1rem 1rem 1rem',
  // },

  variants: {
    build: {
      release: {
        h2: {
          color: '$accent11',
        },
      },
      nightly: {
        h2: {
          color: '$caution11',
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
        '@lg': {
          transform: 'translateY(calc(1.5rem + 2px))',
          borderBottom: 'none',
        },
        '@lg-down': {
          // display: 'block',
          margin: '0 calc($gutter * -1)',
          backgroundColor: 'transparent',
          borderTop: 'none',
          borderLeft: 'none',
          borderRight: 'none',

          button: {
            position: 'absolute',
            top: 0,
            right: '$sm',
            fontSize: '1.5rem',
          },
        },
      },
    },
  },
});
