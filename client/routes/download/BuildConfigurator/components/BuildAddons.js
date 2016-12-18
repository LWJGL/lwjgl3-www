import React from 'react'
import { connect } from 'react-redux'
import BuildAddon from './BuildAddon'

@connect(
  ({build}) => ({
    addons: build.addons.allIds
  })
)
class BuildAddons extends React.Component {

  render() {
    const {addons} = this.props;

    return (
      <div className="custom-controls-stacked">
        {
          addons.map((it) => <BuildAddon key={it} id={it} />)
        }
      </div>
    )
  }

}

export default BuildAddons
