// @flow
import * as React from 'react';
// https://github.com/jonschlinkert/remarkable
import Remarkable from 'remarkable';
import type { RemarkableOptions, RemarkableSettings } from 'remarkable';

type Props = {
  tag: string,
  source?: string,
  children?: React.Node,
  options?: RemarkableOptions | RemarkableSettings,
};

export const Markdown = ({ tag = 'div', source, children, options, ...rest }: Props) => {
  const Container = tag;
  const md = new Remarkable(options);

  if (source != null) {
    return <Container {...rest} dangerouslySetInnerHTML={{ __html: md.render(source) }} />;
  }

  return (
    <Container {...rest}>
      {React.Children.map(children, child => {
        if (typeof child === 'string') {
          return <span dangerouslySetInnerHTML={{ __html: md.render(child) }} />;
        } else {
          return child;
        }
      })}
    </Container>
  );
};
