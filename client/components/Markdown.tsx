import * as React from 'react';
// https://github.com/jonschlinkert/remarkable
import Remarkable, { Options } from 'remarkable';

interface Props {
  tag?: string;
  source: string;
  options?: Options;
}

export const Markdown = React.memo(({ tag = 'div', source, options, ...rest }: Props) => {
  const Container = tag;
  return <Container {...rest} dangerouslySetInnerHTML={{ __html: new Remarkable(options).render(source) }} />;
});
