import React from 'react'
import { connect } from 'react-redux'
import Checkbox from '../../../../components/Checkbox'
import { togglePlatform } from '../actions'
import { IS_SAFARI } from '../../../../services/globals'

import {
  NATIVE_WIN,
  NATIVE_LINUX,
  NATIVE_MAC
} from '../constants'

import FaWindows from '../../../../icons/windows'
import FaLinux from '../../../../icons/linux'
import FaMacOS from '../../../../icons/macos'

const getIcon = (platform) => {
  switch ( platform ) {
    case NATIVE_WIN:
      return <FaWindows />;
    case NATIVE_MAC:
      return <FaMacOS />;
    case NATIVE_LINUX:
      return <FaLinux />;
    default:
      return null;
  }
};

@connect(
  state => {
    const disabled = state.build.artifacts.version === '3.0.0' || IS_SAFARI;

    return {
      platforms: state.build.natives.allIds,
      natives: state.build.natives.byId,
      selected: disabled ? {[NATIVE_WIN]:true,[NATIVE_MAC]:true,[NATIVE_LINUX]:true} : state.build.platform,
      disabled: disabled,
      hide: state.build.mode !== 'zip',
    };
  },
  {
    togglePlatform
  }
)
class BuildPlatform extends React.Component {

  toggle = (platform) => {
    this.props.togglePlatform(platform);
  };

  render() {
    const props = this.props;

    if ( props.hide ) {
      return null;
    }

    return (
      <div>
        <h4>Natives</h4>
        <div className="custom-controls-stacked mb-1">
        {
          props.platforms.map(platform => {
            const native = props.natives[platform];

            return (
              <Checkbox
                key={platform}
                icon={getIcon(platform)}
                label={native.title}
                disabled={props.disabled}
                checked={props.selected[platform]}
                value={platform}
                onChange={this.toggle}
              />
            )
          })
        }
        </div>
      </div>
    )
  }

}

export default BuildPlatform
