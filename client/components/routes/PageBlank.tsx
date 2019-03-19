import React /*, { useEffect }*/ from 'react';
// import { start } from '../NavProgress';

interface Props {
  delay?: number;
}

export function PageBlank({ delay = 0 }: Props) {
  // useEffect(() => start(delay), []);

  return (
    <div
      style={{
        padding: '5rem 0',
        minHeight: 'calc(100vh - 4rem)',
      }}
    />
  );
}
