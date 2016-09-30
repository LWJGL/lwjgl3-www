import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import RadioGroup from './RadioGroup'
import Radio from './Radio'

@connect(
  (state, ownProps) => {
    const spec = ownProps.spec;

    return {
      name: spec.name,
      value: spec.value(state, ownProps),
      hidden: spec.hidden ? spec.hidden(state, ownProps) : false,
      options: spec.options(state, ownProps)
    }
  },
  (dispatch, ownProps) => ({
    handleChange: value => dispatch(ownProps.spec.action(value))
  })
)
class ControlledRadio extends React.Component {

  static propTypes = {
    spec: PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.func,
      hidden: PropTypes.func,
      options: PropTypes.func,
    })
  };

  select = (value) => {
    this.props.handleChange(value);
  };

  render() {
    const props = this.props;

    return (
      <RadioGroup name={props.name} value={props.value} onChange={this.select}>
        {
          props.options.map(
            (radio, i) => <Radio key={`${props.name}${i}`} value={radio.value} label={radio.label} disabled={radio.disabled} />
          )
        }
      </RadioGroup>
    )
  }

}

export default ControlledRadio
