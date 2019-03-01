import React from 'react';
// https://github.com/jonschlinkert/remarkable
import Remarkable from 'remarkable';
import { Options } from 'remarkable';

interface Props {
  tag?: string;
  source: string;
  options?: Options;
}

export const Markdown: React.FC<Props> = ({ tag: Container = 'div', source, options, children, ...rest }) => (
  //@ts-ignore
  <Container {...rest} dangerouslySetInnerHTML={{ __html: new Remarkable(options).render(source) }} />
);
