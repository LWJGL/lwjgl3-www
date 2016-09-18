import React from 'react'
import {observer} from 'mobx-react'
import ControlledArtifact from './ControlledArtifact'

@observer(['store'])
class BuildArtifacts extends React.Component {

  render() {
    const store = this.props.store;

    return (
      <div>
        {
          store
            .config
            .artifacts
            .map(item => (
              <div key={item.id}>
                <ControlledArtifact name={item.id} />
                {
                  store.descriptions
                    ?
                    <p className="m-b-2" style={{marginTop: '-1rem'}}>
                      <small>{item.description}</small>
                    </p>
                    : null
                }
              </div>
            ))
        }
      </div>
    )
  }

}

export default BuildArtifacts