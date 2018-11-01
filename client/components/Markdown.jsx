// @flow
import * as React from 'react';
//$FlowFixMe
import { memo, useRef, useMutationEffect } from 'react';
// https://github.com/jonschlinkert/remarkable
import Remarkable from 'remarkable';
import type { RemarkableOptions, RemarkableSettings } from 'remarkable';

type Props = {
  tag?: string,
  source: string,
  options?: RemarkableOptions | RemarkableSettings,
};

export const Markdown = React.memo(({ tag = 'div', source, options, ...rest }: Props) => {
  const Container = tag;
  return <Container {...rest} dangerouslySetInnerHTML={{ __html: new Remarkable(options).render(source) }} />;
});
