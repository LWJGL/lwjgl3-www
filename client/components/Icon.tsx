import { css, cx } from '@emotion/css';
import type { IconName } from './icons/types';

// Based on https://blog.prototypr.io/align-svg-icons-to-text-and-say-goodbye-to-font-icons-d44b3d7b26b4#.58pqpyl6w
const cssSvgIcon = css`
  display: inline-flex;
  align-self: center;
  height: 1em;
  width: 1em;
  svg {
    height: 1em;
    width: 1em;
    bottom: -0.125em;
    position: absolute;
    fill: currentColor;
  }
`;

type Props = React.HTMLAttributes<HTMLSpanElement> & { name: IconName };

export const Icon: React.FC<Props> = ({ name, className, ...props }) => {
  return (
    <span className={cx('svg-icon', cssSvgIcon, className)} {...props}>
      <svg focusable={false} aria-hidden={true} preserveAspectRatio="xMidYMid meet">
        <use href={`#${name}`} />
      </svg>
    </span>
  );
};
