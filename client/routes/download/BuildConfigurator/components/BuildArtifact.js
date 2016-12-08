import React from 'react'
import { connect } from 'react-redux'
import Checkbox from '../../../../components/Checkbox'
import { toggleArtifact } from '../actions'
import { IS_SAFARI } from '../../../../services/globals'

@connect(
  ({build}, ownProps) => {
    const artifact = build.artifacts.byId[ownProps.id];

    return {
      artifact,
      checked: build.availability[artifact.id] && build.contents[artifact.id],
      showDescriptions: build.descriptions,
      disabled: !build.availability[artifact.id]
        || IS_SAFARI
        || build.version === '3.0.0'
        || artifact.required
    }
  },
  {
    toggleArtifact
  }
)
class BuildArtifact extends React.Component {

  static propTypes = {
    id: React.PropTypes.string.isRequired,
  };

  toggle = () => {
    this.props.toggleArtifact(this.props.id);
  };

  render() {
    const {artifact, checked, disabled, showDescriptions} = this.props;

    return showDescriptions ? (
      <div>
        <Checkbox
          label={artifact.title}
          disabled={disabled}
          checked={checked}
          onChange={this.toggle}
        />
        <p><small>{artifact.description}</small></p>
      </div>
    ) : (
      <Checkbox
        label={artifact.title}
        disabled={disabled}
        checked={checked}
        onChange={this.toggle}
      />
    );
  }

}

export default BuildArtifact
