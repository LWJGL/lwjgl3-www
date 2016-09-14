import React from 'react'

export default class Radio extends React.Component {

  static propTypes = {
    value: React.PropTypes.any.isRequired,
    label: React.PropTypes.string.isRequired,
    disabled: React.PropTypes.bool,
  };

  static defaultProps = {
    disabled: false
  };

  static contextTypes = {
    name: React.PropTypes.string,
    onChange: React.PropTypes.func,
    value: React.PropTypes.any,
  };

  constructor(props) {
    super(props);
    this.change = this.change.bind(this);
  }

  change() {
    this.context.onChange(this.props.value);
  }

  render() {
    return (
      <label className="custom-control custom-radio">
        <input name={this.context.name} type="radio" className="custom-control-input" value={this.props.value} disabled={this.props.disabled} checked={this.context.value===this.props.value} onChange={this.change} />
        <span className="custom-control-indicator" />
        <span className="custom-control-description">{this.props.label}</span>
      </label>
    )
  }

}
