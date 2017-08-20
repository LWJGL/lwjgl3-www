// @flow
import * as React from 'react';

type Props = {
  label: string,
  value?: any,
  checked?: boolean,
  onChange?: (value: any) => mixed,
  disabled?: boolean,
  hidden?: boolean,
  icon?: React$Element<*>,
};

class Checkbox extends React.PureComponent<Props, void> {
  static defaultProps = {
    checked: false,
    disabled: false,
    hidden: false,
  };

  change = () => {
    if (this.props.onChange) {
      this.props.onChange(this.props.value);
    }
  };

  render() {
    const props: Props = this.props;

    return props.hidden
      ? null
      : <label className={`custom-control custom-checkbox${props.disabled ? ' custom-control-disabled' : ''}`}>
          <input
            type="checkbox"
            className="custom-control-input"
            disabled={props.disabled}
            checked={props.checked}
            onChange={this.change}
          />
          <span className="custom-control-indicator" />
          <span className="custom-control-description">
            {props.icon ? props.icon : null}
            {props.icon ? ' ' : null}
            {props.label}
          </span>
        </label>;
  }
}

export default Checkbox;
