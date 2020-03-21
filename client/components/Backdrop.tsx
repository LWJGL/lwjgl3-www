import { useState, useEffect } from 'react';
import { cx } from '@emotion/css';

interface Props {
  className?: string;
}

export const Backdrop: React.FC<Props> = ({ className }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => void setMounted(true), []);
  return <div className={cx('overlay-backdrop', className, { open: mounted })} />;
};
