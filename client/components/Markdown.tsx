import * as React from 'react';
// https://github.com/jonschlinkert/remarkable
import * as Remarkable from 'remarkable';
import { Options } from 'remarkable';

interface Props {
  children?: React.ReactNode; // ignored
  tag?: string;
  source: string;
  options?: Options;
}

export const Markdown = React.memo(({ tag = 'div', source, options, children, ...rest }: Props) => {
  const Container = tag;
  //@ts-ignore
  return <Container {...rest} dangerouslySetInnerHTML={{ __html: new Remarkable(options).render(source) }} />;
});
