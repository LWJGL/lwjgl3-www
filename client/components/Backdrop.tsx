import React, { memo, useState, useEffect } from 'react';
import { cc } from '~/theme';

interface Props {
  className?: string;
}

export const Backdrop = memo(({ className }: Props) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => void setMounted(true), []);
  return <div className={cc('overlay-backdrop', className, { open: mounted })} />;
});
