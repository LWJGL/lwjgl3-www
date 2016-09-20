import React, {PropTypes} from 'react'

export default class RadioGroup extends React.PureComponent {

  static propTypes = {
    name: PropTypes.string,
    value: PropTypes.any,
    onChange: PropTypes.func,
  };

  static childContextTypes = {
    name: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.any,
  };

  getChildContext() {
    return {
      name: this.props.name,
      onChange: this.change,
      value: this.props.value
    }
  }

  change = value => {
    if ( value !== this.props.value && this.props.onChange ) {
      this.props.onChange(value);
    }
  };

  render() {
    return (
      <div className="custom-controls-stacked">{this.props.children}</div>
    );
  }

}
