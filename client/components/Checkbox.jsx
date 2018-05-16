// @flow
import * as React from 'react';
import { uniqueId } from 'lodash-es';

type Props = {
  label: string,
  value?: mixed,
  checked?: boolean,
  onChange?: (value: mixed) => mixed,
  disabled?: boolean,
  hidden?: boolean,
  icon?: React.Node,
};

export class Checkbox extends React.PureComponent<Props> {
  static defaultProps = {
    checked: false,
    disabled: false,
    hidden: false,
  };

  htmlForId: string = uniqueId('checkbox');
  change = this.change.bind(this);

  change() {
    if (this.props.onChange) {
      this.props.onChange(this.props.value);
    }
  }

  render() {
    const props: Props = this.props;

    return props.hidden === true ? null : (
      <div className="custom-control custom-checkbox">
        <input
          type="checkbox"
          id={this.htmlForId}
          className="custom-control-input"
          disabled={props.disabled}
          checked={props.checked}
          onChange={this.change}
        />
        <label className="custom-control-label" htmlFor={this.htmlForId}>
          {props.icon}
          {props.icon != null ? ' ' : null}
          {props.label}
        </label>
      </div>
    );
  }
}
