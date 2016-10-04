import React from 'react'
import { connect } from 'react-redux'
import Checkbox from '../../../../components/Checkbox'
import { togglePlatform } from '../actions'

@connect(
  state => ({
    platforms: state.build.natives.allIds,
    natives: state.build.natives.byId,
    selected: state.build.build === 'nightly' ? state.build.platform : {"windows":true,"macos":true,"linux":true},
    disabled: state.build.build !== 'nightly',
    hide: state.build.mode !== 'zip',
  }),
  dispatch => ({
    togglePlatform: platform => dispatch(togglePlatform(platform))
  })
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
        <h2 className="m-b-1">Natives</h2>
        {
          props.platforms.map(platform => {
            const native = props.natives[platform];

            return (
              <Checkbox
                key={platform}
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
    )
  }

}

export default BuildPlatform
