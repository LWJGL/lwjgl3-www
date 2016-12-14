import React from 'react'
import { connect } from 'react-redux'
import { downloadInit } from '../actions'
import { IS_SAFARI } from '../../../../services/globals'
import { MODE_ZIP } from '../constants'

import BuildToolbar from './BuildToolbar'
import FaCloudDownload from '../../../../icons/cloud-download'

@connect(
  ({build}) => ({
    build: build.build,
    mode: build.mode,
    version: build.version,
    fullZip: (
      build.version === '3.0.0'
      || IS_SAFARI
      || (
        build.preset === 'all'
        && build.source === true
        && build.javadoc === true
        && build.natives.allIds.every(platform => build.platform[platform])
        && build.selectedAddons.length === 0
      )
    )
  }),
  {
    downloadInit
  }
)
class BuildDownload extends React.Component {

  render() {
    const {mode, fullZip, build, version} = this.props;

    if ( mode !== MODE_ZIP ) {
      return null;
    }

    let attr;
    let UIElement;

    if ( fullZip ) {
      UIElement = 'a';

      attr = {
        download: `lwjgl-${build}-${version}.zip`
      };

      switch (build) {
        case 'release':
          attr.href = `https://build.lwjgl.org/${build}/${version}/lwjgl-${version}.zip`;
          break;
        default:
          attr.href = `https://build.lwjgl.org/${build}/lwjgl.zip`;
      }
    } else {
      UIElement = 'button';
      attr = {
        onClick: this.props.downloadInit
      };
    }

    return (
      <BuildToolbar>
        <UIElement className="btn btn-success" {...attr}><FaCloudDownload /> DOWNLOAD ZIP</UIElement>
      </BuildToolbar>
    )

  }

}

export default BuildDownload
