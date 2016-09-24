import React from 'react'
import {observer} from 'mobx-react'
import Checkbox from './Checkbox'

@observer(['store'])
class ControlledCheckbox extends React.Component {

  static propTypes = {
    name: React.PropTypes.string.isRequired,
  };

  toggle = () => {
    this.props.store.setOption(this.props.name);
  };

  render() {
    const option = this.props.store.getOptions(this.props.name);

    return (
      <Checkbox
        label={option.label}
        disabled={option.disabled}
        hidden={option.hidden}
        checked={this.props.store[this.props.name]}
        onChange={this.toggle}
      />
    )
  }

}

export default ControlledCheckbox