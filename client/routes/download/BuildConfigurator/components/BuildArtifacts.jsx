// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import BuildArtifact from './BuildArtifact';

type Props = {
  artifacts: Array<string>,
};

class BuildArtifacts extends React.Component<Props> {
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
