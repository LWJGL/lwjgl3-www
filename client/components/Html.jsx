// @flow
import * as React from 'react';

type Props = {
  tag?: string,
  source?: string,
  children?: React.Node,
  props?: $Shape<HTMLElement>,
};

export const Html = ({ tag = 'div', source, children, ...props }: Props) => {
  const Container = tag;
  return source !== undefined ? (
    <Container {...props} dangerouslySetInnerHTML={{ __html: source }} />
  ) : (
    <Container {...props}>
      {React.Children.map(
        children,
        child => (typeof child === 'string' ? <span dangerouslySetInnerHTML={{ __html: child }} /> : child)
      )}
    </Container>
  );
};
