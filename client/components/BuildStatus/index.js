import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoaderSpinner from '../LoaderSpinner';
import { loadStatus } from './reducer';

@connect(
  (state, props) => ({
    ...state.buildStatus[props.name],
  }),
  {
    loadStatus,
  }
)
class BuildStatus extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
  };

  componentDidMount() {
    const { name, loadStatus, version, error } = this.props;

    if (version === undefined && error === undefined) {
      loadStatus(name);
    }
  }

  render() {
    const { version, lastModified, error } = this.props;
    const loading = version === undefined && error === undefined;

    return (
      <p className="my-0">
        {loading && <LoaderSpinner size={16} />}
        {version}
        {error}
        <br />
        {lastModified || <br />}
      </p>
    );
  }
}

export default BuildStatus;
