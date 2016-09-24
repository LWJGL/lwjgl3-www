import React, {PropTypes} from 'react'

export default class Radio extends React.Component {

  static propTypes = {
    value: PropTypes.any.isRequired,
    label: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    disabled: false
  };

  static contextTypes = {
    name: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.any,
  };

  change = () => {
    this.context.onChange(this.props.value);
  };

  render() {
    const ctx = this.context;
    const props = this.props;

    return (
      <label className="custom-control custom-radio">
        <input name={ctx.name} type="radio" className="custom-control-input" value={props.value} disabled={props.disabled} checked={ctx.value === props.value} onChange={this.change} />
        <span className="custom-control-indicator" />
        <span className="custom-control-description">{props.label}</span>
      </label>
    );
  }

}
