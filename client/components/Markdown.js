import React from 'react';
import PropTypes from 'prop-types';
// https://github.com/jonschlinkert/remarkable
import Remarkable from 'remarkable';

const Markdown = ({ tag, source, children, options, ...rest }) => {
  const Container = tag;
  const md = new Remarkable(options);
  if (source) {
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

Markdown.propTypes = {
  tag: PropTypes.string,
  source: PropTypes.string,
  options: PropTypes.shape({
    html: PropTypes.bool,
    break: PropTypes.bool,
    xhtmlOut: PropTypes.bool,
    langPrefix: PropTypes.string,
    linkify: PropTypes.bool,
    typographer: PropTypes.bool,
    quotes: PropTypes.string,
    highlight: PropTypes.func,
  }),
};

Markdown.defaultProps = {
  tag: 'div',
};

export default Markdown;
