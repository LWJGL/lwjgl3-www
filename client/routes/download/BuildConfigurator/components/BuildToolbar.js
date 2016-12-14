import React from 'react'
import { connect } from 'react-redux'

import FaFloppy from '../../../../icons/floppy-o'
import FaFolderOpen from '../../../../icons/folder-open-o'

@connect(
  ({breakpoint}) => ({
    breakpoint
  })
)
class BuildToolbar extends React.Component {

  render() {
    const {current, sm} = this.props.breakpoint;
    const showLabels = current > sm;

    return (
      <div className="download-toolbar">
        {this.props.children}
        <button className="btn btn-outline-info" title="Open configuration"><FaFolderOpen />{showLabels ? ` Open config` : null}</button>
        <button className="btn btn-outline-info" title="Save configuration"><FaFloppy />{showLabels ? ` Save config` : null}</button>
      </div>
    )
  }

}

export default BuildToolbar
