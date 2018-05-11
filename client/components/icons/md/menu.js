// @flow
import * as React from 'react';
import { Icon, type Props } from '~/components/icons/Icon';

export default function Menu(props: Props) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
    </Icon>
  );
}
