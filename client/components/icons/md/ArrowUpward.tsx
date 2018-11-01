import * as React from 'react';
import { Icon, IconProps } from '../Icon';

function ArrowUpward(props: IconProps) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" />
    </Icon>
  );
}

export default React.memo(ArrowUpward);
