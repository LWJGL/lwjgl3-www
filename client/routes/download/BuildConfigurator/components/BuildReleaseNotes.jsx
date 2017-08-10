import React from 'react';
import { connect } from 'react-redux';

class BuildReleaseNotes extends React.Component {
  render() {
    const v = this.props.version;
    return (
      <p>
        <a href={`https://github.com/LWJGL/lwjgl3/releases/tag/${v}`}>
          release notes for {v}
        </a>
      </p>
    );
  }
}

export default connect(state => {
  return {
    version: state.build.version,
  };
})(BuildReleaseNotes);
