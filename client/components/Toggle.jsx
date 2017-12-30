// @flow
import * as React from 'react';
import { uniqueId } from 'lodash-es';

type Props = {
  label: string,
  value?: any,
  checked?: boolean,
  disabled?: boolean,
  hidden?: boolean,
  onChange?: (value: any) => mixed,
};

export class Toggle extends React.PureComponent<Props> {
  static defaultProps = {
    checked: false,
    disabled: false,
    hidden: false,
  };

  htmlForId: string;

  constructor(props: Props) {
    super(props);
    this.htmlForId = uniqueId('toggle');
    (this: any).change = this.change.bind(this);
  }

  change() {
    if (this.props.onChange != null) {
      this.props.onChange(this.props.value);
    }
  }

  render() {
    const props = this.props;

    return props.hidden === true ? null : (
      <div className="custom-control custom-toggle">
        <input
          type="checkbox"
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
