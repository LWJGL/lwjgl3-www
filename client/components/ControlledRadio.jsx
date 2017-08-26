// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import RadioGroup from './RadioGroup';
import Radio from './Radio';

type OwnProps = {
  name: string,
  spec: {
    value: (state: any, props: OwnProps) => mixed,
    options: (state: any, props: OwnProps) => any,
    hidden?: (state: any, props: OwnProps) => boolean,
    action: (value: any) => any,
  },
};

type Option = {
  label: string,
  value: any,
  disabled: boolean,
};

type Props = OwnProps & {
  value: any,
  hidden: boolean,
  options: Array<Option>,
  dispatch: (action: any) => void,
};

class ControlledRadio extends React.Component<Props, void> {
  select = (value: any) => {
    this.props.dispatch(this.props.spec.action(value));
  };

  render() {
    const { name, value, options } = this.props;

    return (
      <RadioGroup value={value} onChange={this.select}>
        {options.map((radio, i) => (
          <Radio key={`${name}${i}`} value={radio.value} label={radio.label} disabled={radio.disabled} />
        ))}
      </RadioGroup>
    );
  }
}

export default connect((state: any, ownProps: OwnProps) => {
  const spec = ownProps.spec;

  return {
    value: spec.value(state, ownProps),
    options: spec.options(state, ownProps),
    hidden: spec.hidden && spec.hidden(state, ownProps),
  };
})(ControlledRadio);
