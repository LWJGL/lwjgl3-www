import React from 'react'

export default class Checkbox extends React.PureComponent {

  static propTypes = {
    label: React.PropTypes.string.isRequired,
    value: React.PropTypes.any,
    checked: React.PropTypes.bool,
    onChange: React.PropTypes.func,
    disabled: React.PropTypes.bool,
    hidden: React.PropTypes.bool,
  };

  static defaultProps = {
    checked: false,
    disabled: false,
    hidden: false,
  };

  constructor(props) {
    super(props);
    this.change = this.change.bind(this);
  }

  change() {
    if ( this.props.onChange ) {
      this.props.onChange(this.props.value);
    }
  }

  render() {
    if ( this.props.hidden ) {
      return null;
    }
    return (
      <div className="form-group">
        <label className="custom-control custom-checkbox">
          <input type="checkbox" className="custom-control-input" disabled={this.props.disabled} checked={this.props.checked} onChange={this.change} />
          <span className="custom-control-indicator" />
          <span className="custom-control-description">{this.props.label}</span>
        </label>
      </div>
    )
  }

}