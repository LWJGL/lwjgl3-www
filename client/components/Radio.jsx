// @flow
import * as React from 'react';
import PropTypes from 'prop-types';

type Props = {
  value: any,
  label: string,
  disabled: boolean,
};

export class Radio extends React.Component<Props> {
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
