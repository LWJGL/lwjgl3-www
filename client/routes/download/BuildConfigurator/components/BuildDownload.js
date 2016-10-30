import React from 'react'
import { connect } from 'react-redux'
import { downloadInit } from '../actions'
import { IS_SAFARI } from '../../../../services/globals'
import { BUILD_STABLE, MODE_ZIP } from '../constants'

@connect(
  ({build}) => ({
    build: build.build,
    mode: build.mode,
    version: build.version,
    fullZip:
         build.build === BUILD_STABLE
      || build.mode !== MODE_ZIP
      || IS_SAFARI
      || (
           build.preset === 'all'
        && build.source === true
        && build.javadoc === true
        && build.natives.allIds.every(platform => build.platform[platform])
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
        <div className="col-xs-12 col-lg-4">
          <h2 className="mb-2 mt-1">Bundle</h2>
          <a className="btn btn-xs-block btn-primary btn-lg" href={downloadUrl} target="_blank">DOWNLOAD ZIP</a>
        </div>
      )
    } else {
      return (
        <div className="col-xs-12 col-lg-4">
          <h2 className="mb-2 mt-1">Custom Bundle</h2>
          <button className="btn btn-xs-block btn-primary btn-lg" onClick={this.props.downloadInit}>GENERATE BUNDLE</button>
        </div>
      )
    }
  }

}

export default BuildDownload
