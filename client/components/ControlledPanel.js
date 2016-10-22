import React, {PropTypes} from 'react'
import {connect} from 'react-redux'

@connect(
  (state, props) => {
    const map = {};

    map.hidden = props.predicate && !props.predicate(state);

    if ( props.getClassName ) {
      map.className = props.getClassName(state);
    }

    return map;
  }
)
class Panel extends React.Component {

  static propTypes = {
    predicate: PropTypes.func,
    getClassName: PropTypes.func,
    className: PropTypes.string,
  };

  render() {
    const { children, hidden, className } = this.props;

    return hidden ? null : (
      <div className={className}>
        {children}
      </div>
    );
  }

}

export default Panel
