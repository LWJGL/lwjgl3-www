// @flow
import * as React from 'react';
//$FlowFixMe
import { memo } from 'react';
import { Icon, type Props } from '../Icon';

function FileDownload(props: Props) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
    </Icon>
  );
}

export default memo(FileDownload);
