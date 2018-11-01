import * as React from 'react';
import { Icon, IconProps } from '../Icon';

function KeyboardArrowDown(props: IconProps) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z" />
    </Icon>
  );
}

export default React.memo(KeyboardArrowDown);
