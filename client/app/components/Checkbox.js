import React, {PropTypes} from 'react'

export default class Checkbox extends React.PureComponent {

  static propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.any,
    checked: PropTypes.bool,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    hidden: PropTypes.bool,
  };

  static defaultProps = {
    checked: false,
    disabled: false,
    hidden: false,
  };

  change = () => {
    if ( this.props.onChange ) {
      this.props.onChange(this.props.value);
    }
  };

  render() {
    const props = this.props;

    return props.hidden ? null : (
      <div className="form-group">
        <label className="custom-control custom-checkbox">
          <input type="checkbox"
                 className="custom-control-input"
                 disabled={props.disabled}
                 checked={props.checked}
                 onChange={this.change}
          />
          <span className="custom-control-indicator"/>
          <span className="custom-control-description">{props.label}</span>
        </label>
      </div>
    );
  }
};