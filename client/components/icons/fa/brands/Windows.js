// @flow
import * as React from 'react';
import { Icon, type Props } from '~/components/icons/Icon';

export default function Windows(props: Props) {
  return (
    <Icon viewBox="0 0 448 512" {...props}>
      <path d="M0 93.7l183.6-25.3v177.4H0V93.7zm0 324.6l183.6 25.3V268.4H0v149.9zm203.8 28L448 480V268.4H203.8v177.9zm0-380.6v180.1H448V32L203.8 65.7z" />
    </Icon>
  );
}