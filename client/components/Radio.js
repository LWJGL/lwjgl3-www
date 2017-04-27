import React from 'react';
import PropTypes from 'prop-types';

type DefaultProps = {
  disabled: boolean,
};

type Props = {
  value: any,
  label: string,
  disabled: boolean,
};

class Radio extends React.Component<DefaultProps, Props, void> {
  static defaultProps = {
    disabled: false,
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
