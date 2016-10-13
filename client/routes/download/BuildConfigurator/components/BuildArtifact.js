import React from 'react'
import { connect } from 'react-redux'
import Checkbox from '../../../../components/Checkbox'
import { toggleArtifact } from '../actions'
import { IS_SAFARI } from '../../../../services/globals'

const descriptionStyle = {
  marginTop: '-1rem',
};

@connect(
  (state, ownProps) => {
    const artifact = state.build.artifacts.byId[ownProps.id];
    const available =
      (
        artifact.builds.length === state.build.builds.allIds.length
        || artifact.builds.some(build => build === state.build.build)
      )
      &&
      (
           state.build.mode === 'zip'
        || artifact.natives === undefined
        || artifact.natives.length === state.build.natives.allIds.length
        || artifact.natives.some(platform => state.build.platform[platform])
      );

    return {
      artifact,
      checked: available && state.build.contents[ownProps.id] === true,
      showDescriptions: state.build.descriptions,
      disabled: !available || ( state.build.mode === 'zip' && ( state.build.build !== 'nightly' || IS_SAFARI ) ) || ownProps.id === 'lwjgl',
    }
  },
  {
    toggleArtifact
  }
)
class ControlledArtifact extends React.Component {

  static propTypes = {
    id: React.PropTypes.string.isRequired,
  };

  toggle = () => {
    const props = this.props;
    props.toggleArtifact(props.id);
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
        <p className="m-b-2" style={descriptionStyle}>
          <small>{artifact.description}</small>
        </p>
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

export default ControlledArtifact
