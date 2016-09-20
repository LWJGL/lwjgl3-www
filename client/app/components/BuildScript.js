import React from 'react'
import {observer} from 'mobx-react'

@observer(['store'])
class BuildScript extends React.Component {

  copyToClipboard = () => {
    this.refs.script.select();
    document.execCommand('copy');
    this.refs.script.blur();
  };

  autoHeight = () => {
    this.refs.script.style.height = `${Math.min((this.refs.script.value.match(/\n/g).length + 1) * 20, 700)}px`;
  };

  render() {
    const store = this.props.store;

    if ( store.mode === 'zip' ) {
      return null;
    }

    setImmediate(this.autoHeight);

    return (
      <div className="col-xs-12 col-lg-6">
        <h2 className="m-b-2 m-t-1">Snippet</h2>
        <textarea ref="script" className="script" readOnly={true} value={store.script} wrap="off"/>
        <a
          className="btn btn-xs-block btn-primary"
          download={store.filename}
          href={`data:${store.mime};base64,${btoa(store.script)}`}
        >
          DOWNLOAD SNIPPET
        </a>
        <button className="btn btn-xs-block btn-primary" onClick={this.copyToClipboard}>COPY TO CLIPBOARD</button>
      </div>
    )
  }

}

export default BuildScript