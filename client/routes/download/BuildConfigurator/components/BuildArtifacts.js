import React from 'react';
import { connect } from 'react-redux';
import BuildArtifact from './BuildArtifact';

class BuildArtifacts extends React.Component {
  render() {
    return (
      <div className="custom-controls-stacked">
        {this.props.artifacts.map(it => <BuildArtifact key={it} id={it} />)}
      </div>
    );
  }
}

export default connect(state => ({
  artifacts: state.build.artifacts.allIds,
}))(BuildArtifacts);
