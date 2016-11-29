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
         build.mode !== MODE_ZIP
      || build.version === '3.0.0'
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
    }

    if ( props.fullZip ) {
      let downloadUrl;
      switch (props.build) {
        case 'release':
          downloadUrl = `https://build.lwjgl.org/${props.build}/${props.version}/lwjgl-${props.version}.zip`;
          break;
        default:
          downloadUrl = `https://build.lwjgl.org/${props.build}/lwjgl.zip`;
      }

      return (
        <div className="col-xs-12 col-md-4">
          <h2 className="mb-2 mt-1">Bundle</h2>
          <a className="btn btn-xs-block btn-primary btn-lg" download={`lwjgl-${props.build}-${props.version}.zip`} href={downloadUrl}>DOWNLOAD ZIP</a>
        </div>
      )
    } else {
      return (
        <div className="col-xs-12 col-md-4">
          <h2 className="mb-2 mt-1">Custom Bundle</h2>
          <button className="btn btn-xs-block btn-primary btn-lg" onClick={this.props.downloadInit}>GENERATE BUNDLE</button>
        </div>
      )
    }
  }

}

export default BuildDownload
