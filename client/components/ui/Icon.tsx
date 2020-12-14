import { styled } from '~/theme/stitches.config';
import type { IconName } from '~/theme/icons/types';

// Based on https://blog.prototypr.io/align-svg-icons-to-text-and-say-goodbye-to-font-icons-d44b3d7b26b4#.58pqpyl6w
const IconSpan = styled('div', {
  display: 'inline-flex',
  alignSelf: 'center',
  // height: '1em',
  // width: '1em',
  // position: 'relative',
  svg: {
    height: '1em',
    width: '1em',
  },
  variants: {
    display: {
      inline: {
        svg: {
          // display: 'inline',
          // bottom: '-0.125em',
          // top: '.05em',
          top: '.125em',
          position: 'relative',
        },
      },
      block: {},
    },
  },
});

//@ts-expect-error
IconSpan.defaultProps = {
  display: 'inline',
};

type Props = React.ComponentProps<typeof IconSpan> & { name: IconName };

export const Icon: React.FC<Props> = ({ name, ...props }) => {
  return (
    <IconSpan {...props}>
      <svg focusable={false} aria-hidden={true} preserveAspectRatio="xMidYMid meet">
        <use href={`#${name}`} />
      </svg>
    </IconSpan>
  );
};
