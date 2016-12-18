import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import Checkbox from './Checkbox'

@connect(
  (state, ownProps) => {
    const spec = ownProps.spec;

    return {
      checked: spec.checked && spec.checked(state),
      disabled: spec.disabled && spec.disabled(state),
      hidden: spec.hidden && spec.hidden(state),
      label: spec.label,
    }
  },
  (dispatch, ownProps) => ({
    handleClick: (value) => dispatch(ownProps.spec.action(value))
  })
)
class ControlledCheckbox extends React.Component {

  static propTypes = {
    spec: PropTypes.shape({
      label: PropTypes.string,
      checked: PropTypes.func,
      disabled: PropTypes.func,
      hidden: PropTypes.func,
    })
  };

  toggle = () => {
    this.props.handleClick(!this.props.checked);
  };

  render() {
    const props = this.props;

    return (
      <Checkbox
        label={props.label}
        disabled={props.disabled}
        hidden={props.hidden}
        checked={props.checked}
        onChange={this.toggle}
      />
    )
  }

}

export default ControlledCheckbox
