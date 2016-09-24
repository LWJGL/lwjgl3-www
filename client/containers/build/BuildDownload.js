import React from 'react'
import {observer} from 'mobx-react'

@observer(['store'])
class BuildDownload extends React.Component {

  static propTypes = {
    store: React.PropTypes.object
  };

  render() {
    const store = this.props.store;

    return store.mode !== 'zip' ? null : (
      <div className="col-xs-12 col-lg-4">
        <h2 className="m-b-2 m-t-1">Bundle</h2>
        <a className="btn btn-xs-block btn-primary btn-lg" href={store.download} target="_blank">DOWNLOAD ZIP</a>
      </div>
    )
  }

}

export default BuildDownload