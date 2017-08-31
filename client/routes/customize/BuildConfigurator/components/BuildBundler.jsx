// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import LoaderSpinner from '~/components/LoaderSpinner';

type Props = {
  progress: Array<string>,
};

class BuildBundler extends React.Component<Props> {
  componentDidMount() {
    document.getElementsByClassName('config-container')[0].scrollIntoView(true);
  }

  render() {
    return (
      <div className="col">
        <div className="text-center">
          <LoaderSpinner size={32} style={{ marginBottom: '1rem' }} />
          <h4>Generating ZIP bundle. Please wait...</h4>
        </div>
        <pre>
          {this.props.progress
            .slice(0)
            .reverse()
            .map((line, i) => <div key={`log${i}`}>{line}</div>)}
        </pre>
      </div>
    );
  }
}

export default connect(state => ({
  progress: state.build.progress,
}))(BuildBundler);
