import React from 'react';
import { useEffect, useContext } from 'react';
import { NavProgressContext } from '../NavProgress';

interface Props {
  delay?: number;
}

const styles = {
  padding: '5rem 0',
  minHeight: 'calc(100vh - 4rem)',
};

export function PageBlank({ delay = 0 }: Props) {
  const { start } = useContext(NavProgressContext);
  useEffect(() => start(delay), []);
  return <div style={styles} />;
}
