import * as React from 'react';

interface Props {
  children?: React.ReactNode; // ignored
  source: string;
  tag?: string;
  props?: React.HTMLAttributes<any>;
}

export function Html({ tag = 'div', source, children, ...props }: Props) {
  const Container = tag;
  return <Container {...props} dangerouslySetInnerHTML={{ __html: source }} />;
}
