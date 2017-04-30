import React from 'react';
import { connect } from 'react-redux';
import reduxSaga from '../../store/saga';
import { css } from 'aphrodite/no-important';
import styles from './styles';
import LoaderSpinner from '../LoaderSpinner';
import { loadStatus, saga } from './reducer';
import type { TcStatus, TcStatusObject } from './reducer';
import typeof { loadStatus as LoadStatus } from './reducer';

type OwnProps = {
  name: string,
};

type ConnectProps = OwnProps &
  TcStatusObject & {
    loadStatus: LoadStatus,
  };

class BuildStatus extends React.Component<void, ConnectProps, void> {
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

reduxSaga.run(saga);

export default connect(
  (state, props) => ({
    status: 'loading',
    ...state.teamcityStatus[props.name],
  }),
  {
    loadStatus,
  }
)(BuildStatus);
