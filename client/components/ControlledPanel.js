import React, {PropTypes} from 'react'
import {connect} from 'react-redux'

@connect(
  (state, props) => {
    const map = {};

    if ( props.predicate && !props.predicate(state) ) {
      map.style = { ...props.style, display: 'none'};
    }

    if ( props.getClassName ) {
      map.className = props.getClassName(state);
    }

    return map;
  },
  () => ({})
)
class Panel extends React.Component {

  static propTypes = {
    predicate: PropTypes.func,
    getClassName: PropTypes.func,
    className: PropTypes.string,
    style: PropTypes.object,
  };

  render() {
    const { children, predicate, getClassName, ...rest } = this.props;

    return (
      <div {...rest}>
        {children}
      </div>
    );
  }

}

export default Panel
