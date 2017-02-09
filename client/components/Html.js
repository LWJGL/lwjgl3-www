import React, { PropTypes } from 'react';

const Html = ({tag, source, children, ...rest}) => {
  const Container = tag;
  if ( source ) {
    return <Container {...rest} dangerouslySetInnerHTML={{__html: source}} />;
  }
  return (
    <Container {...rest}>
      {
        React.Children.map(children, (child) => {
          if ( typeof child === 'string' ) {
            return <span dangerouslySetInnerHTML={{__html: child}} />;
          } else {
            return child;
          }
        })
      }
    </Container>
  );
};

Html.propTypes = {
  tag: PropTypes.string,
  source: PropTypes.string,
};

Html.defaultProps = {
  tag: "div"
};

export default Html;
