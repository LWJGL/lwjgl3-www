import React from 'react'
import {connect} from 'react-redux'
import Checkbox from '../../../../components/Checkbox'
import {toggleArtifact} from '../actions'

const descriptionStyle = {
  marginTop: '-1rem',
};

@connect(
  (state, ownProps) => {
    const artifact = state.build.artifacts.byId[ownProps.id];
    const available = !artifact.natives || artifact.natives.indexOf(state.build.platform) > -1;

    return {
      artifact,
      checked: available && state.build.contents[ownProps.id] === true,
      showDescriptions: state.build.descriptions,
      disabled: !available || state.build.mode === 'zip' || ownProps.id === 'lwjgl',
    }
  },
  dispatch => ({
    toggleArtifact: (artifact, checked) => dispatch(toggleArtifact(artifact, checked))
  })
)
class ControlledArtifact extends React.Component {

  static propTypes = {
    id: React.PropTypes.string.isRequired,
  };

  toggle = () => {
    const props = this.props;
    props.toggleArtifact(props.id, !props.checked);
  };

  render() {
    const {artifact, checked, disabled, showDescriptions} = this.props;

    if ( !showDescriptions ) {
      return (
        <Checkbox
          label={artifact.title}
          disabled={disabled}
          checked={checked}
          onChange={this.toggle}
        />
      )
    } else {
      return (
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
      )
    }
  }

}

export default ControlledArtifact
