// @flow
import * as React from 'react';
import { uniqueId } from 'lodash-es';
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

  htmlForId: string;

  constructor(props: Props) {
    super(props);
    this.htmlForId = uniqueId('radio');
    (this: any).change = this.change.bind(this);
  }

  change() {
    this.context.onChange(this.props.value);
  }

  render() {
    const props = this.props;

    return (
      <div className="custom-control custom-radio">
        <input
          type="radio"
          id={this.htmlForId}
          className="custom-control-input"
          disabled={props.disabled}
          checked={this.context.value === props.value}
          onChange={this.change}
        />
        <label className="custom-control-label" htmlFor={this.htmlForId}>
          {props.label}
        </label>
      </div>
    );
  }
}
