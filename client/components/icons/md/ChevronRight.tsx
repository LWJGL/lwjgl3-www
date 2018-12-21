import React from 'react';
import { Icon, IconProps } from '../Icon';

function ChevronRight(props: IconProps) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
    </Icon>
  );
}

export default React.memo(ChevronRight);
