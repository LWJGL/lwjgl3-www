// @flow
import * as React from 'react';
import { connect } from 'react-redux';

type ConnectedProps = {
  version: string,
};

class BuildReleaseNotes extends React.Component<ConnectedProps> {
  render() {
    const v = this.props.version;
    return (
      <p>
        <a href={`https://github.com/LWJGL/lwjgl3/releases/tag/${v}`} style={{ fontSize: '80%' }}>
          release notes for {v}
        </a>
      </p>
    );
  }
}

export default connect((state: Object): ConnectedProps => ({
  version: state.build.version,
}))(BuildReleaseNotes);
