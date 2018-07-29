// @flow
import * as React from 'react';
import uniqueId from 'lodash-es/uniqueId';

type Props = {
  value: any,
  label: string,
  disabled: boolean,
  checked: boolean,
  onChange: (value: any) => void,
};

export class Radio extends React.PureComponent<Props> {
  htmlForId: string = uniqueId('radio');

  change = this.change.bind(this);
  change() {
    this.props.onChange(this.props.value);
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
          checked={props.checked}
          onChange={this.change}
        />
        <label className="custom-control-label" htmlFor={this.htmlForId}>
          {props.label}
        </label>
      </div>
    );
  }
}
