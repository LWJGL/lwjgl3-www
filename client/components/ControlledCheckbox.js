import React from 'react';
import { connect } from 'react-redux';
import Checkbox from './Checkbox';
import type { Dispatch } from 'redux';

type OwnProps = {
  spec: {
    label: string,
    action: (value: boolean) => {},
    checked?: (state: any) => boolean,
    disabled?: (state: any) => boolean,
    hidden?: (state: any) => boolean,
  },
};

type Props = OwnProps & {
  label: string,
  checked?: boolean,
  disabled?: boolean,
  hidden?: boolean,
  handleClick: (value: any) => mixed,
};

class ControlledCheckbox extends React.Component<void, Props, void> {
  toggle = () => {
    this.props.handleClick(!this.props.checked);
  };

  render() {
    const props = this.props;

    return (
      <Checkbox
        label={props.label}
        disabled={props.disabled}
        hidden={props.hidden}
        checked={props.checked}
        onChange={this.toggle}
      />
    );
  }
}

const ControlledCheckboxConnected = connect(
  (state: any, ownProps: OwnProps) => {
    const spec = ownProps.spec;

    return {
      label: spec.label,
      checked: spec.checked != null && spec.checked(state),
      disabled: spec.disabled != null && spec.disabled(state),
      hidden: spec.hidden != null && spec.hidden(state),
    };
  },
  (dispatch: Dispatch<any>, ownProps: OwnProps) => ({
    handleClick: value => dispatch(ownProps.spec.action(value)),
  })
)(ControlledCheckbox);

export default ControlledCheckboxConnected;
