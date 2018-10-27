// @flow
import * as React from 'react';
//$FlowFixMe
import { memo } from 'react';
import { Icon, type Props } from '../Icon';

function KeyboardArrowDown(props: Props) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z" />
    </Icon>
  );
}

export default memo(KeyboardArrowDown);
