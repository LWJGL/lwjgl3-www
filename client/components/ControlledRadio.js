import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import RadioGroup from './RadioGroup';
import Radio from './Radio';

@connect((state, ownProps) => {
  const spec = ownProps.spec;

  return {
    value: spec.value(state, ownProps),
    options: spec.options(state, ownProps),
    hidden: spec.hidden && spec.hidden(state, ownProps),
  };
})
class ControlledRadio extends React.Component {
  static propTypes = {
    spec: PropTypes.shape({
      value: PropTypes.func,
      options: PropTypes.func,
      hidden: PropTypes.func,
    }),
  };

  select = value => {
    this.props.dispatch(this.props.spec.action(value));
  };

  render() {
    const props = this.props;

    return (
      <RadioGroup value={props.value} onChange={this.select}>
        {props.options.map((radio, i) => (
          <Radio key={`${props.name}${i}`} value={radio.value} label={radio.label} disabled={radio.disabled} />
        ))}
      </RadioGroup>
    );
  }
}

export default ControlledRadio;
