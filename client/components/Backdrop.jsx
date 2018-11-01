// @flow
import * as React from 'react';
//$FlowFixMe
import { memo, useState, useEffect } from 'react';
import { cc } from '~/theme';

type Props = {
  className?: string,
};

export const Backdrop = React.memo(({ className }: Props) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => void setMounted(true), []);
  return <div className={cc('overlay-backdrop', className, { open: mounted })} />;
});
