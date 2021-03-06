import { styled } from '~/theme/stitches.config';
import type { IconName } from '~/theme/icons/types';

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  name: IconName;
}

// ! use `xlink:href` because `href` is not supported in Safari 11 and lower
const IconSpan: React.FC<Props> = ({ name, ...props }) => (
  <span aria-hidden={true} {...props}>
    <svg focusable={false} preserveAspectRatio="xMidYMid meet">
      <use xlinkHref={`#${name}`} />
    </svg>
  </span>
);

// Based on https://blog.prototypr.io/align-svg-icons-to-text-and-say-goodbye-to-font-icons-d44b3d7b26b4#.58pqpyl6w
export const Icon = styled(IconSpan, {
  display: 'inline-flex',
  alignSelf: 'center',
  // height: '1em',
  // width: '1em',
  // position: 'relative',
  svg: {
    square: '1em',
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
  defaultVariants: {
    display: 'inline',
  },
});
