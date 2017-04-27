/*
import React from 'react';
import PropTypes from 'prop-types';
// https://github.com/jonschlinkert/remarkable
import Remarkable from 'remarkable';

type Props = {
  tag: string,
  source?: string,
  children?: React$Element<*>,
  options: {
    html: boolean,
    break: boolean,
    xhtmlOut: boolean,
    langPrefix: string,
    linkify: boolean,
    typographer: boolean,
    quotes: string,
    highlight: Function,
  },
};

const Markdown = ({ tag = 'div', source, children, options, ...rest }: Props) => {
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

export default Markdown;
*/
export default null;
