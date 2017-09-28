// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { type Dispatch } from 'redux';
import RadioGroup from './RadioGroup';
import Radio from './Radio';

type OwnProps = {|
  spec: {|
    name: string,
    value: (state: any, props: OwnProps) => mixed,
    options: (state: any, props: OwnProps) => any,
    hidden?: (state: any, props: OwnProps) => boolean,
    action: (value: any) => any,
  |},
|};

type Option = {|
  label: string,
  value: any,
  disabled: boolean,
|};

type ConnectedProps = {|
  value: any,
  options: Array<Option>,
  hidden: boolean,
  dispatch: Dispatch<*>,
|};

type Props = {|
  ...OwnProps,
  ...ConnectedProps,
|};

class ControlledRadio extends React.Component<Props> {
  select = (value: any) => {
    this.props.dispatch(this.props.spec.action(value));
  };

  render() {
    const { spec: { name }, value, options } = this.props;

    return (
      <RadioGroup value={value} onChange={this.select}>
        {options.map((radio, i) => (
          <Radio
            key={`${name}-${typeof radio.value === 'string' ? radio.value : i}`}
            value={radio.value}
            label={radio.label}
            disabled={radio.disabled}
          />
        ))}
      </RadioGroup>
    );
  }
}

export default connect(
  (state: Object, ownProps: OwnProps) => {
    const spec = ownProps.spec;

    return {
      value: spec.value(state, ownProps),
      options: spec.options(state, ownProps),
      hidden: spec.hidden !== undefined && spec.hidden(state, ownProps),
    };
  },
  dispatch => ({ dispatch })
)(ControlledRadio);
