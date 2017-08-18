import * as React from 'react';
import { connect } from 'react-redux';
import Checkbox from './Checkbox';
import type { Dispatch } from 'redux';

type Spec = {
  label: string,
  action: (value: boolean) => {},
  checked?: (state: any) => boolean,
  disabled?: (state: any) => boolean,
  hidden?: (state: any) => boolean,
};

type OwnProps = {
  spec: Spec,
};

type Props = OwnProps & {
  label: string,
  checked?: boolean,
  disabled?: boolean,
  hidden?: boolean,
  handleClick: (value: boolean) => mixed,
};

class ControlledCheckbox extends React.Component<Props, void> {
  toggle = () => {
    this.props.handleClick(!this.props.checked);
  };

  render() {
    const props: Props = this.props;

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

const ControlledCheckboxConnected: Class<React$Component<OwnProps, void>> = connect(
  (state: any, ownProps: OwnProps) => {
    const spec: Spec = ownProps.spec;

    return {
      label: spec.label,
      checked: spec.checked != null && spec.checked(state),
      disabled: spec.disabled != null && spec.disabled(state),
      hidden: spec.hidden != null && spec.hidden(state),
    };
  },
  (dispatch: Dispatch<any>, ownProps: OwnProps) => ({
    handleClick: (value: boolean) => dispatch(ownProps.spec.action(value)),
  })
)(ControlledCheckbox);

export default ControlledCheckboxConnected;
