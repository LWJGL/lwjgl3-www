import React from 'react';
import { css } from 'aphrodite/no-important';
import { connect } from 'react-redux';
import styles from './styles';
import LoaderSpinner from '../LoaderSpinner';
import { loadStatus } from './reducer';

type Props = {
  name: string,
  status: 'loading' | 'passing' | 'failing',
  build?: string,
  loadStatus: string => void,
};

class BuildStatus extends React.Component<void, Props, void> {
  componentDidMount() {
    const { status, loadStatus, name } = this.props;

    if (status === 'loading') {
      loadStatus(name);
    }
  }

  render() {
    const { status, build } = this.props;

    return (
      <div className={css(styles.container)}>
        <span className={css(styles.common, styles.build)}>build</span>
        <span className={css(styles.common, styles.status, styles[status])}>
          {status}
          {status === 'loading' && <LoaderSpinner size={14} style={{ marginLeft: 4, stroke: 'white' }} />}
        </span>
        {build != null && <small style={{ color: 'gray' }}> #{build}</small>}
      </div>
    );
  }
}

export default connect(
  (state, props) => ({
    status: 'loading',
    ...state.teamcityStatus[props.name],
  }),
  {
    loadStatus,
  }
)(BuildStatus);
