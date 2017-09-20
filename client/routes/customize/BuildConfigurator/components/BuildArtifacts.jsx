// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import BuildArtifact from './BuildArtifact';

type ConnectedProps = {
  artifacts: Array<string>,
};

class BuildArtifacts extends React.Component<ConnectedProps> {
  render() {
    return (
      <div className="custom-controls-stacked">
        {this.props.artifacts.map(it => <BuildArtifact key={it} id={it} />)}
      </div>
    );
  }
}

export default connect((state: Object): ConnectedProps => ({
  artifacts: state.build.artifacts.allIds,
}))(BuildArtifacts);
