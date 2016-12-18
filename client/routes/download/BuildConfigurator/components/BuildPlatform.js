import React from 'react'
import { connect } from 'react-redux'
import Checkbox from '../../../../components/Checkbox'
import { togglePlatform } from '../actions'

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
  (state) => {
    return {
      platforms: state.build.natives.allIds,
      natives: state.build.natives.byId,
      selected: state.build.platform,
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
    const {hide, platforms, natives, selected} = this.props;

    if ( hide ) {
      return null;
    } else {
      return (
        <div>
          <h4>Natives</h4>
          <div className="custom-controls-stacked mb-1">
          {
            platforms.map(
              (platform) => (
                  <Checkbox
                    key={platform}
                    icon={getIcon(platform)}
                    label={natives[platform].title}
                    checked={selected[platform]}
                    value={platform}
                    onChange={this.toggle}
                  />
              )
            )
          }
          </div>
        </div>
      );
    }
  }

}

export default BuildPlatform
