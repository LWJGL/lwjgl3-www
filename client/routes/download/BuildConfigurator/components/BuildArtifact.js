import React from 'react'
import { connect } from 'react-redux'
import Checkbox from '../../../../components/Checkbox'
import { toggleArtifact } from '../actions'
import { IS_SAFARI } from '../../../../services/globals'
import { MODE_ZIP } from '../constants'

@connect(
  ({build}, ownProps) => {
    const artifact = build.artifacts.byId[ownProps.id];
    const since = build.versions.byId[artifact.since].semver;
    const semver = build.versions.byId[build.version].semver;

    const available =
      (
           artifact.builds.length === build.builds.allIds.length
        || artifact.builds.some(build => build === build.build)
      )
      &&
      (
           build.mode === MODE_ZIP
        || artifact.natives === undefined
        || artifact.natives.length === build.natives.allIds.length
        || artifact.natives.some(platform => build.platform[platform])
      )
      &&
      (
        semver[2] * 100 + semver[1] * 10 + semver[0] >= since[2] * 100 + since[1] * 10 + since[0]
      );

    return {
      artifact,
      checked: available && build.contents[ownProps.id] === true,
      showDescriptions: build.descriptions,
      disabled: !available
        || IS_SAFARI
        || build.version === '3.0.0'
        || ownProps.id === 'lwjgl',
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

export default ControlledArtifact
