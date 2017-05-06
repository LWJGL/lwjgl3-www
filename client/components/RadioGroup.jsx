import React from 'react';
import PropTypes from 'prop-types';

type Props = {
  children?: React$Element<*>,
  value: any,
  onChange?: (value: any) => mixed,
};

class RadioGroup extends React.PureComponent<void, Props, void> {
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
