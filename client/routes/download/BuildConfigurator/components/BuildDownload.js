import React from 'react'
import { connect } from 'react-redux'
import { downloadInit } from '../actions'
import { IS_SAFARI } from '../../../../services/globals'
import { MODE_ZIP } from '../constants'

@connect(
  ({build}) => ({
    build: build.build,
    mode: build.mode,
    version: build.version,
    fullZip:
         build.version === '3.0.0'
      || IS_SAFARI
      || (
           build.preset === 'all'
        && build.source === true
        && build.javadoc === true
        && build.natives.allIds.every(platform => build.platform[platform])
        && build.selectedAddons.length === 0
      )
  }),
  {
    downloadInit
  }
)
class BuildDownload extends React.Component {

  render() {
    const props = this.props;

    if ( props.mode !== MODE_ZIP ) {
      return null;
    } else if ( props.fullZip ) {
      let downloadUrl;
      switch (props.build) {
        case 'release':
          downloadUrl = `https://build.lwjgl.org/${props.build}/${props.version}/lwjgl-${props.version}.zip`;
          break;
        default:
          downloadUrl = `https://build.lwjgl.org/${props.build}/lwjgl.zip`;
      }

      return (
        <div className="download-toolbar">
          <a className="btn btn-success" download={`lwjgl-${props.build}-${props.version}.zip`} href={downloadUrl}>DOWNLOAD ZIP</a>
        </div>
      )
    } else {
      return (
        <div className="download-toolbar">
          <button className="btn btn-success" onClick={this.props.downloadInit}>DOWNLOAD ZIP</button>
        </div>
      )
    }
  }

}

export default BuildDownload
