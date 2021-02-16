import { CSS } from './stitches.config';

interface ReusableStyles {
  [variant: string]: CSS;
}

// Common re-usable styles

export const wrap: ReusableStyles = {
  normal: {
    overflowWrap: 'normal',
    wordBreak: 'normal',
  },
  word: {
    overflowWrap: 'break-word',
  },
  all: {
    wordBreak: 'break-all',
  },
  truncate: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
};
