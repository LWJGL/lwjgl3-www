import { styled } from '~/theme/stitches.config';
import { cc } from '~/theme/cc';
import type { IconName } from './icons/types';

// Based on https://blog.prototypr.io/align-svg-icons-to-text-and-say-goodbye-to-font-icons-d44b3d7b26b4#.58pqpyl6w
const IconSpan = styled('span', {
  display: 'inline-flex',
  alignSelf: 'center',
  height: '1em',
  width: '1em',
  svg: {
    height: '1em',
    width: '1em',
    bottom: '-0.125em',
    position: 'absolute',
  },
});

type Props = React.HTMLAttributes<HTMLSpanElement> & { name: IconName };

export const Icon: React.FC<Props> = ({ name, className, ...props }) => {
  return (
    <IconSpan className={cc('svg-icon', className)} {...props}>
      <svg focusable={false} aria-hidden={true} preserveAspectRatio="xMidYMid meet">
        <use href={`#${name}`} />
      </svg>
    </IconSpan>
  );
};
