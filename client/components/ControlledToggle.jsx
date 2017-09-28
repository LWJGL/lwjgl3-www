// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import Toggle from './Toggle';
import type { Dispatch } from 'redux';

type OwnProps = {|
  spec: {|
    label: string,
    action: (value: boolean) => { type: 'string' /* ... */ },
    checked?: (state: any) => boolean,
    disabled?: (state: any) => boolean,
    hidden?: (state: any) => boolean,
  |},
|};

type ConnectedProps = {|
  label: string,
  checked?: boolean,
  disabled?: boolean,
  hidden?: boolean,
  handleClick: (value: any) => mixed,
|};

type Props = {|
  ...OwnProps,
  ...ConnectedProps,
|};

class ControlledToggle extends React.Component<Props> {
  toggle = () => {
    this.props.handleClick(!this.props.checked);
  };

  render() {
    const { label, disabled, hidden, checked } = this.props;
    return <Toggle label={label} disabled={disabled} hidden={hidden} checked={checked} onChange={this.toggle} />;
  }
}

export default connect(
  (state: any, ownProps: OwnProps) => {
    const spec = ownProps.spec;

    return {
      checked: spec.checked && spec.checked(state),
      disabled: spec.disabled && spec.disabled(state),
      hidden: spec.hidden && spec.hidden(state),
      label: spec.label,
    };
  },
  (dispatch: Dispatch<*>, ownProps: OwnProps) => ({
    handleClick: value => dispatch(ownProps.spec.action(value)),
  })
)(ControlledToggle);
