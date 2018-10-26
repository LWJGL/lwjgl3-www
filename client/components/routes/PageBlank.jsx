// @flow
//$FlowFixMe
import React, { useEffect } from 'react';
import { start, end } from '../NavProgress';

type Props = {
  delay?: number,
};

const styles = {
  padding: '5rem 0',
  minHeight: 'calc(100vh - 4rem)',
};

export function PageBlank({ delay = 0 }: Props) {
  useEffect(() => {
    start(delay);
    return end;
  }, []);

  return <div style={styles} />;
}
