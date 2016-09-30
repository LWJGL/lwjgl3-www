import React, {PropTypes} from 'react'
import {connect} from 'react-redux'

@connect(
  (state, ownProps) => ({
    error: ownProps.selector(state)
  }),
  (dispatch, ownProps) => ({
    reset: () => dispatch(ownProps.reset())
  })
)
class ControlledAlert extends React.Component {

  static propTypes = {
    selector: PropTypes.func,
  };

  toggle = () => {
    this.props.reset()
  };

  render() {
    const props = this.props;

    if ( props.error === null ) {
      return null;
    }

    return (
      <div className={`alert alert-${props.error.severity||'danger'}`} role="alert" onClick={this.toggle}>
        {props.error.message}
      </div>
    )
  }

}

export default ControlledAlert
