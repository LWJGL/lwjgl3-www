import { useMemo } from 'react';
import { styled } from '~/theme/stitches.config';
import { COLOR_PRIMARY } from '~/theme';
import { lighten } from '~/theme/color';
import { useSlice } from './Store';

import {
  COLOR_RELEASE,
  COLOR_RELEASE_LIGHT,
  COLOR_STABLE,
  COLOR_STABLE_LIGHT,
  COLOR_NIGHTLY,
  COLOR_NIGHTLY_LIGHT,
  SMALL_FONT_SIZE,
} from './theme';

export const BuildConfigArea: React.FC = ({ children }) => {
  const [slice] = useSlice((state) => ({
    build: state.build,
  }));

  return useMemo(() => (slice.build !== null ? <ConfigPanel build={slice.build}>{children}</ConfigPanel> : null), [
    slice.build,
    children,
  ]);
};

const ConfigPanel = styled('div', {
  zIndex: 0,
  marginBottom: 66,
  padding: '0 1rem 1rem 1rem',
  p: {
    lineHeight: '1.5rem',
  },
  '.artifact': {
    marginBottom: '1.25rem',
    a: {
      wordWrap: 'break-word',
    },
    svg: {
      marginRight: '0.5rem',
    },
    p: {
      marginLeft: '1.5rem',
      marginBottom: '0.25rem',
      fontSize: SMALL_FONT_SIZE,
    },
  },
  pre: {
    backgroundColor: '#ffffe6',
    fontSize: '13px',
    lineHeight: '1rem',
    padding: '0.5rem',
    tabSize: 4,
  },
  '.download-toolbar': {
    background: lighten(COLOR_PRIMARY, 15).css(),
    padding: '1rem 0',
    textAlign: 'center',
    position: 'fixed',
    left: 0,
    bottom: 0,
    width: '100%',
    '.container': {
      textAlign: 'left',
    },
    '.btn + .btn': {
      marginLeft: '0.5rem',
    },
  },
  lg: {
    marginTop: '1rem',
    borderWidth: 2,
    borderStyle: 'solid',
  },
  variants: {
    build: {
      release: {
        lg: {
          backgroundColor: COLOR_RELEASE_LIGHT.css(),
          borderColor: COLOR_RELEASE.css(),
        },
      },
      stable: {
        lg: {
          backgroundColor: COLOR_STABLE_LIGHT.css(),
          borderColor: COLOR_STABLE.css(),
        },
      },
      nightly: {
        lg: {
          backgroundColor: COLOR_NIGHTLY_LIGHT.css(),
          borderColor: COLOR_NIGHTLY.css(),
        },
      },
    },
  },
});
