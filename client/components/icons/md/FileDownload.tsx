import * as React from 'react';
import { Icon, IconProps } from '../Icon';

function FileDownload(props: IconProps) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
    </Icon>
  );
}

export default React.memo(FileDownload);
