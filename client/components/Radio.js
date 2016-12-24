import React, { PropTypes } from 'react'

class Radio extends React.Component {

  static propTypes = {
    value: PropTypes.any.isRequired,
    label: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    disabled: false
  };

  static contextTypes = {
    onChange: PropTypes.func,
    value: PropTypes.any,
  };

  change = () => {
    this.context.onChange(this.props.value);
  };

  render() {
    const props = this.props;

    return (
      <label className={`custom-control custom-radio${props.disabled ? ' custom-control-disabled' : ''}`}>
        <input
          type="radio"
          className="custom-control-input"
          disabled={props.disabled}
          checked={this.context.value === props.value}
          onChange={this.change}
        />
        <span className="custom-control-indicator" />
        <span className="custom-control-description">{props.label}</span>
      </label>
    );
  }

}

export default Radio;
