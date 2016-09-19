import React from 'react'

export default class RadioGroup extends React.PureComponent {

  static propTypes = {
    name: React.PropTypes.string,
    value: React.PropTypes.any,
    onChange: React.PropTypes.func,
  };

  static childContextTypes = {
    name: React.PropTypes.string,
    onChange: React.PropTypes.func,
    value: React.PropTypes.any,
  };

  getChildContext() {
    return {
      name: this.props.name,
      onChange: this.change,
      value: this.props.value
    }
  }

  constructor(props) {
    super(props);
    this.change = this.change.bind(this);
  }

  change(value) {
    if ( value !== this.props.value && this.props.onChange ) {
      this.props.onChange(value);
    }
  }

  render() {
    return (
      <div className="custom-controls-stacked">{this.props.children}</div>
    );
  }

}
