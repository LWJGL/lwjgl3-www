import React from 'react';

interface Props {
  children?: React.ReactNode; // ignored
  source: string;
  tag?: string;
}

export function Html({ tag = 'div', source, children, ...rest }: Props) {
  const Container = tag;
  //@ts-ignore
  return <Container {...rest} dangerouslySetInnerHTML={{ __html: source }} />;
}
