import React from 'react'
import { connect } from 'react-redux'
import Checkbox from '../../../../components/Checkbox'
import { toggleArtifact } from '../actions'
import { IS_SAFARI } from '../../../../services/globals'
import classnames from 'classnames'
import {
  NATIVE_WIN,
  NATIVE_LINUX,
  NATIVE_MAC
} from '../constants'

import FaWindows from '../../../../icons/windows'
import FaLinux from '../../../../icons/linux'
import FaMacOS from '../../../../icons/macos'

const getPlatformIcons = (platforms) => {
  return (
    <p>
      <em>Supported platforms: &nbsp;</em>
      {
        platforms.map(platform => {
          switch ( platform ) {
            case NATIVE_WIN:
              return <FaWindows key="fa-win" />;
            case NATIVE_MAC:
              return <FaMacOS key="fa-mac" />;
            case NATIVE_LINUX:
              return <FaLinux key="fa-linux" />;
            default:
              return null;
          }
        })
      }
    </p>
  );
};

@connect(
  ({build}, ownProps) => {
    const artifact = build.artifacts.byId[ownProps.id];

    return {
      artifact,
      checked: build.availability[artifact.id] && build.contents[artifact.id],
      showDescriptions: build.descriptions,
      disabled: !build.availability[artifact.id]
        || IS_SAFARI
        || build.artifacts.version === '3.0.0'
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
      <div className={classnames('artifact', {'text-muted':disabled})}>
        <Checkbox
          label={artifact.title}
          disabled={disabled}
          checked={checked}
          onChange={this.toggle}
        />
        { artifact.natives ? getPlatformIcons(artifact.natives) : null }
        <p>{artifact.description}</p>
        { artifact.website ? <p><a href={artifact.website} target="_blank">{artifact.website}</a></p> : null }
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
