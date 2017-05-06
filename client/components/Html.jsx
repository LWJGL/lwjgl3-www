import React from 'react';

type Props = {
  tag?: string,
  source?: string,
  children?: React$Element<*>,
  props?: $Shape<HTMLElement>,
};

const Html = ({ tag = 'div', source, children, ...props }: Props) => {
  const Container = tag;
  if (source !== undefined) {
    return <Container {...props} dangerouslySetInnerHTML={{ __html: source }} />;
  }
  return (
    <Container {...props}>
      {React.Children.map(children, child => {
        if (typeof child === 'string') {
          return <span dangerouslySetInnerHTML={{ __html: child }} />;
        } else {
          return child;
        }
      })}
    </Container>
  );
};

export default Html;
