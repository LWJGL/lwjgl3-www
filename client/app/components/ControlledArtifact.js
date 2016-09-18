import React from 'react'
import {observer} from 'mobx-react'
import Checkbox from './Checkbox'

@observer(['store'])
class ControlledArtifact extends React.Component {

  static propTypes = {
    name: React.PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.props.store.toggleArtifact(this.props.name);
  }

  render() {
    const option = this.props.store.getArtifactOptions(this.props.name);

    return (
      <Checkbox
        label={option.label}
        disabled={option.disabled}
        checked={this.props.store.checked[this.props.name]}
        onChange={this.toggle}
      />
    )
  }

}

export default ControlledArtifact