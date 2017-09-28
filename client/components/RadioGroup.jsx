// @flow
import * as React from 'react';
import PropTypes from 'prop-types';
import Radio from './Radio';

type Props = {
  children?: React.ChildrenArray<React.Element<Class<Radio>>>,
  value: any,
  onChange?: (value: any) => mixed,
};

class RadioGroup extends React.PureComponent<Props> {
  static childContextTypes = {
    onChange: PropTypes.func,
    value: PropTypes.any,
  };

  getChildContext() {
    return {
      onChange: this.change,
      value: this.props.value,
    };
  }

  change = (value: any) => {
    if (value !== this.props.value && this.props.onChange != null) {
      this.props.onChange(value);
    }
  };

  render() {
    return <div className="custom-controls-stacked">{this.props.children}</div>;
  }
}

export default RadioGroup;
