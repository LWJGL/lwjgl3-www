import * as React from 'react';

type Props = {
  source: string,
  tag?: string,
  props?: $Shape<HTMLElement>,
};

export function Html({ tag = 'div', source, children, ...props }: Props) {
  const Container = tag;
  return <Container {...props} dangerouslySetInnerHTML={{ __html: source }} />;
}
